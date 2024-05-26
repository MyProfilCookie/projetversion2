/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from'react-router-dom';

function Fruits() {
  const [recettes, setRecettes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/recettes?category=Fruits');
        const data = await response.json();
        setRecettes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div id="cards-container">
      {recettes.map((recette) => (
        <div id="card" key={recette._id}>
          <img src={recette.image} alt={recette.title} />
          <div id="card-body-cards">
            <h3 className="card-title">{recette.title}</h3>
            <p>{recette.description}</p>
            <button className="btn-primary"><Link to={`/recettes/${recette.id}`}>Voir plus</Link></button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Fruits;