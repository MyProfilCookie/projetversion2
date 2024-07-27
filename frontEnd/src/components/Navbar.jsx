/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import logo from "/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faShop } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Modal from "./Modal";
import Profile from "./Profile";
import { useCart } from "../contexts/CartProvider";
import { useTheme } from "../hooks/ThemeContext";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { cart } = useCart();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Contact", link: "/contact" },
    { id: 3, name: "About", link: "/about" },
    { id: 4, name: "Recettes", link: "/recettes" },
    { id: 5, name: "Articles", link: "/articles" },
  ];

  const cartCount = Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    <header
      id="navbar-header"
      style={{ maxWidth: "1568px", margin: "0 auto" }}
      className={`top-0 left-0 right-0 transition-all duration-300 ease-in-out z-10000 ${isSticky ? "shadow-md" : ""} ${isDarkMode ? "bgDark text-white" : "PrimaryBG text-black"}`}
    >
      <div id="navbar" className="navbar py-2">
        <Link to="/" id="navbar-logo">
          <img
            src={logo}
            alt="logo"
            style={{ width: "60px" }}
            className={`${isDarkMode ? "bgDark inverti" : "PrimaryBG"}`}
          />
        </Link>
        <div id="navbar-start" className="navbar-start">
          <div
            id="navbar-dropdown"
            className={`dropdown ${isOpen ? "open" : ""}`}
          >
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost"
              onClick={toggleMenu}
            >
              <FontAwesomeIcon
                icon={isOpen ? faTimes : faBars}
                size="2xl"
                style={{ height: "25px", color: "black" }}
                className={`md-hidden ${isDarkMode ? "bgDark inverti" : "PrimaryBG"}`}
              />
            </div>
            {isOpen && (
              <ul
                tabIndex={0}
                className="dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                {navItems.map((item) => (
                  <li key={item.id} className="py-1 mt-3 mb-3">
                    <NavLink to={item.link} onClick={() => setIsOpen(false)}>
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <Link to="/cart">
          <label
            tabIndex={0}
            className="btn btn-circle flex items-center justify-center mr-3"
          >
            <div
              className={"indicator" && `${isDarkMode ? "bgDark inverti" : "PrimaryBG"}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon icon={faShop} />
              <span
                className="badge badge-sm indicator-item"
                style={{ width: "30px", height: "30px", fontWeight: "bold" }}
              >
                {cartCount}
              </span>
            </div>
          </label>
        </Link>
        <div id="navbar-center" className="navbar-center hidden lg-flex px-4">
          <ul className="menu menu-horizontal px-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.link}
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: "inherit",
                  }}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div id="navbar-end" className="navbar-end">
          {user ? <Profile user={user} /> : <Modal />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
