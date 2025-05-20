import { useState, useEffect } from "react";
import { Bell, Check, X, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

type Notification = {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  time: Date;
  read: boolean;
  link?: string;
};

export default function SmartNotifications() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications
  const { data: fetchedNotifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    enabled: isAuthenticated,
    // For now we'll use mock data since the API endpoint isn't implemented yet
    initialData: [
      {
        id: "1",
        type: "success",
        title: "Project status updated",
        message: "Your E-commerce project has moved to Development phase",
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
      },
      {
        id: "2",
        type: "info",
        title: "New milestone added",
        message: "A new milestone has been added to your CRM Integration project",
        time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        read: true,
      },
      {
        id: "3",
        type: "warning",
        title: "Approaching deadline",
        message: "The Website Redesign project is due in 3 days",
        time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: false,
        link: "/dashboard/projects/3",
      },
    ],
  });

  // Update local state when fetched data changes
  useEffect(() => {
    if (fetchedNotifications) {
      setNotifications(fetchedNotifications);
    }
  }, [fetchedNotifications]);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    // In a real app, you would also call an API to update the server
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // In a real app, you would also call an API to update the server
  };

  // Get icon by notification type
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5 text-green-500" />;
      case "warning":
        return <Info className="w-5 h-5 text-amber-500" />;
      case "error":
        return <X className="w-5 h-5 text-red-500" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diff < 60 * 1000) {
      return "Just now";
    }
    
    // Less than an hour
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
    
    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
    
    // Less than a week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="relative">
        <button 
          className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
          disabled
        >
          <Bell className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button 
        className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-primary text-white text-xs font-medium flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 mt-2 w-80 md:w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="py-1">
              <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:text-primary-dark"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-500">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 ${!notification.read ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors`}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <a 
                            href={notification.link || "#"} 
                            className="block"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                            <p className="text-sm text-gray-500">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatTime(notification.time)}</p>
                          </a>
                        </div>
                        {!notification.read && (
                          <div className="ml-3 flex-shrink-0">
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="ml-auto flex-shrink-0 p-1 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-600"
                            >
                              <span className="sr-only">Mark as read</span>
                              <Check className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="px-4 py-2 border-t border-gray-200">
                <a href="/dashboard/notifications" className="block text-center text-xs font-medium text-primary hover:text-primary-dark">
                  View all notifications
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}