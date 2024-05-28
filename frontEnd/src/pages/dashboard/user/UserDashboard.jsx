/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { LikeRecetteContext } from '../../../contexts/LikeRecetteProvider';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const UserDashboard = () => {
  const { user } = useAuth();
  const { likes, dislikes } = useContext(LikeRecetteContext);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [dislikedRecipes, setDislikedRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    console.log('user.uid:', user.uid); // Ajoutez ceci pour vérifier que user.uid est bien défini
    if (!user.uid) return;

    const fetchRecipes = async () => {
      try {
        const likedResponse = await axios.get(`${import.meta.env.VITE_API_URL}users/${user.uid}/liked-disliked-recettes`);
        const userRecipesResponse = await axios.get(`${import.meta.env.VITE_API_URL}users/${user.uid}/recettes`);

        setLikedRecipes(likedResponse.data.likedRecipes || []);
        setDislikedRecipes(likedResponse.data.dislikedRecipes || []);
        setUserRecipes(userRecipesResponse.data || []);
      } catch (error) {
        console.error("Error fetching user recettes:", error);
        setUserRecipes([]);
      }
    };

    fetchRecipes();
  }, [user.uid]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = "votre_token"; // Utilisez le token correct ici
      await axios.put(`${import.meta.env.VITE_API_URL}/users/${user.uid}`, { email, username }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profileImage', selectedFile);

    try {
      const token = "votre_token"; // Utilisez le token correct ici
      await axios.post(`${import.meta.env.VITE_API_URL}/users/${user.uid}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
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
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleImageUpload}>Upload Image</button>
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