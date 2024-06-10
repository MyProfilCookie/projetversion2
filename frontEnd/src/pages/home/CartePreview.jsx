/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

function CartePreview() {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(null);

  const items = [
    {
      id: 1,
      name: "Tablier",
      image: "/images/achat/tablier.webp",
      path: "/cart",
      price: 20,
    },
    {
      id: 2,
      name: "Fouet",
      image: "/images/achat/fouet.webp",
      path: "/cart",
      price: 10,
    },
    {
      id: 3,
      name: "Rouleau à pâtisserie",
      image: "/images/achat/rouleau.webp",
      path: "/cart",
      price: 15,
    },
    {
      id: 4,
      name: "Papier",
      image: "/images/achat/papier.webp",
      path: "/cart",
      price: 5,
    }, 
    {
      id: 5,
      name: "Moule de Cake",
      image: "/images/achat/moulecake.webp",
      path: "/cart",
      price: 11,
    },
    {
      id: 6,
      name: "Plat à four",
      image: "/images/achat/plats-a-four.webp",
      path: "/cart",
      price: 14,
    },
    {
      id: 7,
      name: "Moule de Muffin",
      image: "/images/achat/moulemuffin.webp",
      path: "/cart",
      price: 11,
    },
    {
      id: 8,
      name: "Nos stickers",
      image: "/images/achat/sticker.webp",
      path: "/cart",
      price: 2,
    }, 
    {
      id: 9,
      name: "Moule en forme de coeur",
      image: "/images/achat/platcoeur.webp",
      path: "/cart",
      price: 11,
    },
    {
      id: 10,
      name: "Moule à tarte ",
      image: "/images/achat/plat-tarte.webp",
      path: "/cart",
      price: 15,
    },
    {
      id: 11,
      name: "Moule en forme de carre",
      image: "/images/achat/platcarre.webp",
      path: "/cart",
      price: 9,
    },
    {
      id: 12,
      name: "Moule en forme de rond",
      image: "/images/achat/platrond.webp",
      path: "/cart",
      price: 8,
    }
  ];

  const handleAddToCart = (item) => {
    addToCart(item);
    setNotification(`L'article ${item.name} a été ajouté au panier.`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="section-container my-20 relative">
      <div className="text-center">
        <p className="text-red uppercase tracking-wide font-medium text-lg">
          Voici quelques articles
        </p>
        <h2 className="text-4xl md-text-5xl font-bold my-2 md-leading-snug leading-snug md-w-96 md-mx-auto ">
          N'hésitez pas à les reproduire avec nos articles
        </h2>
      </div>
      <div className="gap-4 items-center mt-12 mobile-grid2">
        {items.map((item) => (
          <div
            key={item.id}
            className="shadow-lg rounded-md w-77 media-w-96 media-w-64 bg-white rounded-md mx-auto text-center cursor-pointer mb-10"
          >
            <div className="media-w-96 media-w-64 w-77 mx-auto mb-3">
              <img
                className="media-w-96 media-w-64 w-77"
                src={item.image}
                alt={item.name}
                style={{ borderRadius: "10px 10px 0 0" }}
              />
            </div>
            <div className="mt-5 space-y-1 mb-3">
              <h5 className="text-center font-bold">{item.name}</h5>
              <p className="text-center font-medium">Prix: {item.price}€</p>
              <button
                className="btn-primary font-semibold rounded-full mt-10"
                onClick={() => handleAddToCart(item)}
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/cart"
        className="btn-secondary font-semibold rounded-full mt-10 flex justify-center items-center"
        style={{ width: "30%", margin: "0 auto", backgroundColor: "green", color: "white", padding: "10px" }}
      ><FontAwesomeIcon icon={faCreditCard} style={{ marginRight: "10px" }} />Voir le panier
      </Link>

      {notification && <div className="notifications">{notification}</div>}
    </div>
  );
}

export default CartePreview;
