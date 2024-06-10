/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';

const CustomNavbar = ({ isAdmin }) => {
  return (
    <nav className="custom-navbar">
      <ul className="custom-navbar-menu">
        <li className="custom-navbar-item">
          <Link to="/" className="custom-navbar-link">Accueil</Link>
        </li>
        <li className="custom-navbar-item">
          <Link to={isAdmin ? "/dashboard" : "/user-dashboard"} className="custom-navbar-link">Dashboard</Link>
        </li>
        <li className="custom-navbar-item">
          <Link to="/recettes" className="custom-navbar-link">Recette</Link>
        </li>
      </ul>
    </nav>
  );
};

export default CustomNavbar;