/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';

const LikeRecetteContext = createContext();

const LikeRecetteProvider = ({ children }) => {
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});

  const toggleLike = (recetteId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [recetteId]: !prevLikes[recetteId],
    }));
    if (dislikes[recetteId]) {
      setDislikes((prevDislikes) => ({
        ...prevDislikes,
        [recetteId]: false,
      }));
    }
  };

  const toggleDislike = (recetteId) => {
    setDislikes((prevDislikes) => ({
      ...prevDislikes,
      [recetteId]: !prevDislikes[recetteId],
    }));
    if (likes[recetteId]) {
      setLikes((prevLikes) => ({
        ...prevLikes,
        [recetteId]: false,
      }));
    }
  };

  return (
    <LikeRecetteContext.Provider value={{ likes, dislikes, toggleLike, toggleDislike }}>
      {children}
    </LikeRecetteContext.Provider>
  );
};

export { LikeRecetteProvider, LikeRecetteContext };