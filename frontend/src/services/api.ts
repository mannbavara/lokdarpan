// API service for backend communication

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export interface UserPublic {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
}

/**
 * Get the access token from localStorage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

/**
 * Check if user is authenticated
 * Returns true if a valid token exists
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return token !== null && token.trim() !== '';
};

/**
 * Set the access token in localStorage
 */
export const setAccessToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

/**
 * Remove the access token from localStorage
 */
export const removeAccessToken = (): void => {
  localStorage.removeItem('access_token');
};

/**
 * Clear all authentication-related data from storage
 * Following security best practices:
 * - Clears all auth tokens
 * - Clears session storage
 * - Clears any cached user data
 */
export const clearAuthData = (): void => {
  // Clear access token
  localStorage.removeItem('access_token');
  
  // Clear any other potential auth-related items
  const authKeys = [
    'access_token',
    'refresh_token',
    'token',
    'auth_token',
    'user_data',
    'user',
    'session',
  ];
  
  authKeys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  
  // Clear all session storage as a security measure
  sessionStorage.clear();
};

/**
 * Secure logout function
 * Performs comprehensive cleanup following security best practices:
 * - Clears all authentication data from storage
 * - Prevents token reuse
 * - Ensures clean session state
 * 
 * Note: Since JWT tokens are stateless, we clear them client-side.
 * For enhanced security, consider implementing token blacklisting on the backend.
 */
export const logout = async (): Promise<void> => {
  // Clear all authentication data immediately
  // This prevents any race conditions or token reuse
  clearAuthData();
  
  // Optional: Call backend logout endpoint if available for token blacklisting
  // This would require implementing a logout endpoint on the backend
  // For now, we rely on token expiration and client-side cleanup
};

/**
 * Make an authenticated API request
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAccessToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - clear all auth data for security
      clearAuthData();
      throw new Error('Unauthorized');
    }
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    
    // Handle 422 validation errors - FastAPI returns detailed validation errors
    if (response.status === 422 && Array.isArray(error.detail)) {
      const validationErrors = error.detail.map((err: any) => {
        const field = err.loc ? err.loc.join('.') : 'field';
        return `${field}: ${err.msg}`;
      }).join(', ');
      throw new Error(`Validation error: ${validationErrors}`);
    }
    
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Get current user details
 */
export const getCurrentUser = async (): Promise<UserPublic> => {
  return apiRequest<UserPublic>('/users/me');
};

export { apiRequest, API_BASE_URL };

