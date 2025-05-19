import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

/**
 * Hook to handle authentication state
 * 
 * Returns:
 * - user: the currently authenticated user, or undefined if not authenticated
 * - isLoading: whether the auth state is currently loading
 * - isAuthenticated: whether the user is authenticated
 */
export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}