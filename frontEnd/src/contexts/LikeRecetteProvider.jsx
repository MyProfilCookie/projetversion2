/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthProvider.jsx';

const LikeRecetteContext = createContext();

const LikeRecetteProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [recettes, setRecettes] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      const fetchLikesDislikes = async () => {
        try {
          const response = await axios.get(`/api/users/${user._id}/liked-disliked-recettes`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });

          const data = response.data;

          if (Array.isArray(data.likedRecipes)) {
            setLikes(
              data.likedRecipes.reduce((acc, recette) => {
                acc[recette._id] = true;
                return acc;
              }, {})
            );
          }

          if (Array.isArray(data.dislikedRecipes)) {
            setDislikes(
              data.dislikedRecipes.reduce((acc, recette) => {
                acc[recette._id] = true;
                return acc;
              }, {})
            );
          }
        } catch (error) {
          console.error('Error fetching likes or dislikes:', error.response || error.message);
        }
      };

      fetchLikesDislikes();
    }
  }, [user]);

  const handleToggleLike = async (recetteId, like = true) => {
    if (!user || !user._id) {
      console.error('User not authenticated');
      return;
    }

    try {
      const method = like ? 'POST' : 'DELETE';
      const response = await axios({
        method,
        url: `/api/users/${user._id}/liked-recipes`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        data: { recetteId },
      });

      const data = response.data;

      setLikes((prevLikes) => {
        const newLikes = { ...prevLikes };
        if (like) {
          newLikes[recetteId] = true;
        } else {
          delete newLikes[recetteId];
        }
        return newLikes;
      });

      if (dislikes[recetteId]) {
        setDislikes((prevDislikes) => {
          const newDislikes = { ...prevDislikes };
          delete newDislikes[recetteId];
          return newDislikes;
        });
      }

      updateRecetteLikesDislikes(recetteId, data.likes, data.dislikes);
    } catch (error) {
      console.error('Error toggling like:', error.response || error.message);
    }
  };

  const handleToggleDislike = async (recetteId, dislike = true) => {
    if (!user || !user._id) {
      console.error('User not authenticated');
      return;
    }

    try {
      const method = dislike ? 'POST' : 'DELETE';
      const response = await axios({
        method,
        url: `/api/users/${user._id}/disliked-recipes`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        data: { recetteId },
      });

      const data = response.data;

      setDislikes((prevDislikes) => {
        const newDislikes = { ...prevDislikes };
        if (dislike) {
          newDislikes[recetteId] = true;
        } else {
          delete newDislikes[recetteId];
        }
        return newDislikes;
      });

      if (likes[recetteId]) {
        setLikes((prevLikes) => {
          const newLikes = { ...prevLikes };
          delete newLikes[recetteId];
          return newLikes;
        });
      }

      updateRecetteLikesDislikes(recetteId, data.likes, data.dislikes);
    } catch (error) {
      console.error('Error toggling dislike:', error.response || error.message);
    }
  };

  const updateRecetteLikesDislikes = (recetteId, likesCount, dislikesCount) => {
    setRecettes((prevRecettes) =>
      prevRecettes.map((recette) =>
        recette._id === recetteId
          ? { ...recette, likes: likesCount, dislikes: dislikesCount }
          : recette
      )
    );
  };

  return (
    <LikeRecetteContext.Provider
      value={{ likes, dislikes, handleToggleLike, handleToggleDislike, recettes, setRecettes }}
    >
      {children}
    </LikeRecetteContext.Provider>
  );
};

const useLikeRecette = () => useContext(LikeRecetteContext);

export { LikeRecetteProvider, LikeRecetteContext, useLikeRecette };


















