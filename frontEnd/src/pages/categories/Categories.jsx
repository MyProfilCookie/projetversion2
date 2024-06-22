/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";


const Categories = ({ currentCategory }) => {
  const categories = [
    { name: "Gourmandise", path: "/categories/gourmandise" },
    { name: "Pains et viennoiserie", path: "/categories/pains-viennoiserie" },
    { name: "Fruits", path: "/categories/fruits" },
    { name: "Chocolat", path: "/categories/chocolat" },
  ];

  return (
    <nav id="categories-nav">
      <ul id="categories-list">
        {categories
          .filter((cat) => cat.name !== currentCategory)
          .map((category) => (
            <li key={category.name} className="category-item">
              <Link to={category.path} className="category-link">
                {category.name}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default Categories;

