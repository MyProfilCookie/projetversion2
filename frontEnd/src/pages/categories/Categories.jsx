/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";

const Categories = ({ currentCategory }) => {
  const categories = [
    { name: "Gourmandises", path: "/categories/gourmandise" },
    { name: "Pains et viennoiserie", path: "/categories/pains-viennoiserie" },
    { name: "Fruits", path: "/categories/fruits" },
    { name: "Chocolat", path: "/categories/chocolat" },
  ];

  return (
    <nav
      style={{
        backgroundColor: "rgb(254, 239, 201)",
        color: "rgb(209, 100, 0)",
        borderColor: "rgb(209, 100, 0)",
        borderRadius: "10px",
        padding: "10px",
        marginBottom: "20px",
        marginTop: "20px",
      }}
    >
      <ul id="desktopCategory">
        {categories
          .filter((cat) => cat.name !== currentCategory)
          .map((category) => (
            <li key={category.name} className="rounded-full">
              <Link
                to={category.path}
                className="btn-primary btn-duration"
                style={{
                  backgroundColor: "rgb(254, 239, 201)",
                  color: "rgb(209, 100, 0)",
                  borderColor: "rgb(209, 100, 0)",
                }}
              >
                {category.name}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default Categories;
