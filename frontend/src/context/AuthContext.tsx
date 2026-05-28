import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

export interface UserAccount {
  username: string;
  password?: string;
  role: 'admin' | 'student';
  studentId?: string;
  fullName: string;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    password: string,
    fullName: string,
    role: 'admin' | 'student',
    studentId?: string
  ) => Promise<boolean>;
  logout: () => void;
  users: UserAccount[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>([]);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const apiUsers = await authApi.getUsers();
        setUsers(apiUsers);
      } catch (error) {
        console.warn('Could not load users from backend.', error);
      }
    };

    void loadUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('current_user');
    }
  }, [currentUser]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const foundUser = await authApi.login(username, password);
      setCurrentUser(foundUser);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (
    username: string,
    password: string,
    fullName: string,
    role: 'admin' | 'student',
    studentId?: string
  ): Promise<boolean> => {
    try {
      const newUser = await authApi.register(username, password, fullName, role, studentId);
      setUsers(prev => [...prev, newUser]);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
