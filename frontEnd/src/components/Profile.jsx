/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faClipboardList,
  faCircleUser,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/AuthProvider";
import { GiStrawberry } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";

function Profile({ user }) {
  const { logOut, isAdmin } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDashboard = () => {
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      alert("Vous êtes déconnecté");
      setIsModalOpen(false);
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return null; // Affiche quelque chose si l'utilisateur n'est pas connecté
  }

  return (
    <div>
      <div className="drawer drawer-end h-full z-100">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer-4"
            className="drawer-button bton-ghost btn-circle avatar-profile"
          >
            <div className="w-12">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="avatar"
                  className="w-12 rounded-full"
                />
              ) : (
                // Dans le cas où l'utilisateur n'a pas de photo de profil, on affiche une icône par défaut (gâteau)
                <GiStrawberry
                  className={`rounded-full ${isDarkMode ? "bgDark" : "PrimaryBG inverti-white"}`}
                  style={{ height: "3rem", width: "2.5rem" }}
                />
              )}
            </div>
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu-drawer min-h-full">
            <li style={{ fontSize: "1rem" }}>
              <Link to="/my-recipe">
                <FontAwesomeIcon icon={faClipboardList} size="2xl" /> Mes
                recettes
              </Link>
            </li>
            {isAdmin && (
              <li style={{ fontSize: "1rem" }}>
                <Link to={`/dashboard/`}>
                  <FontAwesomeIcon icon={faCircleUser} size="2xl" /> Dashboard
                </Link>
              </li>
            )}
            <li style={{ fontSize: "1rem" }}>
              <a onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} size="2xl" /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Profile;

