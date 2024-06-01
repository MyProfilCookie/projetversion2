/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Categories from './Categories'; 

function Gourmandise() {
  const [recettes, setRecettes] = useState([]);
  const location = useLocation();
  const currentCategory = 'Gourmandise';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/recettes/category?category=Gourmandises`);
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
  }, [location]);

  console.log(recettes); // Vérifier les données reçues
  const ids = recettes.map(recette => recette._id);
  console.log('IDs:', ids);

  return (
    <div>
      <Categories currentCategory={currentCategory} />
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
    </div>
  );
}

export default Gourmandise;