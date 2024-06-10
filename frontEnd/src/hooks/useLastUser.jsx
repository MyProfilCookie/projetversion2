import { useState, useEffect } from 'react';
import axios from 'axios';

const useLastUser = () => {
  const [lastUser, setLastUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users/last-one');
        setLastUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the last user:', error);
        setLoading(false);
      }
    };

    fetchLastUser();
  }, []);

  return { lastUser, loading };
};

export default useLastUser;