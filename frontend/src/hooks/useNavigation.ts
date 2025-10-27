import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useNavigation() {
  const router = useRouter();

  const navigate = useCallback((path: string) => {
    try {
      console.log(`Navigation: Attempting to navigate to ${path}`);
      router.push(path);
      console.log(`Navigation: Successfully navigated to ${path}`);
    } catch (error) {
      console.error(`Navigation: Failed to navigate to ${path}:`, error);
      // Fallback to window.location for critical navigation
      if (typeof window !== 'undefined') {
        window.location.href = path;
      }
    }
  }, [router]);

  const navigateBack = useCallback(() => {
    try {
      console.log('Navigation: Going back');
      router.back();
    } catch (error) {
      console.error('Navigation: Failed to go back:', error);
      if (typeof window !== 'undefined') {
        window.history.back();
      }
    }
  }, [router]);

  const replace = useCallback((path: string) => {
    try {
      console.log(`Navigation: Replacing with ${path}`);
      router.replace(path);
    } catch (error) {
      console.error(`Navigation: Failed to replace with ${path}:`, error);
      if (typeof window !== 'undefined') {
        window.location.replace(path);
      }
    }
  }, [router]);

  return {
    navigate,
    navigateBack,
    replace,
    router
  };
}
