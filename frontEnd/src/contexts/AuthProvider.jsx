/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const baseURL = 'http://localhost:3001';

  const createUser = async (email, password, username) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de l'inscription: ${errorText}`);
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("access_token", data.token);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la connexion: ${errorText}`);
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('access_token', data.token);

      // Check if the user is an admin immediately after login
      await checkIfUserIsAdmin(data.user.email);

      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsAdmin(false);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const response = await fetch(`/api/users/profile`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la validation du token: ${errorText}`);
          }

          const data = await response.json();
          setUser(data.user);
          await checkIfUserIsAdmin(data.user.email);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const checkIfUserIsAdmin = async (email) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const response = await fetch(`/api/users/admin/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // Do not log the error or URL
          setIsAdmin(false);
          return;
        }

        const data = await response.json();
        setIsAdmin(data.admin);
      } catch (error) {
        // Do not log the error
        setIsAdmin(false); // Simply setting isAdmin to false without logging the error
      }
    }
  };

  const authInfo = {
    user,
    token: localStorage.getItem('access_token'),
    loading,
    isAdmin,
    isAuthenticated: !!user,
    createUser,
    login,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, AuthContext, useAuth };























