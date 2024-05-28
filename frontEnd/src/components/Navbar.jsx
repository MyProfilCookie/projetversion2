/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import logo from '/logo2.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import Modal from './Modal';
import Profile from './Profile';
import useCart from "../hooks/useCart";
import { useTheme } from "../hooks/ThemeContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useContext(AuthContext);
  const [cart, refetch] = useCart();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { id: 1, name: 'Home', link: '/' },
    { id: 2, name: 'Contact', link: '/contact' },
    { id: 3, name: 'About', link: '/about' },
    { id: 4, name: 'Recettes', link: '/recettes' },
  ];

  return (
    <header id="navbar-header" className={`sticky top-0 left-0 right-0 transition-all duration-300 ease-in-out z-10000 ${isSticky ? 'shadow-md' : ''}`}>
      <div id="navbar" className="navbar py-2" style={{ backgroundColor: 'A7001E' }}>
        <a href='/' id="navbar-logo">
          <img src={logo} alt="logo" style={{ width: '60px' }} className='logo-react' />
        </a>
        <div id="navbar-start" className="navbar-start">
          <div id="navbar-dropdown" className={`dropdown ${isOpen ? 'open' : ''}`}>
            <div tabIndex={0} role="button" className="btn btn-ghost" onClick={toggleMenu}>
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="2xl" style={{height: '25px', color: '#FAF2EA' }} className='md-hidden' />
            </div>
            <ul tabIndex={0} className="dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              {navItems.map(item => (
                <li key={item.id} className="py-1 mt-3 mb-3">
                  <NavLink to={item.link} onClick={() => setIsOpen(false)}>{item.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Link to="/cart-page">
         <label
            tabIndex={0}
            className="btn btn-ghost btn-circle  lg:flex items-center justify-center mr-3"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge badge-sm indicator-item">{cart.length || 0}</span>
            </div>
          </label>
         </Link>
        <div id="navbar-center" className="navbar-center hidden lg:flex px-4">
          <ul className="menu menu-horizontal px-1">
            {navItems.map(item => (
              <li key={item.id}>
                <NavLink to={item.link} style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.name}</NavLink>
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