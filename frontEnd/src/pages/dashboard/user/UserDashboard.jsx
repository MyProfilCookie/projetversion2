/* eslint-disable no-unused-vars */
// UserDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { LikeRecetteContext } from '../../../contexts/LikeRecetteProvider';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const UserDashboard = () => {
  const { userId } = useParams(); // Récupère l'ID de l'utilisateur depuis les paramètres de l'URL
  const { user } = useAuth();
  const { likes, dislikes } = useContext(LikeRecetteContext);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [dislikedRecipes, setDislikedRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const likedResponse = await axios.get(`/api/users/${userId}/liked-disliked-recipes`);
        const userRecipesResponse = await axios.get(`/api/users/${userId}/recipes`);

        setLikedRecipes(likedResponse.data.likedRecipes || []);
        setDislikedRecipes(likedResponse.data.dislikedRecipes || []);
        setUserRecipes(userRecipesResponse.data || []);
      } catch (error) {
        console.error("Error fetching user recipes:", error);
        setUserRecipes([]); // Initialise userRecipes en tant que tableau vide en cas d'erreur
      }
    };

    fetchRecipes();
  }, [userId]);

  const handleUpdateProfile = async () => {
    await axios.put(`/api/users/${userId}`, { email, username });
    alert('Profile updated successfully!');
  };

  return (
    <div id="dashboard-container" className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="profile-section">
        <div className="profile-picture">
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
        <h2>Profile</h2>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button onClick={handleUpdateProfile}>Update Profile</button>
      </div>

      <div className="recipes-section">
        <h2>Liked Recipes</h2>
        <ul>
          {likedRecipes.map((recipe) => (
            <li key={recipe._id}>{recipe.title}</li>
          ))}
        </ul>
      </div>

      <div className="recipes-section">
        <h2>Disliked Recipes</h2>
        <ul>
          {dislikedRecipes.map((recipe) => (
            <li key={recipe._id}>{recipe.title}</li>
          ))}
        </ul>
      </div>

      <div className="recipes-section">
        <h2>My Recipes</h2>
        <ul>
          {Array.isArray(userRecipes) && userRecipes.map((recipe) => (
            <li key={recipe._id}>{recipe.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;