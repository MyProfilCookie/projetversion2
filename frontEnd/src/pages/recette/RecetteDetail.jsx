/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import recettes from '../../../public/recettes';
import { LikeRecetteContext } from '../../contexts/LikeRecetteProvider';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

function RecetteDetail() {
    const { id } = useParams();
    const { likes, dislikes, toggleLike, toggleDislike } = useContext(LikeRecetteContext);
    const { user } = useAuth();
    const [recette, setRecette] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]); 

    useEffect(() => {
        const recetteId = parseInt(id, 10);
        const foundRecette = recettes.find(r => r.id === recetteId);
        setRecette(foundRecette);
        fetchComments(recetteId);
    }, [id]);

    const fetchComments = async (recetteId) => {
        try {
            const response = await axios.get(`/api/recettes/${recetteId}/comments`);
            setComments(response.data || []); 
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]); 
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Vous devez être connecté pour laisser un commentaire.');
            return;
        }
        try {
            const response = await axios.post(`/api/recettes/${recette.id}/comments`, { comment });
            setComments([...comments, response.data]);
            setComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    if (!recette) {
        return <div>Recette introuvable.</div>;
    }

    return (
        <div id="recette-detail" className='recette-detail'>
            <div className="header">
                <h1 className='title'>{recette.titre}</h1>
                <div className="like-dislike">
                    <button className={`like-button ${likes[recette.id] ? 'liked' : ''}`} onClick={() => toggleLike(recette.id)}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </button>
                    <button className={`dislike-button ${dislikes[recette.id] ? 'disliked' : ''}`} onClick={() => toggleDislike(recette.id)}>
                        <FontAwesomeIcon icon={faThumbsDown} />
                    </button>
                </div>
                {likes[recette.id] && <p className="like-message">Cette recette a été liké</p>}
                {dislikes[recette.id] && <p className="dislike-message">Cette recette a été disliké</p>}
            </div>
            <div className="left-column">
                <img src={recette.image} alt={recette.titre} />
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
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div className="comments-section">
                    <h3 className='text-center'>Commentaires</h3>
                    <ul>
                        {Array.isArray(comments) && comments.map((c, index) => (
                            <li key={index}>{c.comment}</li>
                        ))}
                    </ul>
                    {user && (
                        <form onSubmit={handleCommentSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Laissez un commentaire..."
                                required
                                cols={30}
                                rows={5}
                            />
                            <button type="submit" style={{ alignSelf: 'center', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer', background: '#ff6347', color: 'white' }}>Envoyer</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecetteDetail;
