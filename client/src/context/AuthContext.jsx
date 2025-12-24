import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, database } from '../../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in - fetch their role from Realtime Database
        try {
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              displayName: firebaseUser.displayName || userData.name,
              photoURL: firebaseUser.photoURL,
              role: userData.role || 'user',
              name: userData.name,
              phonenumber: userData.phonenumber,
              createdAt: userData.createdAt
            });
          } else {
            // User exists in Firebase Auth but not in Database (shouldn't happen)
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'user' // Default role
            });
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            role: 'user'
          });
          setIsAuthenticated(true);
        }
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register with Firebase and store user data in Realtime Database
  const register = async (userData) => {
    try {
      const { email, password, name, phonenumber } = userData;
      const role = 'user'; // Force all new registrations to be 'user'

      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Update display name
      await updateProfile(firebaseUser, {
        displayName: name
      });

      // 3. Store additional user data in Realtime Database
      const userRef = ref(database, `users/${firebaseUser.uid}`);
      await set(userRef, {
        uid: firebaseUser.uid,
        email,
        name,
        phonenumber,
        role, // Always 'user' for new accounts
        createdAt: new Date().toISOString(),
        emailVerified: false
      });

      // 4. Send email verification
      await sendEmailVerification(firebaseUser);

      return {
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        user: firebaseUser
      };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already registered';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Login with Firebase
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser.emailVerified) {
        return {
          success: false,
          error: 'Please verify your email before logging in.',
          needsVerification: true
        };
      }

      // Fetch user role immediately for redirect logic
      const userRef = ref(database, `users/${firebaseUser.uid}`);
      const snapshot = await get(userRef);
      const role = snapshot.exists() ? snapshot.val().role : 'user';

      return {
        success: true,
        user: firebaseUser,
        role: role
      };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';

      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent!'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return {
          success: true,
          message: 'Verification email sent!'
        };
      }
      return {
        success: false,
        error: 'No user logged in'
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Update user role (admin only)
  const updateUserRole = async (userId, newRole) => {
    try {
      if (!user || user.role !== 'admin') {
        return {
          success: false,
          error: 'Only admins can update user roles'
        };
      }

      const userRef = ref(database, `users/${userId}`);
      await update(userRef, { role: newRole });

      return {
        success: true,
        message: 'User role updated successfully'
      };
    } catch (error) {
      console.error('Update role error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  // Get redirect path based on role
  const getRedirectPath = () => {
    if (!user) return '/';

    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'chef':
        return '/chef';
      case 'user':
        return '/';
      default:
        return '/';
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    resetPassword,
    resendVerificationEmail,
    updateUserRole,
    hasRole,
    getRedirectPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
