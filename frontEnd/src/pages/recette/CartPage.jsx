/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useTheme } from "../../hooks/ThemeContext";
import { useCart } from "../../contexts/CartProvider";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51PJX1EJ9cNEOCcHhPnKT4sBxvL5xs9aQN7VTmRUabgl4khJ6k7KbYIcjJsHIhesao1lhsj0YYfIAjhn9hvAPxwLw008vby1XDo');

const CartPage = () => {
  const { isDarkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const { cart, updateCart } = useCart();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (Array.isArray(cart)) {
      setCartItems(cart);
    } else {
      setCartItems([]);
    }
  }, [cart]);

  const calculateTotalPrice = (item) => {
    return item.price * item.quantity;
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleIncrease = (item) => {
    const updatedCart = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });
    setCartItems(updatedCart);
    updateCart(updatedCart);
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      const updatedCart = cartItems.map((cartItem) => {
        if (cartItem.id === item.id) {
          return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
        return cartItem;
      });
      setCartItems(updatedCart);
      updateCart(updatedCart);
    }
  };

  const handleQuantityChange = (item, quantity) => {
    if (quantity < 1) {
      return;
    }

    const updatedCart = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, quantity: quantity };
      }
      return cartItem;
    });
    setCartItems(updatedCart);
    updateCart(updatedCart);
  };

  const cartSubtotal = cartItems.reduce((total, item) => {
    return total + calculateTotalPrice(item);
  }, 0);

  const orderTotal = cartSubtotal;

  const handleDelete = (item) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cartItems.filter(cartItem => cartItem.id !== item.id);
        setCartItems(updatedCart);
        updateCart(updatedCart);
        Swal.fire("Supprimé!", "Votre article a été supprimé.", "success");
      }
    });
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl-px-24 px-4">
      <div className={`bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100% ${isDarkMode ? "dark" : ""}`}>
        <div className="py-28 flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-7">
            <h2 className="md-text-5xl text-4xl font-bold md-leading-snug leading-snug">
              Articles ajoutés au<span className="text-green"> Panier</span>
            </h2>
          </div>
        </div>
      </div>
      {cartItems.length > 0 ? (
        <div className="flex flex-col lg-flex-row gap-8">
          <div className="lg-w-3-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex flex-col lg-flex-row items-center border-b border-gray-200 py-4">
                <img className="w-24 h-24 object-cover lg-w-32 lg-h-32" src={item.image} alt={item.name} />
                <div className="flex-grow lg-ml-4 text-center lg-text-left">
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <p className="text-gray-600">Prix: {item.price.toFixed(2)} €</p>
                  <div className="flex items-center justify-center lg-justify-start mt-2">
                    <button
                      className="px-3 py-1 border border-gray-300" 
                      onClick={() => handleDecrease(item)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                      className="w-12 text-center border-t border-b border-gray-300 mx-2"
                      min="1"
                    />
                    <button
                      className="px-3 py-1 border border-gray-300"
                      onClick={() => handleIncrease(item)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="mt-2" style={{backgroundColor: "red", color: "white", padding: "5px 5px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", border: "none"}}
                    onClick={() => handleDelete(item)}
                  >
                    Supprimer
                  </button>
                </div>
                <div className="lg-w-1-6 text-center lg-text-right">
                  <button className="text-lg btn font-semibold">
                    Total: {calculateTotalPrice(item).toFixed(2)} €
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg-w-1-4 p-4 border border-gray-200">
            <h3 className="text-xl font-semibold">Détails de la commande</h3>
            <p>Articles au total: {calculateTotalItems()}</p>
            <p>
              Prix total: <span id="total-price">{orderTotal.toFixed(2)} €</span>
            </p>
            <Elements stripe={stripePromise}>
              <CheckoutForm price={orderTotal} />
            </Elements>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20">
          <p>Le panier est vide. Veuillez ajouter des produits.</p>
          <Link to="/">
            <button className="btn bg-green text-white mt-3">Retour à l'accueil</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;




