import React, { createContext, useState, useContext, useEffect } from 'react';

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



  // TODO: replace these with your actual API calls or authentication logic
  const login = (userData) => {
    // Example: Assume userData is the user object
    if (!userData) {
        console.error("Login called without proper user data");
        return;
    }
    setUser(userData);
    setIsLogin(true);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(GUEST_USER);
    setIsLogin(false);
    // Clear persisted state
    localStorage.removeItem('authUser');
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