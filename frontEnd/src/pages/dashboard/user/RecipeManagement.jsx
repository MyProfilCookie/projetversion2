/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';

const RecipeManagement = () => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    temps_preparation: '',
    temps_cuisson: '',
    difficulte: '',
    category: '',
    image: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArrayChange = (index, e, field) => {
    const values = [...formData[field]];
    values[index] = e.target.value;
    setFormData({
      ...formData,
      [field]: values,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/recettes', formData);
      setMessage({ type: 'success', text: 'Recette créée avec succès!' });
      console.log(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la création de la recette!' });
      console.error('There was an error creating the recipe!', error);
    }
  };

  const addField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  return (
    <div className="create-recette">
      <h2>Créer une Nouvelle Recette</h2>
      {message.text && (
        <div className={message.type === 'error' ? 'error' : 'success'}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre</label>
          <input type="text" name="titre" value={formData.titre} onChange={handleChange} required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Ingrédients</label>
          {formData.ingredients.map((ingredient, index) => (
            <div className="array-input" key={index}>
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleArrayChange(index, e, 'ingredients')}
                required
              />
              {index === formData.ingredients.length - 1 && (
                <button type="button" onClick={() => addField('ingredients')}>+</button>
              )}
            </div>
          ))}
        </div>
        <div>
          <label>Instructions</label>
          {formData.instructions.map((instruction, index) => (
            <div className="array-input" key={index}>
              <input
                type="text"
                value={instruction}
                onChange={(e) => handleArrayChange(index, e, 'instructions')}
                required
              />
              {index === formData.instructions.length - 1 && (
                <button type="button" onClick={() => addField('instructions')}>+</button>
              )}
            </div>
          ))}
        </div>
        <div>
          <label>Temps de préparation</label>
          <input type="text" name="temps_preparation" value={formData.temps_preparation} onChange={handleChange} required />
        </div>
        <div>
          <label>Temps de cuisson</label>
          <input type="text" name="temps_cuisson" value={formData.temps_cuisson} onChange={handleChange} required />
        </div>
        <div>
          <label>Difficulté</label>
          <select name="difficulte" value={formData.difficulte} onChange={handleChange} required>
            <option value="">Sélectionner</option>
            <option value="facile">Facile</option>
            <option value="moyenne">Moyenne</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>
        <div>
          <label>Catégorie</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Sélectionner</option>
            <option value="Chocolat">Chocolat</option>
            <option value="Gourmandises">Gourmandises</option>
            <option value="Pains et viennoiserie">Pains et viennoiserie</option>
            <option value="Fruits">Fruits</option>
          </select>
        </div>
        <div>
          <label>Image URL</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} />
        </div>
        <button type="submit">Créer Recette</button>
      </form>
    </div>
  );
};

export default RecipeManagement;
