import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, User } from 'lucide-react';
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
    text: 'Hi there! 👋 Welcome to AppForge.\n\nHow can I help you today?',
    type: 'bot',
    timestamp: new Date()
  }
];

// Common questions for quick replies
const commonQuestions = [
  { id: 'pricing', text: 'What are your pricing plans?' },
  { id: 'services', text: 'What services do you offer?' },
  { id: 'process', text: 'How does your process work?' },
  { id: 'consult', text: 'I want to book a consultation' }
];

// Bot responses based on simple keyword detection
const getBotResponse = (message: string): string => {
  const lowerMsg = message.toLowerCase();
  
  // Check for pricing related questions
  if (lowerMsg.includes('pricing') || lowerMsg.includes('cost') || lowerMsg.includes('price')) {
    return "Our pricing is designed to fit businesses of all sizes:\n\n• IGNITE: $5,000 - Perfect for startups\n• ACCELERATE: $10,000 - For growing businesses\n• DOMINATE: $20,000+ - Enterprise-grade solutions\n\nAll plans include 1 year of FREE technical development and lifetime hosting. Would you like to schedule a call to discuss which plan fits your needs?";
  }
  
  // Check for services related questions
  if (lowerMsg.includes('services') || lowerMsg.includes('offer') || lowerMsg.includes('solution')) {
    return "We offer a comprehensive range of business automation services including:\n\n• Custom application development\n• Workflow automation solutions\n• Data integration services\n• Business intelligence dashboards\n• Process optimization\n\nOur solutions help reduce operational costs by up to 70% while improving accuracy and compliance. What specific challenge is your business facing?";
  }
  
  // Check for process related questions
  if (lowerMsg.includes('process') || lowerMsg.includes('how does it work') || lowerMsg.includes('steps')) {
    return "Our development process is simple and effective:\n\n1. Discovery - We understand your needs\n2. Design - We create a solution blueprint\n3. Development - We build your custom solution\n4. Deployment - We launch your solution\n5. Support - We provide ongoing maintenance\n\nTypically, projects take 4-12 weeks depending on complexity. Would you like to learn more about any specific stage?";
  }
  
  // Check for consultation requests
  if (lowerMsg.includes('consult') || lowerMsg.includes('book') || lowerMsg.includes('schedule') || lowerMsg.includes('call')) {
    return "I'd be happy to help you schedule a free consultation with one of our experts. Please let us know your name, email, and a brief description of your project needs, and our team will reach out to arrange a time that works for you.\n\nAlternatively, you can book directly through our online calendar at appforge.dev/schedule.";
  }
  
  // Generic response for other inquiries
  return "Thanks for reaching out! I'd be happy to help with your inquiry. Could you provide a bit more information about your business needs so I can direct you to the right resources?";
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
  }, [messages, isTyping]);

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
    
    // Get response based on message content
    const response = getBotResponse(inputValue);
    
    // Add bot response after a slight delay
    setTimeout(() => {
      setIsTyping(false);
      addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000); // Random delay for more human-like response
  };

  // Handle quick reply selection
  const handleQuickReply = (question: typeof commonQuestions[0]) => {
    addMessage(question.text, 'user');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Get response based on question
    const response = getBotResponse(question.text);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage(response, 'bot');
    }, 1000 + Math.random() * 500);
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
        className="fixed right-6 bottom-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 group"
        aria-label="Chat with us"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="text-white font-medium hidden md:inline-block group-hover:underline">Chat with us</span>
      </button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px',
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed right-6 bottom-20 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
          >
            {/* Chat header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <h3 className="font-bold">AppForge Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={toggleMinimize} className="p-1 hover:bg-white/20 rounded transition-colors duration-200">
                  {isMinimized ? <Minimize2 className="w-4 h-4 rotate-180" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={toggleChat} className="p-1 hover:bg-white/20 rounded transition-colors duration-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Chat body - hidden when minimized */}
            {!isMinimized && (
              <div className="flex flex-1 flex-col h-full overflow-hidden">
                {/* Messages area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`rounded-lg p-3 max-w-[85%] shadow-sm ${
                          message.type === 'user' 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-start">
                          {message.type === 'user' ? (
                            <>
                              <div>
                                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                <span className="text-xs opacity-70 block text-right mt-1">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              <User className="w-4 h-4 ml-2 mt-1 flex-shrink-0" />
                            </>
                          ) : (
                            <>
                              <div>
                                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                <span className="text-xs text-gray-500 block text-right mt-1">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-center mb-4">
                      <div className="bg-white border border-gray-200 rounded-lg py-2 px-4 text-gray-500 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Quick replies */}
                <div className="p-3 bg-white border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {commonQuestions.map((question) => (
                      <button
                        key={question.id}
                        onClick={() => handleQuickReply(question)}
                        className="bg-gray-100 border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap hover:bg-gray-200 transition-colors duration-200"
                      >
                        {question.text}
                      </button>
                    ))}
                  </div>
                  
                  {/* Input area */}
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
                      className="flex-1 border border-gray-300 rounded-l-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-primary text-white p-2.5 rounded-r-lg hover:bg-primary/90 transition-colors duration-200"
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