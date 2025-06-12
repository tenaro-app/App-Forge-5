import { useAuth } from "./useAuth";

/**
 * Hook to determine if the current user has admin privileges
 * This is a simple way to handle role-based access control
 * 
 * @returns boolean indicating if the current user is an admin
 */
export function useIsAdmin() {
  const { user } = useAuth();
  
  // Check if user exists and has admin role
  // In a real app, this would likely be based on a role field
  // For demo purposes, we'll consider users with specific emails as admins
  if (!user) return { isAdmin: false };
  
  // Check if the user role is "admin"
  const isAdmin = user.role === "admin";
  return { isAdmin };
}