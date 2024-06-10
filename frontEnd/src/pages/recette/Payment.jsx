/* eslint-disable no-unused-vars */
import { Elements } from "@stripe/react-stripe-js";
import React from "react";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import useCart from "../../hooks/useCart";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const [cart] = useCart();

  // On verifie si le panier est un tableau
  const isCartArray = Array.isArray(cart);

  // Calcul du prix total du panier cart.reduce ((sum, item) => sum + item.price, 0) signifie que sum est la somme de tous les prix des items du panier
  const cartTotal = isCartArray ? cart.reduce((sum, item) => sum + item.price, 0) : 0;
  const totalPrice = parseFloat(cartTotal.toFixed(2));

  return (
    <div className="max-w-screen-2xl container mx-auto xl-px-24 px-4 py-28  items-center">
      <Elements stripe={stripePromise}>
        <CheckoutForm price={totalPrice} cart={isCartArray ? cart : []} />
      </Elements>
    </div>
  );
};

export default Payment;

