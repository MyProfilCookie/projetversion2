/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import logo from '/logo2.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import Modal from './Modal';
import Profile from './Profile';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);

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
    <header id="navbar-header" className={`sticky top-0 left-0 right-0 transition-all duration-300 ease-in-out z-10000 py-4 ${isSticky ? 'shadow-md' : ''}`}>
      <div id="navbar" className="navbar" style={{ backgroundColor: 'A7001E' }}>
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