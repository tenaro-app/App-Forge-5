import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";

type Recommendation = {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  estimatedBudget: string;
  estimatedTimeline: string;
  matchScore: number;
  category: string;
};

export default function ProjectRecommendations() {
  const { user, isAuthenticated } = useAuth();
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});

  // Fetch AI-generated recommendations
  const { data: recommendations, isLoading } = useQuery<Recommendation[]>({
    queryKey: ["/api/recommendations"],
    enabled: isAuthenticated,
    // For now, we'll use mock data
    initialData: [
      {
        id: "rec1",
        title: "Customer Service Chatbot",
        description: "Implement an AI-powered chatbot to handle routine customer inquiries, reducing response time and freeing up your team for complex issues.",
        benefits: [
          "Reduce customer support response time by 75%",
          "Handle multiple customer inquiries simultaneously",
          "Available 24/7 with consistent responses"
        ],
        estimatedBudget: "$5,000 - $12,000",
        estimatedTimeline: "4-8 weeks",
        matchScore: 92,
        category: "AI & Automation"
      },
      {
        id: "rec2",
        title: "Inventory Management System",
        description: "Automate your inventory tracking with a custom system that integrates with your sales pipeline and provides real-time stock updates.",
        benefits: [
          "Reduce inventory holding costs by 30%",
          "Eliminate stockouts and overstock situations",
          "Generate purchase orders automatically"
        ],
        estimatedBudget: "$8,000 - $15,000",
        estimatedTimeline: "6-10 weeks",
        matchScore: 85,
        category: "Business Processes"
      },
      {
        id: "rec3",
        title: "Client Relationship Dashboard",
        description: "Create a centralized dashboard that tracks all client interactions, identifies opportunities, and provides personalized engagement recommendations.",
        benefits: [
          "Increase client retention rates by 40%",
          "Identify upsell opportunities automatically",
          "Personalize client communications"
        ],
        estimatedBudget: "$7,000 - $14,000",
        estimatedTimeline: "6-8 weeks",
        matchScore: 78,
        category: "Analytics & Reporting"
      }
    ]
  });

  // Handle recommendation feedback
  const giveRecommendationFeedback = (id: string, helpful: boolean) => {
    // In a real app, you would submit this feedback to an API
    console.log(`Recommendation ${id} feedback: ${helpful ? 'helpful' : 'not helpful'}`);
    
    // Update local state to show feedback was given
    setFeedbackGiven(prev => ({
      ...prev,
      [id]: true
    }));
    
    // Show notification that feedback was received
    // This would trigger a toast/notification in a real app
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Lightbulb className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <h3 className="text-gray-900 font-medium text-lg mb-1">No recommendations yet</h3>
        <p className="text-gray-500 mb-4">
          As you complete more projects, we'll generate personalized recommendations for your business.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
            AI Project Recommendations
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Personalized project ideas based on your business needs
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {recommendations.map(rec => (
          <div key={rec.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between">
              <h4 className="text-lg font-medium text-gray-900 mb-1">{rec.title}</h4>
              <div className="bg-primary/10 text-primary text-xs font-semibold rounded-full px-2.5 py-0.5 flex items-center">
                {rec.matchScore}% match
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div className="text-sm">
                <span className="text-gray-500 block">Budget:</span>
                <span className="font-medium text-gray-900">{rec.estimatedBudget}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 block">Timeline:</span>
                <span className="font-medium text-gray-900">{rec.estimatedTimeline}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 block">Category:</span>
                <span className="font-medium text-gray-900">{rec.category}</span>
              </div>
            </div>

            <div className="mb-3">
              <h5 className="text-sm font-medium text-gray-900 mb-1">Key Benefits:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {rec.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-1.5">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                {!feedbackGiven[rec.id] ? (
                  <>
                    <button 
                      onClick={() => giveRecommendationFeedback(rec.id, true)}
                      className="text-xs flex items-center text-gray-500 hover:text-green-600"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                      Helpful
                    </button>
                    <button 
                      onClick={() => giveRecommendationFeedback(rec.id, false)}
                      className="text-xs flex items-center text-gray-500 hover:text-red-600"
                    >
                      <ThumbsDown className="w-3.5 h-3.5 mr-1" />
                      Not helpful
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-500">Thanks for your feedback</span>
                )}
              </div>
              <a 
                href="/new"
                className="text-sm text-primary hover:text-primary-dark flex items-center"
              >
                Request this project 
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}