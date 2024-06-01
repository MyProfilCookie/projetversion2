/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FaPaypal } from "react-icons/fa";
import axios from "axios";
import { useTheme } from "../../hooks/ThemeContext";
import useAuth from "../../hooks/useAuth";
import { useCart } from "../../contexts/CartProvider";

const CheckoutForm = ({ price }) => {
  const { isDarkMode } = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState('');
  const [clientSecret, setClientSecret] = useState("");

  const { user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof price !== 'number' || price < 1) {
      console.error('Invalid price value. Must be a number greater than or equal to 1.');
      return;
    }

    axios.post('/api/create-payment-intent', { price }) // Update URL to match your backend server
      .then(res => {
        setClientSecret(res.data.clientSecret);
      })
  }, [price]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setCardError(error.message);
    } else {
      setCardError('');
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.displayName || 'anonymous',
            email: user?.email || 'unknown'
          },
        },
      },
    );

    if (confirmError) {
      console.log(confirmError)
    }

    if (paymentIntent?.status === "succeeded") {
      const transactionId = paymentIntent.id;
      setCardError(`Your transactionId is: ${transactionId}`)

      const paymentInfo = {
        email: user.email,
        transactionId: paymentIntent.id,
        price,
        quantity: cart.reduce((total, item) => total + item.quantity, 0),
        status: "order pending",
        itemsName: cart.map(item => item.name),
        cartItems: cart.map(item => item._id),
        menuItems: cart.map(item => item.menuItemId)
      };

      axios.post('/api/payments', paymentInfo)
        .then(res => {
          if (res.data) {
            alert('Payment info sent successfully!')
            navigate('/order')
          }
        })
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-start items-start gap-8">
      <div className="md:w-1/2 space-y-3">
        <h4 className="text-lg font-semibold">Résumé de la commande</h4>
        <p>Prix total: {price} €</p>
        <p>Nombre d'articles: {cart.reduce((total, item) => total + item.quantity, 0)}</p>
      </div>
      <div className={`md:w-1/3 w-full border space-y-5 card shrink-0 max-w-sm shadow-2xl bg-base-100 px-4 py-8 ${isDarkMode ? 'dark' : ''}`}>
        <h4 className="text-lg font-semibold">Procédez à votre paiement!</h4>
        <h5 className="font-medium">Carte de crédit/débit</h5>
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
          <button
            type="submit"
            disabled={!stripe || !clientSecret}
            className="btn btn-primary btn-sm mt-5 w-full"
          >
            Payer
          </button>
        </form>
        {cardError ? <p className="text-red text-xs italic">{cardError}</p> : ''}

        <div className="mt-5 text-center">
          <hr />
          <button className="btn btn-sm mt-5 bg-orange-500 text-white">
            <FaPaypal /> Payer avec Paypal
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;

