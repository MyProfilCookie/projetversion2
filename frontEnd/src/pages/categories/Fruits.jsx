/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Categories from "./Categories";

function Fruits() {
  const [recettes, setRecettes] = useState([]);
  const location = useLocation();
  const currentCategory = "Fruits";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/recettes/category?category=Fruits`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRecettes(data);
      } catch (error) {
        console.error("Error fetching the recipes:", error);
      }
    };
    fetchData();
  }, [location]);

  console.log(recettes); // Vérifier les données reçues
  const ids = recettes.map((recette) => recette._id);
  console.log("IDs:", ids);

  const getImageUrl = (item) => {
    if (!item.image) return null;
    return item.image.startsWith('uploads/')
      ? `${import.meta.env.VITE_API_URL}/${item.image}`
      : `${import.meta.env.VITE_API_URL}/uploads/${item.image}`;
  };

  return (
    <div>
      <Categories currentCategory={currentCategory} />
      <div id="cards-container">
        {recettes.map((recette) => (
          <div id="card" key={recette._id} style={{ height: "100%" }}>
            <img src={getImageUrl(recette)} alt={recette.title} style={{ borderRadius: "10px 10px 0 0", height: "200px", objectFit: "cover" }} />
            <div id="card-body-cards">
              <h3 className="card-title" style={{ fontFamily: "Playfair Display", color: "chocolate" }}>{recette.titre}</h3>
              <p>{recette.description ? recette.description.slice(0, 100) + "..." : ""}</p>
              <button className="btn-primary">
                <Link to={`/recettes/${recette._id}`} style={{ fontFamily: "Playfair Display", fontWeight: "bold", color: "white" }}>Voir plus de détails</Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Fruits;
