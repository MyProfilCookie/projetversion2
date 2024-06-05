/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const createUser = async (email, password, username) => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(auth.currentUser, { displayName: username });
      console.log(response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGmail = async () => {
    setLoading(true);
    try {
      const response = await signInWithPopup(auth, googleProvider);
      const userInfo = { email: response.user.email };
      const tokenResponse = await axiosPublic.post("/jwt", userInfo);
      if (tokenResponse.data.token) {
        localStorage.setItem("access_token", tokenResponse.data.token);
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userInfo = { email: response.user.email };
      const tokenResponse = await axiosPublic.post("/jwt", userInfo);
      if (tokenResponse.data.token) {
        localStorage.setItem("access_token", tokenResponse.data.token);
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    localStorage.removeItem("access_token");
    await signOut(auth);
  };

  const updateUserProfile = async (name, photoURL) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //     setUser(currentUser);
  //     if (currentUser) {
  //       const userInfo = { email: currentUser.email };
  //       try {
  //         const response = await axiosPublic.post('/jwt', userInfo);
  //         if (response.data.token) {
  //           localStorage.setItem('access_token', response.data.token);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching token:', error);
  //       }
  //     } else {
  //       localStorage.removeItem('access_token');
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, [axiosPublic]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userInfo = { email: currentUser.email };
        try {
          const response = await axiosPublic.post("/jwt", userInfo);
          if (response.data.token) {
            localStorage.setItem("access_token", response.data.token);
          }
        } catch (error) {
          console.error("Error fetching token:", error);
        }
        // Mettre à jour l'état de l'utilisateur après la récupération de l'état d'authentification
        setUser({
          ...currentUser,
          displayName: currentUser.displayName || "Aucun",
        });
      } else {
        localStorage.removeItem("access_token");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  const authInfo = {
    user,
    loading,
    createUser,
    login,
    logOut,
    signUpWithGmail,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
