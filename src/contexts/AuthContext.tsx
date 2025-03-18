
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  lastLogin: Date;
  sessionExpiry: Date | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  checkSessionExpiry: () => void;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        // Convert string dates to Date objects
        parsedUser.lastLogin = new Date(parsedUser.lastLogin);
        parsedUser.sessionExpiry = parsedUser.sessionExpiry ? new Date(parsedUser.sessionExpiry) : null;
        
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Check session expiry periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && user.sessionExpiry) {
        checkSessionExpiry();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username === 'admin' && password === 'admin') {
        const now = new Date();
        const sessionExpiry = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 hours
        
        const newUser: User = {
          id: '1',
          username,
          role: 'admin',
          lastLogin: now,
          sessionExpiry,
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        toast({
          title: "Login successful",
          description: "Welcome back, admin!",
        });
        
        return true;
      } else if (username === 'user' && password === 'user') {
        const now = new Date();
        const sessionExpiry = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours
        
        const newUser: User = {
          id: '2',
          username,
          role: 'user',
          lastLogin: now,
          sessionExpiry,
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        return true;
      }
      
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const checkSessionExpiry = () => {
    if (user && user.sessionExpiry && new Date() > user.sessionExpiry) {
      toast({
        title: "Session expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
      logout();
    }
  };

  const extendSession = () => {
    if (user) {
      const now = new Date();
      const sessionExpiry = new Date(now.getTime() + (user.role === 'admin' ? 8 : 4) * 60 * 60 * 1000);
      
      const updatedUser = {
        ...user,
        sessionExpiry,
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Session extended",
        description: "Your session has been extended.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        checkSessionExpiry,
        extendSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
