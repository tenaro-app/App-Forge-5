import { useState } from "react";
import { Trophy, Star, Clock, Calendar, Target, Lightbulb, BarChart, Award, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  unlocked: boolean;
  date?: Date;
  progress?: number;
  maxProgress?: number;
};

export default function AchievementBadges() {
  const { user, isAuthenticated } = useAuth();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Fetch badges from API
  const { data: badges, isLoading } = useQuery<Badge[]>({
    queryKey: ["/api/achievements"],
    enabled: isAuthenticated,
    // Using initial data for now until backend is implemented
    initialData: [
      {
        id: "1",
        name: "First Project",
        description: "Successfully submitted your first project request",
        icon: <Star className="w-6 h-6" />,
        unlocked: true,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      },
      {
        id: "2",
        name: "Quick Response",
        description: "Received a response to your project request within 24 hours",
        icon: <Clock className="w-6 h-6" />,
        unlocked: true,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      },
      {
        id: "3",
        name: "Project Master",
        description: "Complete 5 projects with our team",
        icon: <Trophy className="w-6 h-6" />,
        unlocked: false,
        progress: 1,
        maxProgress: 5,
      },
      {
        id: "4",
        name: "Feedback Champion",
        description: "Provide feedback on 3 completed projects",
        icon: <Target className="w-6 h-6" />,
        unlocked: false,
        progress: 0,
        maxProgress: 3,
      },
      {
        id: "5",
        name: "Idea Generator",
        description: "Submit 3 unique project ideas",
        icon: <Lightbulb className="w-6 h-6" />,
        unlocked: false,
        progress: 1,
        maxProgress: 3,
      },
      {
        id: "6",
        name: "ROI Achiever",
        description: "Document business ROI from implemented project",
        icon: <BarChart className="w-6 h-6" />,
        unlocked: false,
      },
      {
        id: "7",
        name: "Loyal Client",
        description: "Maintain active partnership for 1 year",
        icon: <Award className="w-6 h-6" />,
        unlocked: false,
        progress: Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 365, // Days since partnership started (mocked)
        maxProgress: 365,
      },
      {
        id: "8",
        name: "Holiday Special",
        description: "Submit a project during December holidays",
        icon: <Gift className="w-6 h-6" />,
        unlocked: false,
      },
    ],
  });

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Group badges into unlocked and locked
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Achievement Badges</h3>
        <p className="mt-1 text-sm text-gray-500">
          Unlock badges by reaching milestones in your project journey
        </p>
      </div>

      <div className="p-4">
        {unlockedBadges.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Unlocked Achievements</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {unlockedBadges.map(badge => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center bg-gradient-to-b from-primary/10 to-primary/5 p-3 rounded-lg cursor-pointer border border-primary/20 hover:border-primary/40 transition-colors"
                  onClick={() => setSelectedBadge(badge)}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                    {badge.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900 text-center">{badge.name}</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">
                    {badge.date ? new Date(badge.date).toLocaleDateString() : "Unlocked"}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {lockedBadges.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Locked Achievements</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {lockedBadges.map(badge => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-center bg-gray-100 p-3 rounded-lg cursor-pointer border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedBadge(badge)}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-2">
                    {badge.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-500 text-center">{badge.name}</span>
                  
                  {badge.progress !== undefined && badge.maxProgress !== undefined && (
                    <div className="w-full mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gray-400 h-1.5 rounded-full" 
                          style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {badge.progress} / {badge.maxProgress}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Badge details modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setSelectedBadge(null)}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="inline-block p-6 overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className={`w-16 h-16 rounded-full ${selectedBadge.unlocked ? 'bg-primary/20 text-primary' : 'bg-gray-200 text-gray-400'} flex items-center justify-center mr-4`}>
                  {selectedBadge.icon}
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${selectedBadge.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                    {selectedBadge.name}
                  </h3>
                  <p className={`mt-1 ${selectedBadge.unlocked ? 'text-gray-600' : 'text-gray-500'}`}>
                    {selectedBadge.description}
                  </p>
                </div>
              </div>

              {selectedBadge.unlocked && selectedBadge.date && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Unlocked on {new Date(selectedBadge.date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {!selectedBadge.unlocked && selectedBadge.progress !== undefined && selectedBadge.maxProgress !== undefined && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Progress</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div 
                      className="bg-gray-400 h-2.5 rounded-full" 
                      style={{ width: `${(selectedBadge.progress / selectedBadge.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 flex justify-between">
                    <span>{selectedBadge.progress} completed</span>
                    <span>{selectedBadge.maxProgress} required</span>
                  </p>
                </div>
              )}

              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none"
                  onClick={() => setSelectedBadge(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}