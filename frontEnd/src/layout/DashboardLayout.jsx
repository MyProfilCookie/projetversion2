/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { MdDashboard, MdOutlineDashboardCustomize } from 'react-icons/md';
import {
  FaEdit,
  FaHome,
  FaLocationArrow,
  FaPlusCircle,
  FaQuestionCircle,
  FaRegUser,
  FaShoppingBag,
  FaUsers,
} from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import useAdmin from '../hooks/useAdmin';
import Login from '../components/Login';
import useAuth from '../hooks/useAuth';
import logo from '/logo.svg';

const sharedMenu = (
  <>
    <li className="mt-3">
      <Link to="/">
        <FaHome />
        Home
      </Link>
    </li>
    <li>
      <Link to="/menu">
        <FaCartShopping />
        Menu
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
  const { user, loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div>
      {isAdminLoading ? (
        <div>Loading...</div>
      ) : isAdmin ? (
        <div className="drawer sm:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2">
            <div className="flex items-center justify-between mx-4">
              <label
                htmlFor="my-drawer-2"
                className="btn btn-primary drawer-button2 sm-hidden"
              >
                <MdOutlineDashboardCustomize />
              </label>
              <button className="btn flex items-center gap-2 rounded-full px-6 btn-primary text-white sm-hidden">
                <FaRegUser /> Logout
              </button>
            </div>
            <div className="mt-5 md:mt-2 mx-4">
              <Outlet />
            </div>
          </div>
          <div className="drawer-side3">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu-drawer2 p-4 w-full bg-base-200 text-base-content">
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
                <Link to="/dashboard/bookings" className="flex items-center gap-2">
                  <FaShoppingBag /> Manage Bookings
                </Link>
              </li>
              <li>
                <Link to="/dashboard/add-menu" className="flex items-center gap-2">
                  <FaPlusCircle /> Add Menu
                </Link>
              </li>
              <li>
                <Link to="/dashboard/manage-items" className="flex items-center gap-2">
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
          <Link to="/">Back to Home</Link>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;