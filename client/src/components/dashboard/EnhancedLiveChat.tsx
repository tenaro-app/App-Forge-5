import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MessageSquare, Send, Paperclip, Image, FileText, MoreHorizontal, Clock, CheckCheck, ArrowDown, Smile, Phone, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

interface ChatMessage {
  id: string;
  content: string;
  sender: "client" | "support";
  timestamp: Date;
  status: MessageStatus;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

interface ChatSession {
  id: string;
  supportName: string;
  supportAvatar?: string;
  projectId?: string;
  projectName?: string;
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  status: "active" | "closed";
}

export default function EnhancedLiveChat() {
  const { user, isAuthenticated } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mock data for chat sessions and messages
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "session1",
      supportName: "Sarah Johnson",
      projectId: "1",
      projectName: "E-commerce Platform",
      unreadCount: 2,
      lastMessage: {
        content: "I've reviewed the latest mockups, they look great! There are just a couple of small adjustments needed for the checkout flow.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      status: "active"
    },
    {
      id: "session2",
      supportName: "Michael Chen",
      projectId: "2",
      projectName: "CRM Integration",
      unreadCount: 0,
      lastMessage: {
        content: "The API documentation has been updated. Let me know if you have any questions about the integration points.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      status: "active"
    }
  ]);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    session1: [
      {
        id: "msg1",
        content: "Hi there! I'm Sarah, your project manager for the E-commerce Platform. How can I help you today?",
        sender: "support",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: "read"
      },
      {
        id: "msg2",
        content: "Hi Sarah, I was wondering if we could get an update on the design phase of the project.",
        sender: "client",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
        status: "read"
      },
      {
        id: "msg3",
        content: "Of course! The design phase is going well. We've completed the initial mockups and are working on refining the user flows. I've just uploaded the latest designs for you to review.",
        sender: "support",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        status: "read",
        attachments: [
          {
            id: "att1",
            name: "homepage_design_v2.png",
            type: "image/png",
            url: "#"
          },
          {
            id: "att2",
            name: "checkout_flow.pdf",
            type: "application/pdf",
            url: "#"
          }
        ]
      },
      {
        id: "msg4",
        content: "Thanks for sharing these! The homepage looks fantastic. I'll review the checkout flow and get back to you with any feedback.",
        sender: "client",
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        status: "read"
      },
      {
        id: "msg5",
        content: "I've reviewed the latest mockups, they look great! There are just a couple of small adjustments needed for the checkout flow.",
        sender: "support",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: "delivered"
      }
    ],
    session2: [
      {
        id: "msg1",
        content: "Hello! I'm Michael, your integration specialist for the CRM project. I'll be assisting you with the technical aspects of connecting your systems.",
        sender: "support",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        status: "read"
      },
      {
        id: "msg2",
        content: "Hi Michael, do we have API documentation for the CRM system we'll be integrating with?",
        sender: "client",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        status: "read"
      },
      {
        id: "msg3",
        content: "Yes, I'll share the API documentation with you right away. We'll need to set up API credentials for your system as well.",
        sender: "support",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5), // 4.5 hours ago
        status: "read",
        attachments: [
          {
            id: "att1",
            name: "crm_api_documentation.pdf",
            type: "application/pdf",
            url: "#"
          }
        ]
      },
      {
        id: "msg4",
        content: "The API documentation has been updated. Let me know if you have any questions about the integration points.",
        sender: "support",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: "delivered"
      }
    ]
  });

  // Scroll to bottom of messages when they change or chat opens
  useEffect(() => {
    if (isChatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isChatOpen, messages, currentSession]);

  // Handle scroll events to show/hide scroll to bottom button
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Simulate typing indicator
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    
    if (currentSession && isChatOpen) {
      // Randomly show typing indicator
      if (Math.random() > 0.7) {
        setIsTyping(true);
        typingTimeout = setTimeout(() => setIsTyping(false), 3000);
      }
    }
    
    return () => {
      clearTimeout(typingTimeout);
    };
  }, [messages, currentSession, isChatOpen]);

  // Send a message
  const sendMessage = () => {
    if (!currentSession || !newMessage.trim()) return;
    
    setIsSending(true);
    
    // Create a new message
    const newMsg: ChatMessage = {
      id: `msg${Date.now()}`,
      content: newMessage.trim(),
      sender: "client",
      timestamp: new Date(),
      status: "sending",
    };
    
    // Add message to the current session
    setMessages(prev => ({
      ...prev,
      [currentSession]: [...(prev[currentSession] || []), newMsg]
    }));
    
    // Clear the input
    setNewMessage("");
    
    // Simulate message being sent
    setTimeout(() => {
      setMessages(prev => {
        const updatedMessages = prev[currentSession].map(msg => 
          msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg
        );
        
        return {
          ...prev,
          [currentSession]: updatedMessages
        };
      });
      
      setIsSending(false);
      
      // Simulate response after a delay
      if (Math.random() > 0.5) {
        simulateResponse(currentSession);
      }
    }, 1000);
  };
  
  // Simulate a response from support
  const simulateResponse = (sessionId: string) => {
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        
        const responseMessages = [
          "Thanks for your message! I'll look into this right away.",
          "Great question! Let me check with the development team and get back to you.",
          "I appreciate your feedback. We'll incorporate these changes in the next iteration.",
          "I've made a note of your request. Is there anything else you'd like to discuss?",
          "That's an excellent point. I'll update the project documentation accordingly."
        ];
        
        const randomResponse = responseMessages[Math.floor(Math.random() * responseMessages.length)];
        
        const responseMsg: ChatMessage = {
          id: `msg${Date.now()}`,
          content: randomResponse,
          sender: "support",
          timestamp: new Date(),
          status: "delivered",
        };
        
        setMessages(prev => ({
          ...prev,
          [sessionId]: [...(prev[sessionId] || []), responseMsg]
        }));
      }, 2000);
    }, 1000);
  };
  
  // Open chat with a specific session
  const openChatSession = (sessionId: string) => {
    setCurrentSession(sessionId);
    
    // Mark messages as read
    if (sessionId) {
      setMessages(prev => {
        const updatedMessages = prev[sessionId].map(msg => 
          msg.sender === "support" ? { ...msg, status: "read" } : msg
        );
        
        return {
          ...prev,
          [sessionId]: updatedMessages
        };
      });
      
      // Update unread count
      setChatSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, unreadCount: 0 } 
            : session
        )
      );
    }
    
    setIsChatOpen(true);
  };
  
  // Format time
  const formatTime = (date: Date) => {
    if (!date) return "";
    
    const now = new Date();
    const messageDate = new Date(date);
    
    // If same day, show time
    if (now.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If within last 7 days, show day name
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' }) + ' ' + 
             messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show date
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Get message status icon
  const getMessageStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-gray-400" />;
      case "sent":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-green-500" />;
      case "failed":
        return <Clock className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (type.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else {
      return <Paperclip className="w-5 h-5 text-gray-500" />;
    }
  };
  
  // Handle file upload
  const handleFileUpload = () => {
    // This would typically open a file picker and upload the file
    toast({
      title: "File upload",
      description: "File upload feature is coming soon!",
    });
  };
  
  // Get current session name and project
  const currentSessionData = currentSession 
    ? chatSessions.find(session => session.id === currentSession) 
    : null;

  return (
    <div className="relative">
      {/* Chat button */}
      <button
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-primary/90 transition-colors z-10"
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label="Chat with support"
      >
        <MessageSquare className="w-6 h-6" />
        {!isChatOpen && chatSessions.some(session => session.unreadCount > 0) && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {chatSessions.reduce((sum, session) => sum + session.unreadCount, 0)}
          </span>
        )}
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-full max-w-md h-[32rem] bg-white rounded-lg shadow-xl overflow-hidden z-10 flex flex-col border border-gray-200"
          >
            {/* Chat header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">Support Chat</h3>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {currentSession ? (
              <>
                {/* Active chat session */}
                <div className="bg-gray-50 p-2 flex items-center justify-between border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary font-semibold text-sm">
                      {currentSessionData?.supportName.charAt(0)}
                    </div>
                    <div className="ml-2">
                      <div className="font-medium text-sm">{currentSessionData?.supportName}</div>
                      {currentSessionData?.projectName && (
                        <div className="text-xs text-gray-500">Project: {currentSessionData?.projectName}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100">
                      <Video className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                      onClick={() => setCurrentSession(null)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Chat messages */}
                <div 
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                  ref={chatContainerRef}
                >
                  {messages[currentSession]?.map((message, index) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[75%] ${
                          message.sender === 'client' 
                            ? 'bg-primary text-white rounded-tl-lg rounded-tr-2 rounded-bl-lg' 
                            : 'bg-gray-100 text-gray-800 rounded-tr-lg rounded-tl-2 rounded-br-lg'
                        } p-3 space-y-1`}
                      >
                        <div className="text-sm">{message.content}</div>
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map(attachment => (
                              <a 
                                key={attachment.id}
                                href={attachment.url}
                                className={`flex items-center p-2 rounded ${
                                  message.sender === 'client' 
                                    ? 'bg-primary-dark hover:bg-primary-darker' 
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                              >
                                {getFileIcon(attachment.type)}
                                <span className={`ml-2 text-sm ${message.sender === 'client' ? 'text-white' : 'text-gray-800'} truncate`}>
                                  {attachment.name}
                                </span>
                              </a>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          <span className={`text-xs ${message.sender === 'client' ? 'text-white/70' : 'text-gray-500'}`}>
                            {formatTime(message.timestamp)}
                          </span>
                          
                          {message.sender === 'client' && (
                            <div className="ml-1">
                              {getMessageStatusIcon(message.status)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 text-gray-500 flex items-center space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Scroll to bottom button */}
                {showScrollButton && (
                  <button
                    className="absolute bottom-20 right-4 p-2 bg-gray-100 rounded-full shadow-md hover:bg-gray-200"
                    onClick={scrollToBottom}
                  >
                    <ArrowDown className="h-4 w-4 text-gray-600" />
                  </button>
                )}

                {/* Message input */}
                <div className="p-3 border-t border-gray-200">
                  <div className="flex items-end space-x-2">
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700"
                      onClick={handleFileUpload}
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        className="w-full p-3 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[50px] max-h-32"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        rows={1}
                      />
                      <button
                        className="absolute right-2 bottom-2 p-1 text-gray-500 hover:text-gray-700"
                        onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                      >
                        <Smile className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      className={`p-2 rounded-full ${
                        newMessage.trim() 
                          ? 'bg-primary text-white hover:bg-primary/90' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Chat session list */}
                <div className="flex-1 overflow-y-auto p-2">
                  {chatSessions.map(session => (
                    <button
                      key={session.id}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3 mb-1"
                      onClick={() => openChatSession(session.id)}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary font-semibold">
                        {session.supportName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-medium text-gray-900 truncate">{session.supportName}</span>
                          {session.lastMessage && (
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTime(session.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        {session.projectName && (
                          <div className="text-xs text-gray-500 mb-1">{session.projectName}</div>
                        )}
                        {session.lastMessage && (
                          <p className="text-sm text-gray-600 truncate">{session.lastMessage.content}</p>
                        )}
                      </div>
                      {session.unreadCount > 0 && (
                        <div className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0">
                          {session.unreadCount}
                        </div>
                      )}
                    </button>
                  ))}

                  {chatSessions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No active chats</h3>
                      <p className="text-sm text-gray-500">
                        Start a new conversation with our support team to get help with your projects.
                      </p>
                    </div>
                  )}
                </div>

                {/* Start new chat button */}
                <div className="p-3 border-t border-gray-200">
                  <button
                    className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    onClick={() => {
                      // In a real app, this would create a new chat session
                      toast({
                        title: "New conversation",
                        description: "Starting a new support conversation...",
                      });
                      
                      // For demo, use first session if available
                      if (chatSessions.length > 0) {
                        openChatSession(chatSessions[0].id);
                      }
                    }}
                  >
                    Start new conversation
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}