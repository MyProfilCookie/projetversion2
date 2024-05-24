/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { LikeRecetteContext } from '../contexts/LikeRecetteProvider';


function Cards({ item }) {
    const { likes, dislikes, toggleLike, toggleDislike } = useContext(LikeRecetteContext);
    const isLiked = likes[item.id];
    const isDisliked = dislikes[item.id];

    const [notification, setNotification] = useState('');

    const handleLike = (recetteId) => {
        toggleLike(recetteId);
        setNotification('Vous avez liké cette recette.');
        setTimeout(() => setNotification(''), 3000);
    };

    const handleDislike = (recetteId) => {
        toggleDislike(recetteId);
        setNotification('Vous avez disliké cette recette.');
        setTimeout(() => setNotification(''), 3000);
    };

    return (
        <div className="card">
            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}

            <figure style={{margin: 0}}>
                <img
                    src={item.image}
                    alt={item.titre}
                    className="card-img-top"
                />
            </figure>

            <div className="card-body-cards">
                <Link to={`/recettes/${item.id}`} className="mx-auto">
                    <h3 className="card-title">{item.titre}</h3>
                </Link>
                <p>{item.description.slice(0, 200)}...</p>
                <div className="card-actions justify-center">
                    <div
                        className={`like-button ${isLiked ? 'liked' : ''}`}
                        onClick={() => handleLike(item.id)}
                    >
                        <FontAwesomeIcon icon={faHeart} />
                    </div>
                    <div
                        className={`dislike-button ${isDisliked ? 'disliked' : ''}`}
                        onClick={() => handleDislike(item.id)}
                    >
                        <FontAwesomeIcon icon={faThumbsDown} />
                    </div>
                </div>
                <div className="card-actions">
                    <p className="font-semibold">
                        {item.difficulte === 'facile' && <span className="badge badge-primary">{item.difficulte}</span>}
                        {item.difficulte === 'moyenne' && <span className="badge badge-secondary">{item.difficulte}</span>}
                        {item.difficulte === 'difficile' && <span className="badge badge-accent">{item.difficulte}</span>}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Cards;