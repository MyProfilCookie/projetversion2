/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState,useEffect  } from "react";
import { Link, Outlet } from "react-router-dom";
import { MdDashboard, MdOutlineDashboardCustomize } from "react-icons/md";
import { FaEdit, FaHome, FaLocationArrow, FaPlusCircle, FaQuestionCircle, FaRegUser, FaShoppingBag, FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import useAdmin from "../hooks/useAdmin";
import Login from "../components/Login";
import useAuth from "../hooks/useAuth";
import useLastUser from "../hooks/useLastUser";
import useLastRecette from "../hooks/useLastRecette";
import LoadingScreen from "../components/LoadingScreen";
import CustomNavbar from "../components/CustomNavbar";
// import logo from "/logo.svg";
import Modal from "../components/Modal";
import DropdownMenu from "../components/DropdownMenu";
import { useTheme } from "../hooks/ThemeContext";

const sharedMenu = (
  <DropdownMenu />
);

const DashboardLayout = () => {
  const { user, loading, logOut: logout } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const { lastUser, loading: lastUserLoading } = useLastUser();
  const { lastRecetteId, loading: lastRecetteLoading } = useLastRecette();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  if (loading || lastUserLoading || lastRecetteLoading || isAdminLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Login />;
  }

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
  };

  return (
    <div className={`bg-${isDarkMode ? "dark" : "primaryBG"}`}>
      <CustomNavbar isAdmin={isAdmin} />
      {isAdmin ? (
        <div className="drawer sm-drawer-open ">
        {/* Bouton mode sombre */}
        <div className="fixed top-14 lg:top-0  right-0 p-5 themediv">
            <input
              type="checkbox"
              className="toggle"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
          </div>
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col sm-items-start sm-justify-start my-2">
            <div className="flex items-center justify-between mx-4">
              <label
                htmlFor="my-drawer-2"
                className=""
              >
                <MdOutlineDashboardCustomize className={`${isDarkMode ? "bgDark text" : "PrimaryBG text-black"}`}/>
              </label>
              <div id="navbar-end" className="navbar-end">
                {user ? (
                  <button
                    className={`btn flex items-center gap-2 rounded-full px-6 btn-primary text-white sm-hidden ${isDarkMode ? "bgDark text" : "PrimaryBG text-black"}` }
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FaRegUser /> Logout
                  </button>
                ) : (
                  <Modal />
                )}
              </div>
            </div>
            <div className="mt-5 md:mt-2 mx-4">
              <h2 style={{ color: "red", fontWeight: "normal", textAlign: "center", marginBottom: "10px" }}>Dashboard, il est {new Date().toLocaleTimeString()}, nous avons eu {lastUser?.email} comme nouvel utilisateur</h2>
              <h2 style={{ color: "green", fontWeight: "normal", textAlign: "center", marginBottom: "10px" }}>C'est la dernière recette a l'ID {lastRecetteId}</h2>
              <Outlet />
            </div>
          </div>
          {/* <div className={`drawer-side3 ${isDarkMode ? "dark" : "primaryBG"}`}>
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
              {sharedMenu}
            </ul>
          </div> */}
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <Link to="/">Retour à l'accueil</Link>
        </div>
      )}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmer la déconnexion</h3>
            <p className="py-4">Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="modal-action">
              <button className="btn btn-close" onClick={handleLogout}>
                Oui
              </button>
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;


