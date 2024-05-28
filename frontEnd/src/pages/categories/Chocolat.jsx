/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Chocolat() {
  const [recettes, setRecettes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}recettes/category?category=Chocolat`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRecettes(data);
      } catch (error) {
        console.error('Error fetching the recipes:', error);
      }
    };
    fetchData();
  }, []);
  console.log(recettes)

  return (
    <div id="cards-container">
      {recettes.map((recette) => (
        <div id="card" key={recette._id}>
          <img src={recette.image} alt={recette.title} />
          <div id="card-body-cards">
            <h3 className="card-title">{recette.title}</h3>
            <p>{recette.description}</p>
            <button className="btn-primary"><Link to={`/recettes/${recette._id}`}>Voir plus</Link></button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Chocolat;
