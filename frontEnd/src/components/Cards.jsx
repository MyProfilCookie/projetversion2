/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLikeRecette } from '../contexts/LikeRecetteProvider';
import { useAuth } from '../contexts/AuthProvider';
import Swal from 'sweetalert2';
import Notification from './Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartCrack } from '@fortawesome/free-solid-svg-icons';

function Cards({ item }) {
  const { likes = {}, dislikes = {}, handleToggleLike, handleToggleDislike } = useLikeRecette();
  const { isAuthenticated } = useAuth();
  const [localLikes, setLocalLikes] = useState(item.likes.length);
  const [localDislikes, setLocalDislikes] = useState(item.dislikes.length);
  const isLiked = likes[item._id];
  const isDisliked = dislikes[item._id];

  const [notification, setNotification] = useState('');
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [dislikeAnimation, setDislikeAnimation] = useState(false);

  const handleLike = async (recetteId) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Non autorisé',
        text: 'Vous devez être connecté pour liker cette recette.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok',
        willOpen: () => {
          const swalPopup = document.querySelector('.swal2-popup');
          if (swalPopup) {
            swalPopup.style.opacity = '1';
          }
        },
      });
      return;
    }

    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 500); // La durée de l'animation est de 500 millisecondes

    if (isLiked) {
      await handleToggleLike(recetteId, false);
      setLocalLikes(Math.max(localLikes - 1, 0));
      setNotification('Vous avez annulé votre j\'aime.');
    } else {
      await handleToggleLike(recetteId, true);
      if (isDisliked) {
        await handleToggleDislike(recetteId, false);
        setLocalDislikes(Math.max(localDislikes - 1, 0));
      }
      setLocalLikes(localLikes + 1);
      setNotification('Bravo, vous avez ajouté cette recette parmi vos favoris.');
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDislike = async (recetteId) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Non autorisé',
        text: 'Vous devez être connecté pour disliker cette recette.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok',
        willOpen: () => {
          const swalPopup = document.querySelector('.swal2-popup');
          if (swalPopup) {
            swalPopup.style.opacity = '1';
          }
        },
      });
      return;
    }

    setDislikeAnimation(true);
    setTimeout(() => setDislikeAnimation(false), 500); // La durée de l'animation est de 500 millisecondes

    if (isDisliked) {
      await handleToggleDislike(recetteId, false);
      setLocalDislikes(Math.max(localDislikes - 1, 0));
      setNotification('Vous avez annulé votre j\'aime pas.');
    } else {
      await handleToggleDislike(recetteId, true);
      if (isLiked) {
        await handleToggleLike(recetteId, false);
        setLocalLikes(Math.max(localLikes - 1, 0));
      }
      setLocalDislikes(localDislikes + 1);
      setNotification('Dommage, vous n\'avez pas aimé cette recette.');
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const imageUrl = item.image
    ? item.image.startsWith('uploads/')
      ? `/api/${item.image}`
      : `/api/uploads/${item.image}`
    : null;

  return (
    <div className="card" style={{ position: 'relative' }}>
      {notification && <Notification message={notification} />}

      <figure style={{ margin: 0, width: '100%', height: '200px', objectFit: 'cover' }}>
        <img src={imageUrl} alt={item.titre} className="card-img-top" />
      </figure>

      <div className="card-body-cards" style={{ scrollMarginTop: 0 }}>
        <Link to={`/recettes/${item._id}`} className="mx-auto">
          <h3 className="card-title">{item.titre}</h3>
        </Link>
        <p>{item.description.slice(0, 200)}...</p>
        <div className="card-actions">
          <button
            onClick={() => handleLike(item._id)}
            className={`like-button ${likeAnimation ? 'graffiti' : ''}`}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill={isLiked ? 'red' : 'grey'}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <span>{localLikes}</span> {/* Affiche le nombre de likes */}
          <button
            onClick={() => handleDislike(item._id)}
            className={`dislike-button ${dislikeAnimation ? 'graffiti' : ''}`}
          >
            <FontAwesomeIcon icon={faHeartCrack} color={isDisliked ? 'black' : 'grey'} />
          </button>
          <span>{localDislikes}</span> {/* Affiche le nombre de dislikes */}
        </div>
      </div>
    </div>
  );
}

export default Cards;





























