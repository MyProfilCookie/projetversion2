/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthProvider';
import { useLikeRecette } from '../../../contexts/LikeRecetteProvider';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from '../../../components/LoadingScreen';

const UserDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const { likes, dislikes, handleToggleLike, handleToggleDislike } = useLikeRecette();
  const [dislikedRecipes, setDislikedRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [newRecipeFile, setNewRecipeFile] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    titre: '',
    description: '',
    ingredients: '',
    instructions: '',
    temps_preparation: '',
    temps_cuisson: '',
    difficulte: 'facile',
    category: 'Chocolat',
  });

  const categories = ['Chocolat', 'Gourmandises', 'Pains et viennoiserie', 'Fruits'];
  const difficulties = ['facile', 'moyenne', 'difficile'];

  useEffect(() => {
    if (loading || !user || !user._id) return;

    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!user._id) {
          console.error("User ID is not available");
          return;
        }

        const likedResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${user._id}/liked-disliked-recettes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userRecipesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${user._id}/recettes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const pendingRecipesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${user._id}/pending-recettes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDislikedRecipes(likedResponse.data.dislikedRecipes || []);
        setUserRecipes(userRecipesResponse.data.recipes || []);
        setPendingRecipes(pendingRecipesResponse.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des recettes de l\'utilisateur :', error);
        setDislikedRecipes([]);
        setUserRecipes([]);
        setPendingRecipes([]);
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/payments?email=${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
      }
    };

    fetchRecipes();
    fetchOrders();
  }, [user, loading]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleNewRecipeFileChange = (e) => {
    setNewRecipeFile(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${user._id}`,
        { email, username },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profileImage', selectedFile);

    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Image téléchargée avec succès !');
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image :', error);
    }
  };

  const handleNewRecipeChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitRecipe = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('titre', newRecipe.titre);
      formData.append('description', newRecipe.description);
      formData.append('ingredients', newRecipe.ingredients);
      formData.append('instructions', newRecipe.instructions);
      formData.append('temps_preparation', newRecipe.temps_preparation);
      formData.append('temps_cuisson', newRecipe.temps_cuisson);
      formData.append('difficulte', newRecipe.difficulte);
      formData.append('category', newRecipe.category);
      if (newRecipeFile) {
        formData.append('image', newRecipeFile);
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/recettes`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Recette soumise avec succès, en attente de validation !');
      setNewRecipe({
        titre: '',
        description: '',
        ingredients: '',
        instructions: '',
        temps_preparation: '',
        temps_cuisson: '',
        difficulte: 'facile',
        category: 'Chocolat',
      });
      setNewRecipeFile(null);
      // Refresh pending recipes
      const pendingRecipesResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/pending-recettes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingRecipes(pendingRecipesResponse.data || []);
    } catch (error) {
      console.error('Erreur lors de la soumission de la recette :', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <div>L'utilisateur n'existe pas</div>; 
  }

  return (
    <div id='dashboard-container' className='dashboard-container'>
      <h1 className='dashboard-title'>Tableau de Bord</h1>

      <div className='profile-section'>
        <div className='profile-picture'>
          {user.image ? (
            <img src={`${import.meta.env.VITE_API_URL}/uploads/${user.image}`} alt={user.username} />
          ) : (
            <FontAwesomeIcon icon={faUserCircle} size="3x" />
          )}
        </div>
        <h2 style={{ color: 'green', textAlign: 'center', textTransform: 'uppercase', borderBottom: '1px solid green', fontWeight: 'bold' }}>Profil</h2>
        <label>
          Nom d'utilisateur :
          <input
            style={{ marginLeft: '5px', padding: '5px 10px', border: '1px solid black', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Email :
          <input
            style={{ marginLeft: '5px', padding: '5px 10px', border: '1px solid black', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <input type='file' onChange={handleFileChange} style={{ marginTop: '10px', marginBottom: '10px', padding: '5px 10px' }} />
        <button style={{ marginTop: '10px', marginBottom: '10px', marginRight: '10px', padding: '5px 10px' }} onClick={handleImageUpload}>Télécharger l'image</button>
        <button style={{ marginTop: '10px', marginBottom: '10px', padding: '5px 10px' }} onClick={handleUpdateProfile}>Mettre à jour le profil</button>
      </div>

      <div className='recipes-section'>
        <h2 style={{ color: 'green', textAlign: 'center', textTransform: 'uppercase', borderBottom: '1px solid green', fontWeight: 'bold' }}>Recettes aimées</h2>
        <ul>
          {Object.keys(likes).map((recetteId) => (
            <li key={recetteId}>
              {likes[recetteId].titre} {/* Assuming likes is an object with recette details */}
              <button onClick={() => handleToggleLike(recetteId, !likes[recetteId])}>
                {likes[recetteId] ? 'Unlike' : 'Like'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className='recipes-section'>
        <h2 style={{ color: 'green', textAlign: 'center', textTransform: 'uppercase', borderBottom: '1px solid green', fontWeight: 'bold' }}>Recettes non aimées</h2>
        <ul>
          {Object.keys(dislikes).map((recetteId) => (
            <li key={recetteId}>
              {dislikes[recetteId].titre} {/* On verifie si la recette est dans le tableau dislikes */}
              <button onClick={() => handleToggleDislike(recetteId, !dislikes[recetteId])}>
                {dislikes[recetteId] ? 'Remove Dislike' : 'Dislike'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className='recipes-section'>
        <h2 style={{ color: 'green', textAlign: 'center', textTransform: 'uppercase', borderBottom: '1px solid green', fontWeight: 'bold' }}>Mes recettes</h2>
        <ul>
          {Array.isArray(userRecipes) &&
            userRecipes.map((recipe) => (
              <li key={recipe._id}>{recipe.titre}</li>
            ))}
        </ul>
      </div>

      <div className='recipes-section'>
        <h2 style={{ color: 'green', textAlign: 'center', textTransform: 'uppercase', borderBottom: '1px solid green', fontWeight: 'bold' }}>Recettes en attente</h2>
        <ul>
          {pendingRecipes.map((recipe) => (
            <li key={recipe._id}>{recipe.titre}</li>
          ))}
        </ul>
      </div>

      <div className='recipes-section'>
        <h2 style={{ color: 'green', textAlign: 'center', textTransform: 'uppercase', borderBottom: '1px solid green', fontWeight: 'bold' }}>Ajouter une recette</h2>
        <label>
          Titre:
          <input
            type='text'
            name='titre'
            value={newRecipe.titre}
            onChange={handleNewRecipeChange}
            style={{ marginLeft: '5px', padding: '5px 10px', border: '1px solid black', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
          />
        </label>
        <label>
          Description:
          <textarea
            name='description'
            value={newRecipe.description}
            onChange={handleNewRecipeChange}
            style={{ marginLeft: '5px', padding: '5px 10px', border: '1px solid black', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
          />
        </label>
        <label>
          Ingrédients:
          <textarea
            name='ingredients'
            value={newRecipe.ingredients}
            onChange={handleNewRecipeChange}
            style={{ marginLeft: '5px', padding: '5px 10px', border: '1px solid black', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
          />
        </label>
        <label>
          Instructions:
          <textarea
            name='instructions'
            value={newRecipe.instructions}
            onChange={handleNewRecipeChange}
            style={{ marginLeft: '5px', padding: '5px 10px', border: '1px solid black', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
          />
        </label>
        <label>
          Temps de préparation:
          <input
            type='text'
            name='temps_preparation'
            value={newRecipe.temps_preparation}
            onChange={handleNewRecipeChange}
            style={{ marginLeft: '5px', padding: '5px 10px', border: '1px solid black', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
          />
        </label>
        <label>
          Temps de cuisson:
          <input
            type='text'
            name='temps_cuisson'
            value={newRecipe.temps_cuisson}
            onChange={handleNewRecipeChange}
            style={{ marginLeft: '5px', padding: '5px 10px', border: '1px solid black', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
          />
        </label>
        <label>
          Difficulté:
          <select
            name='difficulte'
            value={newRecipe.difficulte}
            onChange={handleNewRecipeChange}
            style={{ marginLeft: '5px', padding: '5px 10px', border: '1px solid black', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </label>
        <label>
          Catégorie:
          <select
            name='category'
            value={newRecipe.category}
            onChange={handleNewRecipeChange}
            style={{ marginLeft: '5px', padding: '5px 10px', border: '1px solid black', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Image:
          <input type='file' onChange={handleNewRecipeFileChange} style={{ marginTop: '10px', marginBottom: '10px', padding: '5px 10px' }} />
        </label>
        <button onClick={handleSubmitRecipe} style={{ marginTop: '10px', padding: '5px 10px' }}>Soumettre la recette</button>
      </div>

      <div className='recipes-section'>
        <h2 style={{ color: 'green', textAlign: 'center', textTransform: 'uppercase', borderBottom: '1px solid green', fontWeight: 'bold' }}>Mes commandes</h2>
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <div>ID de commande: {order._id}</div>
              <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span> <br />
              <span style={{ color: 'red', fontWeight: 'bold' }}>Montant: {order.price} €</span> <br />
              <span>Status: {order.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;











