import { setAccessToken } from './api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

interface LoginResponse {
  access_token: string;
}

interface LoginError {
  response?: {
    data?: {
      detail?: string | Array<{ msg?: string }>;
    };
  };
  message?: string;
}

/**
 * LoginService handles user authentication
 */
class LoginService {
  /**
   * Login with email and password
   * @param email - User email
   * @param password - User password
   * @throws Error with detailed message if login fails
   */
  async login(email: string, password: string): Promise<void> {
    // Create form data for OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 uses 'username' field for email
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/login/access-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      let errorDetail: string | Array<{ msg?: string }> = 'Login failed';
      
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorData.message || 'Login failed';
      } catch {
        // If response is not JSON, use status text
        errorDetail = response.statusText || 'Login failed';
      }

      const error: LoginError = {
        response: {
          data: {
            detail: errorDetail,
          },
        },
        message: typeof errorDetail === 'string' ? errorDetail : 'Login failed',
      };

      throw error;
    }

    const data: LoginResponse = await response.json();
    
    // Store the access token
    if (data.access_token) {
      setAccessToken(data.access_token);
    } else {
      throw new Error('No access token received from server');
    }
  }
}

const loginService = new LoginService();

export default loginService;

