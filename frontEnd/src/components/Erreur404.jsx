/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';


const Erreur404 = () => {
  return (
    <div id="error-404">
      <div className="error-container">
        <h1 className="error-title">404</h1>
        <p className="error-message">Oups! La page que vous cherchez n'existe pas.</p>
        <Link to="/" className="btn-home">Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default Erreur404;