/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome,  FaLocationArrow, FaQuestionCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-menu">
      <li className="mt-3" onClick={toggleMenu} style={{ cursor: "pointer", backgroundColor: "#ff4747", color: "#fff", padding: "0.5rem", borderRadius: "0.5rem" }}>
        <FaHome />
        Accueil
      </li>
      {isOpen && (
        <ul
          className="dropdown-content"
          style={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            top: "100%",
            left: 0,
            // backgroundColor: "#fff",
            // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1,
            // padding: "1rem",
            // borderRadius: "0.5rem",
            backgroundColor: "#ff4747",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <li style={{ marginBottom: "1rem" }}>
            <Link to="/recettes" style={{ textDecoration: "none", color: "#fff" }}>
              <FaCartShopping />
              Recette
            </Link>
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <Link to="/orders-tracking" style={{ textDecoration: "none", color: "#fff" }}>
              <FaLocationArrow />
              Orders Tracking
            </Link>
          </li>
          <li>
            <Link to="/customer-support" style={{ textDecoration: "none", color: "#fff" }}>
              <FaQuestionCircle />
              Customer Support
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
