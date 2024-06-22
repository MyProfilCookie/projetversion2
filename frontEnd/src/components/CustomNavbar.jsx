/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/ThemeContext';
import { FaEdit, FaPlusCircle, FaShoppingBag, FaUsers } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faGauge, faList } from '@fortawesome/free-solid-svg-icons';

const CustomNavbar = ({ isAdmin }) => {
  const { isDarkMode } = useTheme();
  return (
    <nav className="custom-navbar">
      <ul className="custom-navbar-menu">
        <li className="custom-navbar-item">
          <Link to="/" className="custom-navbar-link"><FontAwesomeIcon icon={faHouse} /> Accueil</Link>
        </li>
        <li className="custom-navbar-item">
          <Link to={isAdmin ? "/dashboard" : "/user-dashboard"} className="custom-navbar-link"><FontAwesomeIcon icon={faGauge} /> Dashboard</Link>
        </li>
        <li className="custom-navbar-item">
          <Link to="/recettes" className="custom-navbar-link"><FontAwesomeIcon icon={faList} /> Recette</Link>
        </li>
      </ul>
      {isAdmin && (
        <div className={`drawer-side3 ${isDarkMode ? "dark" : "primaryBG"}`}>
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu-drawer2 p-4 w-full text-base-content">
            <div className="divider"></div>
            <li>
              <Link
                to="/dashboard/bookings"
                className="flex items-center gap-2"
              >
                <FaShoppingBag /> Les commandes
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/add-recette"
                className="flex items-center gap-2"
              >
                <FaPlusCircle /> Rajout d'une recette
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/manage-items"
                className="flex items-center gap-2"
              >
                <FaEdit /> Éditer les recettes
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/dashboard/users" className="flex items-center gap-2">
                <FaUsers /> Utilisateurs
              </Link>
            </li>
            <div className="divider"></div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default CustomNavbar;
