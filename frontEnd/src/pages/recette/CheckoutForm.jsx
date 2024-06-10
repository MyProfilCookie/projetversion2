/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FaPaypal } from "react-icons/fa";
import { useTheme } from "../../hooks/ThemeContext";
import useAuth from "../../hooks/useAuth";
import { useCart } from "../../contexts/CartProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CheckoutForm = ({ price }) => {
  const { isDarkMode } = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [paypalUrl, setPaypalUrl] = useState("");

  const { user } = useAuth();
  const { cart } = useCart();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof price !== "number" || price < 1) {
      console.error(
        "Valeur de prix invalide. Doit être un nombre supérieur ou égal à 1."
      );
      return;
    }

    axiosSecure
      .post("/api/create-payment-intent", { price })
      .then((res) => {
        console.log("Intention de paiement créée:", res.data);
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error(
          "Erreur lors de la création de l'intention de paiement:",
          err
        );
      });

    axiosSecure
      .post("/api/create-paypal-transaction", { price })
      .then((res) => {
        console.log("Transaction PayPal créée:", res.data);
        setPaypalUrl(
          `https://www.sandbox.paypal.com/checkoutnow?token=${res.data.orderID}`
        );
      })
      .catch((err) => {
        console.error(
          "Erreur lors de la création de la transaction PayPal:",
          err
        );
      });
  }, [price, axiosSecure]);

  const getFormattedName = (email) => {
    if (!email) return "anonymous";
    const [firstPart] = email.split("@");
    return firstPart.split(".").join(" ");
  };

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
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      console.error("Erreur lors de la création du moyen de paiement:", error);
    } else {
      setCardError("");
      console.log("Moyen de paiement créé:", paymentMethod);
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: getFormattedName(user?.email),
            email: user?.email || "unknown",
          },
        },
      });

    if (confirmError) {
      console.error(
        "Erreur lors de la confirmation du paiement:",
        confirmError
      );
      setCardError(confirmError.message);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const transactionId = paymentIntent.id;
      setCardError(`Votre identifiant de transaction est: ${transactionId}`);

      const paymentInfo = {
        email: user.email,
        transactionId: paymentIntent.id,
        price,
        quantity: cart.reduce((total, item) => total + item.quantity, 0),
        status: "order pending",
        itemsName: cart.map((item) => item.name),
        cartItems: cart.map((item) => item._id),
        menuItems: cart.map((item) => item.menuItemId),
      };

      console.log("Informations de paiement à envoyer:", paymentInfo);

      axiosSecure
        .post("/api/payments", paymentInfo)
        .then((res) => {
          console.log("Informations de paiement envoyées:", res.data);
          if (res.data) {
            alert("Informations de paiement envoyées avec succès !");
            navigate("/order");
          }
        })
        .catch((err) => {
          console.error(
            "Erreur lors de l'envoi des informations de paiement:",
            err
          );
        });
    }
  };

  return (
    <div className="flex flex-col sm-flex-row justify-center items-center gap-8">
      <div className="md:w-1/2 space-y-3">
        <h4 className="text-lg font-semibold">Résumé de la commande</h4>
        <p>Prix total: {price} €</p>
        <p>
          Nombre d'articles:{" "}
          {cart.reduce((total, item) => total + item.quantity, 0)}
        </p>
      </div>
      <div
        className={`md:w-1/3 w-full border space-y-5 card-shadow shrink-0 max-w-sm shadow-2xl bg-base-100 px-4 py-8 ${isDarkMode ? "dark" : "primaryBG"
          }`}
      >
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
            className="btn btn-sm bg-green-500 text-white mt-5"
          >
            Payer
          </button>
        </form>
        {cardError && (
          <p className="text-white text-xs italic">{cardError}</p>
        )}

        <div className="mt-5 text-center">
          <hr />
          <a
            href={paypalUrl}
            className="btn btn-sm mt-5 bg-orange-500 text-white"
          >
            <FaPaypal /> Payer avec Paypal
          </a>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
