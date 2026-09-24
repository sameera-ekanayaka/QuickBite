import React, { createContext, useContext, useState } from 'react';

// Context dedicated to student authentication, guest access, and profile info.
const AuthContext = createContext();

const DEFAULT_STUDENT = {
  name: 'Sameera Ekanayaka',
  studentId: 'PS/2021/045',
  faculty: 'Faculty of Science',
  department: 'Department of Statistics and Computer Science',
  email: 'ps2021045@stu.kln.ac.lk',
  phone: '0714589231',
  university: 'University of Kelaniya',
  canteenPassBalance: 1250, // LKR
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEFAULT_STUDENT);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Authenticate student with email/registration and password
  const login = (identifier, password) => {
    const cleanId = identifier ? identifier.trim() : '';

    const studentProfile = {
      ...DEFAULT_STUDENT,
      name: cleanId.includes('@') ? cleanId.split('@')[0] : 'Sameera Ekanayaka',
      email: cleanId.includes('@') ? cleanId : `${cleanId.toLowerCase()}@stu.kln.ac.lk`,
      studentId: cleanId.includes('@') ? 'PS/2021/045' : cleanId,
    };

    setCurrentUser(studentProfile);
    setIsAuthenticated(true);
    setIsGuest(false);
    return { success: true };
  };

  // Quick guest login for visitors or temporary users
  const loginAsGuest = (guestName = 'Guest Student') => {
    const randomGuestNum = Math.floor(100 + Math.random() * 900);
    const guestUser = {
      name: guestName.trim() || `Guest Student #${randomGuestNum}`,
      studentId: `GST-${randomGuestNum}`,
      faculty: 'General Campus Visitor',
      department: 'Guest Access',
      email: `guest${randomGuestNum}@kln.ac.lk`,
      phone: '0770000000',
      university: 'University of Kelaniya',
      canteenPassBalance: 0,
    };

    setCurrentUser(guestUser);
    setIsAuthenticated(true);
    setIsGuest(true);
    return { success: true };
  };

  // Sign out student
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
  };

  // Update profile details
  const updateProfile = (updates) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  const value = {
    currentUser,
    isAuthenticated,
    isGuest,
    login,
    loginAsGuest,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
