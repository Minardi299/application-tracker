import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({
  isLogin: false,
  user: null,
  token: null,
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
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(GUEST_USER);
  const [token, setToken] = useState(null); 
  //check from local storagge if the user is already logged in before
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsLogin(true);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        // Clear invalid stored data in case of error
        localStorage.removeItem('authUser');
        localStorage.removeItem('token');
        setUser(GUEST_USER);
        setToken(null);
        setIsLogin(false);
      }
    }else {
      setUser(GUEST_USER); 
      setToken(null);
      setIsLogin(false);
      if (!storedUser) localStorage.removeItem('authUser');
      if (!storedToken) localStorage.removeItem('token');
    }
  }, []);



  // TODO: replace these with your actual API calls or authentication logic
  const login = (userData, token) => {
    // Example: Assume userData is the user object, token is a JWT
    if (!userData || !token) {
        console.error("Login called without proper user data or auth token");
        return;
    }
    setUser(userData);
    setToken(token); 
    setIsLogin(true);
    localStorage.setItem('authUser', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(GUEST_USER);
    setIsLogin(false);
    setToken(null);
    // Clear persisted state
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
    // Add any cleanup logic, like redirecting to login page
  };
  const register = async (userData) => {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      login(data);
    } catch (err) {
      console.error(err);
    }
  };

  // context value
  const value = {
    isLogin,
    user, 
    token,
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