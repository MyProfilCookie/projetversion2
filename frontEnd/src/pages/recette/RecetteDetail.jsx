/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';
import { useLikeRecette } from '../../contexts/LikeRecetteProvider';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from '../../components/LoadingScreen';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';

function RecetteDetail() {
  const { id } = useParams(); // Utilisation de useParams pour obtenir l'ID de la recette
  const { user, loading } = useContext(AuthContext);
  const { likes, dislikes, handleToggleLike, handleToggleDislike } = useLikeRecette();
  const [recette, setRecette] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [checkedSteps, setCheckedSteps] = useState([]);

  useEffect(() => {
    const fetchRecette = async () => {
      try {
        const response = await axios.get(`/api/recettes/${id}`);
        setRecette(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la recette:', error);
      }
    };

    const fetchComments = async (recetteId) => {
      try {
        const response = await axios.get(`/api/recettes/${recetteId}/comments`);
        setComments(response.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
        setComments([]);
      }
    };

    fetchRecette();
    fetchComments(id);
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vous devez être connecté pour laisser un commentaire.');
      return;
    }

    try {
      const commentData = { contenu: comment, user: user._id, recette: recette._id };
      const response = await axios.post(
        `/api/recettes/${recette._id}/comments`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setComment('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du commentaire:', error);
    }
  };

  const handleStepCheck = (index) => {
    setCheckedSteps((prevCheckedSteps) => {
      const newCheckedSteps = [...prevCheckedSteps];
      if (newCheckedSteps.includes(index)) {
        newCheckedSteps.splice(newCheckedSteps.indexOf(index), 1);
      } else {
        newCheckedSteps.push(index);
      }
      return newCheckedSteps;
    });
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
    }
  };

  if (loading || !recette) {
    return <LoadingScreen />;
  }
  
  const imageUrl = recette.image
    ? recette.image.startsWith('uploads/')
      ? `${import.meta.env.VITE_API_URL}/${recette.image}`
      : `${import.meta.env.VITE_API_URL}/uploads/${recette.image}`
    : null;

  return (
    <div id="recette-detail" className="recette-detail">
      <div className="header">
        <h1 className="title">{recette.titre}</h1>
        <div className="like-dislike">
          <button
            className={`like-button ${likes[recette._id] ? 'liked' : ''}`}
            onClick={() => handleToggleLike(recette._id)}
          >
            <FontAwesomeIcon icon={faThumbsUp} />
          </button>
          <button
            className={`dislike-button ${dislikes[recette._id] ? 'disliked' : ''}`}
            onClick={() => handleToggleDislike(recette._id)}
          >
            <FontAwesomeIcon icon={faThumbsDown} />
          </button>
        </div>
        {likes[recette._id] && (
          <p className="like-message">Cette recette a été likée</p>
        )}
        {dislikes[recette._id] && (
          <p className="dislike-message">Cette recette a été dislikée</p>
        )}
      </div>
      <div className="left-column">
        {recette.image && (
          recette.image.startsWith('uploads/') ? (
            <img src={`${import.meta.env.VITE_API_URL}/${recette.image}`} alt={recette.titre} />
          ) : (
            <img src={`${import.meta.env.VITE_API_URL}/uploads/${recette.image}`} alt={recette.titre} />
          )
        )}
        <div className="details">
          <p>Temps de préparation : {recette.temps_preparation}</p>
          <p>Temps de cuisson : {recette.temps_cuisson}</p>
          <p>Difficulté : {recette.difficulte}</p>
        </div>
      </div>
      <div className="right-column">
        <div className="ingredients">
          <h2>Ingrédients</h2>
          <ul>
            {recette.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="instructions">
          <h3>Étape par étape</h3>
          <ol>
            {recette.instructions.map((step, index) => (
              <li
                key={index}
                className={checkedSteps.includes(index) ? 'checked' : ''}
              >
                <input
                  type="checkbox"
                  checked={checkedSteps.includes(index)}
                  onChange={() => handleStepCheck(index)}
                />
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="comments-section">
          <h3>Commentaires</h3>
          <ul>
            {Array.isArray(comments) &&
              comments.map((c, index) => (
                <li key={index}>
                  {c.user.image ? (
                    <img src={`${import.meta.env.VITE_API_URL}/uploads/${c.user.image}`} alt={c.user.username} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                  ) : (
                    <FontAwesomeIcon icon={faUserCircle} style={{ width: '30px', height: '30px' }} />
                  )}
                  <strong>{c.user.username}</strong>: {c.contenu}
                  {user && user._id === c.user._id && (
                    <button onClick={() => handleDeleteComment(c._id)}>Supprimer</button>
                  )}
                </li>
              ))}
          </ul>
          {user && (
            <form
              onSubmit={handleCommentSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Laissez un commentaire..."
                required
                cols={30}
                rows={5}
              />
              <button
                type="submit"
                style={{
                  alignSelf: 'center',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  backgroundColor: '#ff6347',
                  color: '#fff',
                  border: 'none',
                }}
              >
                Envoyer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecetteDetail;
