import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const useCart = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    if (!user || !user.email) {
      throw new Error('User email is required to fetch the cart.');
    }

    const response = await fetch(`http://localhost:3001/carts?email=${user.email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch cart: ${errorText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('The fetched cart data is not an array.');
    }

    return data;
  };

  const { refetch, data: cart = [], error, isError, isLoading } = useQuery({
    queryKey: ["carts", user?.email],
    queryFn: fetchCart,
    enabled: !!user?.email, // on charge la page seulement si l'utilisateur est connecté
  });

  if (isLoading) {
    return { cart: [], refetch, isLoading };
  }

  if (isError) {
    console.error('Error fetching cart:', error);
    return { cart: [], refetch, isError, error };
  }

  return { cart, refetch, isLoading, isError, error };
};

export default useCart;

