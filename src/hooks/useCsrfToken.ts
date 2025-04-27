"use client";

import { useState, useEffect } from 'react';

const CSRF_HEADER = 'x-csrf-token';

/**
 * Hook to manage CSRF token for form submissions
 * Generates a new token and stores it for subsequent API calls
 */
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Generate a new CSRF token on component mount
  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/csrf', { 
          method: 'GET',
          credentials: 'include' // Include cookies in the request
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }
        
        const data = await response.json();
        setCsrfToken(data.token);
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch CSRF token'));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCsrfToken();
  }, []);

  // Create a fetch function that automatically includes the CSRF token
  const fetchWithCsrf = async (url: string, options: RequestInit = {}) => {
    if (!csrfToken) {
      throw new Error('CSRF token not available');
    }
    
    const headers = new Headers(options.headers || {});
    headers.set(CSRF_HEADER, csrfToken);
    
    return fetch(url, {
      ...options,
      headers,
      credentials: 'include' // Always include cookies
    });
  };

  return {
    csrfToken,
    isLoading,
    error,
    fetchWithCsrf
  };
}
