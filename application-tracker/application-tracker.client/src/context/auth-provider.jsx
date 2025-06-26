import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/interceptor';
const AuthContext = createContext({
  isLogin: false,
  user: null,
  login: () => {throw new Error("login() called without AuthProvider!");},  
  logout: () => {throw new Error("logout() called without AuthProvider!");},     
  register:async()=> {throw new Error("register() called without AuthProvider!");}  
});
const GUEST_USER = {
  id: null,
  email: 'guest@example.com',
  firstName: 'Guest',
  lastName: '',
  picture: null,
  
};


export function AuthProvider({ children }) {
  useEffect(() => {
    async function attemptSessionRefresh  ()  {
        const hasReloaded = sessionStorage.getItem('hasReloadedAfterRefreshFail');

        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) {
          await logout(); 
          if (!hasReloaded) {
            sessionStorage.setItem('hasReloadedAfterRefreshFail', 'true');
            window.location.reload();
          } else {
            sessionStorage.removeItem('hasReloadedAfterRefreshFail');
          }
        
        };

      
    };

    attemptSessionRefresh();
  }, []);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(GUEST_USER);
  //check from local storagge if the user is already logged in before
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser ) {
      try {
        setUser(JSON.parse(storedUser));
        setIsLogin(true);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        // Clear invalid stored data in case of error
        localStorage.removeItem('authUser');
        setUser(GUEST_USER);
        setIsLogin(false);
      }
    }else {
      setUser(GUEST_USER); 
      setIsLogin(false);
      if (!storedUser) localStorage.removeItem('authUser');
    }
  }, []);



  const login = (userData) => {
    if (!userData) {
        console.error("Login called without proper user data");
        return;
    }
    
    setUser(userData);
    setIsLogin(true);
    localStorage.setItem('authUser', JSON.stringify(userData));
    localStorage.setItem('pfpURL', userData.profilePictureUrl);
  };

  async function logout  () {
    setUser(GUEST_USER);
    setIsLogin(false);
    localStorage.removeItem('authUser');
    const res = await fetchWithAuth("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.text(); 
        toast.error(`Logout failed: ${errorData}`);
        throw new Error(
          `Failed to connect - HTTP status ${res.status}. Response: ${errorData}`
        );
      }
    
  };
  const register = async (userData) => {
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      login(data.user);
    } catch (err) {
      console.error(err);
    }
  };

  // context value
  const value = {
    isLogin,
    user, 
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// a custom hook for easy consumption
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}