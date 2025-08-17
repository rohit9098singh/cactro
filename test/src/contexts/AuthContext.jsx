import { createContext, useState, useEffect, useCallback } from 'react';
import { userAPI } from '../services/api';

// Create the context
const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));

  const fetchUserProfile = useCallback(async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await userAPI.getProfile(token);
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        // Invalid token, clear it
        localStorage.removeItem('auth_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Clear invalid token
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for token in URL (from OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const userParam = urlParams.get('user');
      
      console.log('Auth initialization:', { urlToken: !!urlToken, userParam: !!userParam });
      
      if (urlToken) {
        console.log('Processing OAuth token from URL');
        localStorage.setItem('auth_token', urlToken);
        setToken(urlToken);
        
        if (userParam) {
          try {
            const userData = JSON.parse(decodeURIComponent(userParam));
            console.log('Setting user data:', userData);
            setUser(userData);
            setLoading(false);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      // If we have a token but no user, try to get user profile
      if (token && !user) {
        await fetchUserProfile();
      } else if (!token) {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token, user, fetchUserProfile]);

  const login = () => {
    // Redirect to Google OAuth
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${baseUrl}/auth/google`;
  };

  const logout = async () => {
    try {
      await userAPI.logout(token);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
