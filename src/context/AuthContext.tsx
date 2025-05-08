import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // 👈 Add loading state

  // Fetch user info on initial load using cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/v1/auth/me', { withCredentials: true });
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false); // ✅ Ensure loading is false regardless of success/failure
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true); // Optional: Show loading while logging in
    await axios.post('/api/v1/auth/login', { email, password }, { withCredentials: true });
    const res = await axios.get('/api/v1/auth/me', { withCredentials: true });
    setUser(res.data);
    setLoading(false); // ✅ Done loading
  };

  // Logout function
  const logout = async () => {
    await axios.post('/api/v1/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

