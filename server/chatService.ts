import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { storage } from './storage';
import { isAuthenticated } from './replitAuth';
import { Request } from 'express';

interface SocketWithAuth extends Socket {
  userId?: string;
  userName?: string;
}

// Define the chat service for handling real-time communication
export class ChatService {
  private io: SocketServer;
  private supportUsers: Map<string, SocketWithAuth> = new Map();
  private clientUsers: Map<string, SocketWithAuth> = new Map();
  
  constructor(server: HTTPServer) {
    // Initialize Socket.IO server with CORS configuration
    this.io = new SocketServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    
    this.setupSocketHandlers();
  }
  
  // Authentication middleware for socket connections
  private async authenticateSocket(socket: SocketWithAuth, next: (err?: Error) => void) {
    try {
      const { userId, sessionID } = socket.handshake.auth;
      
      if (!userId || !sessionID) {
        return next(new Error('Authentication error'));
      }
      
      // Get user from the database
      const user = await storage.getUser(userId);
      if (!user) {
        return next(new Error('User not found'));
      }
      
      // Store user information with the socket
      socket.userId = userId;
      socket.userName = user.firstName || user.username || 'Unknown User';
      
      return next();
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  }
  
  // Setup all socket event handlers
  private setupSocketHandlers() {
    this.io.use((socket: SocketWithAuth, next) => this.authenticateSocket(socket, next));
    
    this.io.on('connection', (socket: SocketWithAuth) => {
      console.log(`User connected: ${socket.userId} (${socket.userName})`);
      
      // Store the user in the appropriate map
      this.handleUserConnection(socket);
      
      // Handle joining a chat session
      socket.on('join-session', (sessionId: number) => this.handleJoinSession(socket, sessionId));
      
      // Handle sending messages
      socket.on('send-message', (data: { sessionId: number, content: string, receiverId?: string }) => 
        this.handleSendMessage(socket, data));
      
      // Handle reading messages
      socket.on('mark-read', (sessionId: number) => this.handleMarkRead(socket, sessionId));
      
      // Handle creating a new chat session with support
      socket.on('request-support', (data: { projectId?: number }) => 
        this.handleRequestSupport(socket, data));
      
      // Handle disconnect
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }
  
  // Store the user in the appropriate map based on their role
  private async handleUserConnection(socket: SocketWithAuth) {
    if (!socket.userId) return;
    
    const user = await storage.getUser(socket.userId);
    if (!user) return;
    
    if (user.role === 'admin' || user.role === 'support') {
      this.supportUsers.set(socket.userId, socket);
      
      // Notify support staff of active chats
      const activeSessions = await storage.getActiveChatSessions();
      socket.emit('active-sessions', activeSessions);
    } else {
      this.clientUsers.set(socket.userId, socket);
      
      // Check for unread messages
      const unreadCount = await storage.getUnreadMessageCount(socket.userId);
      socket.emit('unread-count', unreadCount);
      
      // Get client's active chat sessions
      const clientSessions = await storage.getChatSessionsByClientId(socket.userId);
      socket.emit('client-sessions', clientSessions);
    }
  }
  
  // Handle a user joining a chat session
  private async handleJoinSession(socket: SocketWithAuth, sessionId: number) {
    if (!socket.userId) return;
    
    const chatSession = await storage.getChatSessionById(sessionId);
    if (!chatSession) {
      socket.emit('error', { message: 'Chat session not found' });
      return;
    }
    
    // Check if user has permission to join this session
    const isClient = chatSession.clientId === socket.userId;
    const isSupport = chatSession.supportId === socket.userId;
    const user = await storage.getUser(socket.userId);
    const isAdmin = user?.role === 'admin';
    
    if (!isClient && !isSupport && !isAdmin) {
      socket.emit('error', { message: 'You do not have permission to join this chat session' });
      return;
    }
    
    // Join the room for this chat session
    socket.join(`session:${sessionId}`);
    
    // Get chat history for this session
    const messages = await storage.getChatMessagesBySessionId(sessionId);
    socket.emit('chat-history', messages);
    
    // Mark messages as read if the user is the receiver
    await storage.markMessagesAsRead(sessionId, socket.userId);
  }
  
  // Handle sending a message
  private async handleSendMessage(
    socket: SocketWithAuth, 
    { sessionId, content, receiverId }: { sessionId: number; content: string; receiverId?: string }
  ) {
    if (!socket.userId) return;
    
    try {
      const session = await storage.getChatSessionById(sessionId);
      if (!session) {
        socket.emit('error', { message: 'Chat session not found' });
        return;
      }
      
      // Determine the receiver
      let messageReceiverId = receiverId;
      if (!receiverId) {
        // If no receiverId specified, send to the other user in the session
        messageReceiverId = session.clientId === socket.userId ? session.supportId! : session.clientId;
      }
      
      // Save the message to the database
      const message = await storage.createChatMessage({
        senderId: socket.userId,
        receiverId: messageReceiverId,
        sessionId,
        content
      });
      
      // Emit message to the chat room
      this.io.to(`session:${sessionId}`).emit('new-message', message);
      
      // If receiver is not in the room, send a notification
      const receiverSocket = this.getSocketForUser(messageReceiverId!);
      if (receiverSocket && !receiverSocket.rooms.has(`session:${sessionId}`)) {
        receiverSocket.emit('notification', {
          type: 'new-message',
          sessionId,
          message: 'You have a new message'
        });
        
        // Update unread count
        const unreadCount = await storage.getUnreadMessageCount(messageReceiverId!);
        receiverSocket.emit('unread-count', unreadCount);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }
  
  // Handle marking messages as read
  private async handleMarkRead(socket: SocketWithAuth, sessionId: number) {
    if (!socket.userId) return;
    
    try {
      await storage.markMessagesAsRead(sessionId, socket.userId);
      
      // Update unread count
      const unreadCount = await storage.getUnreadMessageCount(socket.userId);
      socket.emit('unread-count', unreadCount);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }
  
  // Handle requesting support
  private async handleRequestSupport(socket: SocketWithAuth, { projectId }: { projectId?: number }) {
    if (!socket.userId) return;
    
    try {
      // Check if user already has an active session
      const clientSessions = await storage.getChatSessionsByClientId(socket.userId);
      const activeSession = clientSessions.find(s => s.status === 'active');
      
      if (activeSession) {
        socket.emit('session-joined', activeSession);
        socket.join(`session:${activeSession.id}`);
        return;
      }
      
      // Create a new chat session
      const session = await storage.createChatSession({
        clientId: socket.userId,
        projectId,
        status: 'active'
      });
      
      // Join the room
      socket.join(`session:${session.id}`);
      socket.emit('session-joined', session);
      
      // Notify all support staff about the new chat session
      this.supportUsers.forEach(supportSocket => {
        supportSocket.emit('new-session', session);
      });
    } catch (error) {
      console.error('Error requesting support:', error);
      socket.emit('error', { message: 'Failed to request support' });
    }
  }
  
  // Handle support assigning themselves to a chat session
  public async assignSupportToSession(supportId: string, sessionId: number) {
    try {
      const session = await storage.getChatSessionById(sessionId);
      if (!session || session.status !== 'active') {
        return false;
      }
      
      // Update the session with the support ID
      const updatedSession = await storage.updateChatSession(sessionId, { supportId });
      
      // Notify the client
      const clientSocket = this.clientUsers.get(session.clientId);
      if (clientSocket) {
        clientSocket.emit('support-joined', {
          sessionId,
          supportId
        });
      }
      
      // Notify support staff
      const supportSocket = this.supportUsers.get(supportId);
      if (supportSocket) {
        supportSocket.join(`session:${sessionId}`);
        supportSocket.emit('session-assigned', updatedSession);
      }
      
      return true;
    } catch (error) {
      console.error('Error assigning support to session:', error);
      return false;
    }
  }
  
  // Handle user disconnect
  private handleDisconnect(socket: SocketWithAuth) {
    if (!socket.userId) return;
    
    console.log(`User disconnected: ${socket.userId}`);
    
    // Remove user from the appropriate map
    this.supportUsers.delete(socket.userId);
    this.clientUsers.delete(socket.userId);
  }
  
  // Helper to get socket for a user
  private getSocketForUser(userId: string): SocketWithAuth | undefined {
    return this.clientUsers.get(userId) || this.supportUsers.get(userId);
  }
}

// Export a function to create and setup the chat service
export function setupChatService(server: HTTPServer): ChatService {
  return new ChatService(server);
}