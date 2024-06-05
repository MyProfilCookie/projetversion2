/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { MdDashboard, MdOutlineDashboardCustomize } from "react-icons/md";
import {
  FaEdit,
  FaHome,
  FaLocationArrow,
  FaPlusCircle,
  FaQuestionCircle,
  FaRegUser,
  FaShoppingBag,
  FaUsers,
} from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import useAdmin from "../hooks/useAdmin";
import Login from "../components/Login";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../components/LoadingScreen";
import logo from "/logo.svg";
import Modal from "../components/Modal";

const sharedMenu = (
  <>
    <li className="mt-3">
      <Link to="/">
        <FaHome />
        Accueil
      </Link>
    </li>
    <li>
      <Link to="/recettes">
        <FaCartShopping />
        Recette
      </Link>
    </li>
    <li>
      <Link to="/orders-tracking">
        <FaLocationArrow />
        Orders Tracking
      </Link>
    </li>
    <li>
      <Link to="/customer-support">
        <FaQuestionCircle />
        Customer Support
      </Link>
    </li>
  </>
);

const DashboardLayout = () => {
  const { user, loading, logout } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
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
    <div>
      {isAdminLoading ? (
        <div>Loading...</div>
      ) : isAdmin ? (
        <div className="drawer sm-drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col sm-items-start sm-justify-start my-2">
            <div className="flex items-center justify-between mx-4">
              <label
                htmlFor="my-drawer-2"
                className="btn btn-primary drawer-button2 sm-hidden"
              >
                <MdOutlineDashboardCustomize />
              </label>
              <div id="navbar-end" className="navbar-end">
                {user ? (
                  <button
                    className="btn flex items-center gap-2 rounded-full px-6 btn-primary text-white sm-hidden"
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
              <h1 className="text-xl font-semibold">
                Bonjour, {user.displayName || user.email.split("@")[0]}
              </h1>
              <Outlet />
            </div>
          </div>
          <div className="drawer-side3">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu-drawer2 p-4 w-full text-base-content">
              <li className="mb-3">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <img src={logo} alt="logo" className="w-10 h-10" />
                  <span className="badge badge-primary">Admin</span>
                </Link>
              </li>
              <hr />
              <li className="mt-3">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <MdDashboard /> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/bookings"
                  className="flex items-center gap-2"
                >
                  <FaShoppingBag /> Manage Bookings
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
                  <FaEdit /> Manage Items
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/dashboard/users" className="flex items-center gap-2">
                  <FaUsers /> Users
                </Link>
              </li>
              <hr />
              {sharedMenu}
            </ul>
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <Link to="/">Retour à l'accueil</Link>
        </div>
      )}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmer la déconnexion</h3>
            <p className="py-4">Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleLogout}>
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
