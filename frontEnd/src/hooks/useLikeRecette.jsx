// src/hooks/useLikeRecette.js
import { useContext } from 'react';
import { LikeRecetteContext } from '../contexts/LikeRecetteProvider';

const useLikeRecette = () => useContext(LikeRecetteContext);

export default useLikeRecette;

