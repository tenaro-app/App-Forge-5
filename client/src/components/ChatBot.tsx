import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Message types and interfaces
type MessageType = 'bot' | 'user';
interface Message {
  id: string;
  text: string;
  type: MessageType;
  timestamp: Date;
}

// Initial messages to display when chat opens
const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! Welcome to AppForge. How can I help you today? 👋',
    type: 'bot',
    timestamp: new Date()
  }
];

// Quick reply options for users to select
const quickReplies = [
  { id: 'pricing', text: 'Pricing information' },
  { id: 'services', text: 'Services offered' },
  { id: 'process', text: 'Development process' },
  { id: 'consultation', text: 'Book a consultation' },
  { id: 'contact', text: 'Talk to a human' }
];

// Bot responses based on intent detection
const botResponses: Record<string, string> = {
  pricing: "Our pricing starts at $5,000 for initial projects, with custom quotes based on your specific needs. Our IGNITE plan is perfect for startups, ACCELERATE for growing businesses, and DOMINATE for enterprises. Would you like more specific pricing details?",
  services: "We offer a wide range of services including custom application development, workflow automation, data integration, and business intelligence dashboards. Our solutions can help reduce operational costs by up to 70% while improving accuracy and compliance. Which service interests you most?",
  process: "Our development process is simple yet effective: 1) Discovery - We understand your needs, 2) Design - We create a solution blueprint, 3) Development - We build your custom solution, 4) Deployment - We launch your solution, 5) Support - We provide ongoing maintenance. Would you like to know more about any specific stage?",
  consultation: "Great! I'd be happy to help you schedule a free consultation with one of our experts. What's your preferred date and time? Or if you prefer, I can have someone reach out to you directly - just leave your contact information.",
  contact: "I'll connect you with one of our team members right away. Please provide your name and email, and someone will reach out to you within 1 business day."
};

// Intent detection function - simple keyword matching for demo
const detectIntent = (message: string): string => {
  message = message.toLowerCase();
  
  if (message.includes('price') || message.includes('cost') || message.includes('expensive'))
    return 'pricing';
  
  if (message.includes('service') || message.includes('offer') || message.includes('do you provide'))
    return 'services';
  
  if (message.includes('process') || message.includes('how does it work') || message.includes('steps'))
    return 'process';
  
  if (message.includes('book') || message.includes('schedule') || message.includes('consultation') || message.includes('meeting'))
    return 'consultation';
  
  if (message.includes('human') || message.includes('person') || message.includes('agent') || message.includes('representative'))
    return 'contact';
  
  return 'unknown';
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  // Toggle minimize/maximize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Add a message to the chat
  const addMessage = (text: string, type: MessageType) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle user sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    addMessage(inputValue, 'user');
    setInputValue('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Detect intent and respond after a delay
    const intent = detectIntent(inputValue);
    
    setTimeout(() => {
      setIsTyping(false);
      if (intent !== 'unknown') {
        addMessage(botResponses[intent], 'bot');
      } else {
        addMessage("I'm not sure I understand. Could you rephrase that or select one of the quick options below?", 'bot');
      }
    }, 1000 + Math.random() * 1000); // Random delay for more human-like response
  };

  // Handle quick reply selection
  const handleQuickReply = (replyId: string) => {
    const reply = quickReplies.find(r => r.id === replyId);
    if (reply) {
      addMessage(reply.text, 'user');
      
      // Simulate bot typing
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        addMessage(botResponses[replyId], 'bot');
      }, 1000 + Math.random() * 1000);
    }
  };

  // Format timestamp for messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat button */}
      <button 
        onClick={toggleChat}
        className="fixed right-6 bottom-6 z-50 p-4 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-110"
        aria-label="Chat with us"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed right-6 bottom-20 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200"
          >
            {/* Chat header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Bot className="w-6 h-6 mr-2" />
                <h3 className="font-bold">AppForge Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={toggleMinimize} className="p-1 hover:bg-primary/80 rounded">
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={toggleChat} className="p-1 hover:bg-primary/80 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Chat body - hidden when minimized */}
            {!isMinimized && (
              <div className="flex flex-col h-[calc(500px-60px-64px)]">
                {/* Messages area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`rounded-lg p-3 max-w-[80%] relative ${
                          message.type === 'user' 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.type === 'bot' && (
                            <Bot className="w-5 h-5 mt-1 mr-1" />
                          )}
                          <div>
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            <span className="text-xs opacity-70 block text-right mt-1">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          {message.type === 'user' && (
                            <User className="w-5 h-5 mt-1 ml-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-center mb-4">
                      <div className="bg-gray-200 rounded-lg py-2 px-4 text-gray-500 max-w-[80%]">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Quick replies */}
                <div className="px-4 py-2 bg-gray-100 overflow-x-auto">
                  <div className="flex space-x-2 pb-1">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply.id}
                        onClick={() => handleQuickReply(reply.id)}
                        className="bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm whitespace-nowrap hover:bg-gray-50 hover:border-primary/50 transition-colors duration-200"
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Input area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-primary text-white p-2 rounded-r-lg hover:bg-primary/90 transition-colors duration-200"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}