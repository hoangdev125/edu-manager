import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStudents } from '../mockData';

export interface UserAccount {
  username: string;
  password?: string; // stored for authentication simulation
  role: 'admin' | 'student';
  studentId?: string;
  fullName: string;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, fullName: string, role: 'admin' | 'student', studentId?: string) => boolean;
  logout: () => void;
  users: UserAccount[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('app_users');
    if (saved) return JSON.parse(saved);

    // Initial seed users
    const seedUsers: UserAccount[] = [
      {
        username: 'admin',
        password: '123',
        role: 'admin',
        fullName: 'Kim Hoàng'
      }
    ];

    // Seed student accounts from mockData.ts
    initialStudents.forEach(student => {
      seedUsers.push({
        username: student.id.toLowerCase(),
        password: '123',
        role: 'student',
        studentId: student.id,
        fullName: student.name
      });
    });

    localStorage.setItem('app_users', JSON.stringify(seedUsers));
    return seedUsers;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('current_user');
    }
  }, [currentUser]);

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (
    username: string, 
    password: string, 
    fullName: string, 
    role: 'admin' | 'student', 
    studentId?: string
  ): boolean => {
    const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (exists) return false;

    const newUser: UserAccount = {
      username: username.toLowerCase().trim(),
      password,
      role,
      studentId,
      fullName: fullName.trim()
    };

    setUsers(prev => [...prev, newUser]);
    return true;
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
