/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeather } from "@fortawesome/free-solid-svg-icons";

function Categories() {
  const Category = [
    {
      id: 1,
      name: "Gourmandise",
      image: "./images/gourmandise.jpg",
      path: "/categories/gourmandise",
    },
    {
      id: 2,
      name: "Chocolat",
      image: "./images/chocolat.jpg",
      path: "/categories/chocolat",
    },
    {
      id: 3,
      name: "Pains et viennoiserie",
      image: "./images/pain.jpg",
      path: "/categories/pains-viennoiserie",
    },
    {
      id: 4,
      name: "Fruits",
      image: "./images/fruits.jpg",
      path: "/categories/fruits",
    },
  ];

  return (
    <div className="section-container py-16 mb-20">
      <div className="text-center">
        <p className="text-red uppercase tracking-wide font-medium text-lg">
          Choisissez une catégorie
        </p>
        <h2 className="text-4xl md-text-5xl font-bold my-2 md-leading-snug leading-snug ">
          Nos recettes
        </h2>
      </div>

      <div className="gap-4 items-center mt-12 mobile-grid ">
        {Category.map((category) => (
          <Link
            key={category.id}
            to={category.path}
            className="shadow-lg rounded-md w-96 media-w-96 media-w-64 bg-white rounded-md mx-auto text-center cursor-pointer mb-10"
          >
            <div className="media-w-96 media-w-64 w-96 mx-auto mb-3">
              <img
                className="media-w-96 media-w-64 w-96"
                src={category.image}
                alt={category.name}
                style={{ borderRadius: "10px 10px 0 0" }}
              />
            </div>
            <div className="mt-5 space-y-1 mb-3">
              <h5 className="text-center font-bold text-lg" style={{ fontFamily: "Playfair Display" }}> {category.name}</h5>
              <button className="btn-primary font-semibold mt-10" style={{ fontFamily: "Playfair Display", fontWeight: "bold", borderRadius: "10px" }}>
                <FontAwesomeIcon icon={faFeather} /> {category.name}
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Categories;
