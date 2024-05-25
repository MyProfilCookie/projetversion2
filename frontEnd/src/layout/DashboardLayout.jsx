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
import Register from '../components/Register';
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
      <Link to="/menu">
        <FaLocationArrow />
        Orders Tracking
      </Link>
    </li>
    <li>
      <Link to="/menu">
        <FaQuestionCircle />
        Customer Support
      </Link>
    </li>
  </>
);

const DashboardLayout = () => {
  // eslint-disable-next-line no-unused-vars
  const { loading, user } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();

  return (
    <div>
      {isAdminLoading || isAdmin ? (
        <div className="drawer sm:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2">
            <div className="flex items-center justify-between mx-4">
              <label
                htmlFor="my-drawer-2"
                className="btn btn-primary drawer-button sm:hidden"
              >
                <MdOutlineDashboardCustomize />
              </label>
              <button className="btn flex items-center gap-2 rounded-full px-6 bg-green text-white sm:hidden">
                <FaRegUser /> Logout
              </button>
            </div>
            <div className="mt-5 md:mt-2 mx-4">
              <Outlet />
            </div>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
              <li>
                <Link to="/dashboard" className="flex justify-start mb-3">
                  <img src={logo} alt="" className="w-20" />
                  <span className="indicator-item badge badge-primary">Admin</span>
                </Link>
              </li>
              <hr />
              <li className="mt-3">
                <Link to="/dashboard">
                  <MdDashboard /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/bookings">
                  <FaShoppingBag /> Manage Bookings
                </Link>
              </li>
              <li>
                <Link to="/dashboard/add-menu">
                  <FaPlusCircle /> Add Menu
                </Link>
              </li>
              <li>
                <Link to="/dashboard/manage-items">
                  <FaEdit /> Manage Items
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/dashboard/users">
                  <FaUsers /> Users
                </Link>
              </li>
              <hr />
              {sharedMenu}
            </ul>
          </div>
        </div>
      ) : loading ? (
        <Register />
      ) : (
        <div className="h-screen flex items-center justify-center">
          <Link to="/">Back to Home</Link>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
