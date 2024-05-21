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
    <header className={`max-w-screen-2xl sticky top-0 left-0 right-0 transition-all duration-300 ease-in-out z-10000 py-4 ${isSticky ? 'shadow-md' : ''}`}>
      <div className="navbar bg-base-100">
        <a href='/'>
          <img src={logo} alt="logo" style={{ width: '60px' }} className='logo-react' />
        </a>
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={toggleMenu}>
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="2xl" style={{ color: '#fff' }} />
            </div>
            <ul tabIndex={0} className={`dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 ${isOpen ? 'block' : 'hidden'}`}>
              {navItems.map(item => (
                <li className="py-1 mt-3 mb-3"  key={item.id}>
                  <NavLink to={item.link} onClick={() => setIsOpen(false)} >{item.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex px-4">
          <ul className="menu menu-horizontal px-1">
            {navItems.map(item => (
              <li key={item.id}>
                <NavLink to={item.link} style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.name}</NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end">
          {user ? <Profile user={user} /> : <Modal />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;