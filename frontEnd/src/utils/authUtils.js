/* eslint-disable no-useless-catch */
// authUtils.js

export const baseURL = 'http://localhost:3001';

export const createUser = async (baseURL, email, password, username, setUser, setLoading) => {
  setLoading(true);
  try {
    const response = await fetch(`${baseURL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur lors de l'inscription: ${errorText}`);
    }

    const data = await response.json();
    setUser(data.user);
    localStorage.setItem("access_token", data.token);
    return data;
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);
  }
};

export const login = async (baseURL, email, password, setUser, setLoading, checkIfUserIsAdmin, setIsAdmin) => {
  setLoading(true);
  try {
    const response = await fetch(`${baseURL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur lors de la connexion: ${errorText}`);
    }

    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('access_token', data.token);

    // Check if the user is an admin immediately after login
    await checkIfUserIsAdmin(baseURL, data.user.email, setIsAdmin);

    return data;
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);
  }
};

export const checkIfUserIsAdmin = async (baseURL, email, setIsAdmin) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      const response = await fetch(`${baseURL}/users/admin/${email}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setIsAdmin(false);
        return;
      }

      const data = await response.json();
      setIsAdmin(data.admin);
    } catch (error) {
      setIsAdmin(false);
    }
  }
};
