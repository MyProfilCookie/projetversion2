/* eslint-disable no-unused-vars */
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthProvider'
import LoadingScreen from '../components/LoadingScreen'
import { useTheme } from '../hooks/ThemeContext'

const Main = () => {
    const { loading } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useTheme();
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
      }, [isDarkMode]);
      return (
        <div className={`bg-${isDarkMode ? "dark" : "primaryBG"}`} style={{ fontFamily: 'Lora' }}>
          {loading ? (
            <LoadingScreen />
          ) : (
            <div className="relative">
              <Navbar />
              <div className="fixed top-14 lg:top-0  right-0 p-5 themediv">
                <input
                  type="checkbox"
                  className="toggle"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
              </div>
              <div className="min-h-screen">
                <Outlet />
              </div>
              <Footer />
            </div>
          )}
        </div>
      );
    };
    

export default Main

