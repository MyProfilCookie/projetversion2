/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartProvider";

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
        className="btn-secondary font-semibold rounded-full mt-10 flex justify-center"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        Voir le panier
      </Link>

      {notification && <div className="notifications">{notification}</div>}
    </div>
  );
}

export default CartePreview;
