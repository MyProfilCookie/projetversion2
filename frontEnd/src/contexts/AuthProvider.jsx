/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const baseURL = 'http://localhost:3001';

  const createUser = async (email, password, username) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/register`, {
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
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Assurez-vous que les cookies sont envoyés
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la connexion: ${errorText}`);
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('access_token', data.token);

      await checkIfUserIsAdmin(data.user.email);

      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
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
          const response = await fetch(`${baseURL}/users/profile`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Assurez-vous que les cookies sont envoyés
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la validation du token: ${errorText}`);
          }

          const data = await response.json();
          setUser(data.user); // data.user contient les informations utilisateur
          await checkIfUserIsAdmin(data.user.email);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Erreur lors de la validation du token:', error);
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
        const response = await fetch(`${baseURL}/users/admin/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur lors de la vérification de l'admin: ${errorText}`);
        }

        const data = await response.json();
        setIsAdmin(data.admin);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'admin:", error);
        setIsAdmin(false);
      }
    }
  };

  const authInfo = {
    user,
    loading,
    isAdmin,
    createUser,
    login,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

















