import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatSession, ChatMessage } from "@shared/schema";
import { format } from "date-fns";
import { 
  Send,
  ArrowLeft,
  User,
  MessageSquare
} from "lucide-react";
import { io, Socket } from "socket.io-client";

export default function ChatSupport() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthLoading, isAuthenticated]);

  // Initialize socket connection
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Configure socket
    const socketIo = io({
      auth: {
        userId: user.id,
        sessionID: document.cookie // This will contain the session ID
      }
    });

    socketIo.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketIo.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socketIo.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(socketIo);

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
    };
  }, [isAuthenticated, user]);

  // Fetch active chat session
  const { 
    data: sessions, 
    isLoading: isSessionsLoading 
  } = useQuery<ChatSession[]>({
    queryKey: ["/api/chat/sessions"],
    enabled: isAuthenticated,
  });

  const activeSession = sessions && sessions.length > 0 ? sessions[0] : null;
  
  // Fetch messages for active session
  const { 
    data: messages, 
    isLoading: isMessagesLoading 
  } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/sessions", activeSession?.id, "messages"],
    enabled: isAuthenticated && !!activeSession,
  });

  // Create new chat session if needed
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }
      return response.json();
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/sessions"] });
      
      // Connect socket to this session
      if (socket) {
        socket.emit('join-session', newSession.id);
      }
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!activeSession) throw new Error('No active session');
      
      const response = await fetch(`/api/chat/sessions/${activeSession.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/chat/sessions", activeSession?.id, "messages"] 
      });
    },
  });

  // Handle receiving new messages via socket
  useEffect(() => {
    if (!socket || !activeSession) return;
    
    // Join the session room
    socket.emit('join-session', activeSession.id);
    
    // Listen for new messages
    socket.on('new-message', (newMessage: ChatMessage) => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/chat/sessions", activeSession.id, "messages"] 
      });
    });
    
    return () => {
      socket.off('new-message');
    };
  }, [socket, activeSession, queryClient]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (!activeSession) {
      // Create a session first, then send the message
      createSessionMutation.mutate();
    } else {
      // Send message to existing session
      sendMessageMutation.mutate(message);
      setMessage("");
      
      // Also send via socket for real-time delivery
      if (socket) {
        socket.emit('send-message', {
          sessionId: activeSession.id,
          content: message
        });
      }
    }
  };

  const handleStartChat = () => {
    createSessionMutation.mutate();
  };

  if (isAuthLoading) {
    return <ChatLoading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <a className="flex items-center text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </a>
              </Link>
              <h1 className="ml-8 text-2xl font-semibold text-gray-900 hidden sm:block">Support Chat</h1>
            </div>
            <div className="flex items-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.firstName || "User"} 
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <span className="ml-2 font-medium text-sm text-gray-700 hidden sm:block">
                {user?.firstName || user?.email?.split('@')[0] || "User"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="flex-grow bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">
              {activeSession ? (
                <span>Support Conversation {activeSession.supportId ? '• Connected with Support' : '• Waiting for agent'}</span>
              ) : (
                "Start a new support conversation"
              )}
            </h2>
          </div>
          
          {/* Chat messages */}
          <div className="flex-grow p-4 overflow-y-auto">
            {isSessionsLoading || isMessagesLoading ? (
              <div className="flex flex-col space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start space-x-2 animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !activeSession ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Need help with something?</h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  Chat with our support team to get assistance with your projects or account.
                </p>
                <button
                  onClick={handleStartChat}
                  disabled={createSessionMutation.isPending}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {createSessionMutation.isPending ? "Starting Chat..." : "Start a New Conversation"}
                </button>
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start ${msg.senderId === user?.id ? 'justify-end' : ''}`}>
                    {msg.senderId !== user?.id && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <div className={`max-w-[75%] rounded-lg p-3 ${
                      msg.senderId === user?.id 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      <span className={`text-xs mt-1 block ${
                        msg.senderId === user?.id ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {format(new Date(msg.createdAt), 'h:mm a')}
                      </span>
                    </div>
                    {msg.senderId === user?.id && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center ml-2 flex-shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : activeSession ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 text-center mb-4">No messages yet. Start the conversation!</p>
              </div>
            ) : null}
          </div>
          
          {/* Chat input */}
          {(activeSession || createSessionMutation.isPending) && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={sendMessageMutation.isPending || createSessionMutation.isPending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending || createSessionMutation.isPending}
                  className="p-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ChatLoading() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="flex-grow bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex-grow p-4">
            <div className="flex flex-col space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start space-x-2 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex-grow h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}