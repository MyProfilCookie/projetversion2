/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import LoadingScreen from "../components/LoadingScreen";

const PrivateRoute = ({ children }) => {
  // useContext pour utiliser le context d'authentification et récupérer l'utilisateur connecté
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <LoadingScreen/>;
  }

  if (user) {
    return <>{children}</>;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
