import { useState, useEffect } from 'react';
import axios from 'axios';

const useLastRecette = () => {
  const [lastRecetteId, setLastRecetteId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastRecette = async () => {
      try {
        const response = await axios.get('http://localhost:3001/recettes/last');
        setLastRecetteId(response.data.id);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the last recette:', error);
        setLoading(false);
      }
    };

    fetchLastRecette();
  }, []);

  return { lastRecetteId, loading };
};

export default useLastRecette;

