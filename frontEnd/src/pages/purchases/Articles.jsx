/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useCart } from "../../contexts/CartProvider";
import Swal from 'sweetalert2';
import BackButton from '../../components/BackButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";

function Articles() {
    const { addToCart, cart } = useCart();
    const [cartPosition, setCartPosition] = useState(0); // Utilisation de state pour stocker la position du produit dans le panier
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
            name: "Moule à tarte",
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
        },
    ];

    const handleAddToCart = (item) => {
        addToCart(item);
        Swal.fire({
            title: 'Ajouté au panier',
            text: `L'article ${item.name} a été ajouté au panier.`,
            icon: 'success',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.pageYOffset;
            setCartPosition(scrollPosition);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <div className="section-container my-20 relative">
            <BackButton /> {/* Ajout du bouton de retour */}
            <div className="text-center">
                <h2 className="text-4xl md-text-5xl font-bold my-2 md-leading-snug leading-snug md-w-96 md-mx-auto ">
                    Tous nos articles
                </h2>
            </div>
            <div className="gap-4 items-center mt-12 mobile-grid2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="shadow-lg rounded-md w-96 media-w-96 media-w-64 bg-chocolat-blanc rounded-md mx-auto text-center cursor-pointer mb-10"
                    >
                        <div className="media-w-96 media-w-64 w-96 mx-auto mb-3">
                            <img
                                className="media-w-96 media-w-64 w-96"
                                src={item.image}
                                alt={item.name}
                                style={{ borderRadius: "10px 10px 0 0" }}
                            />
                        </div>
                        <div className="mt-5 space-y-1 mb-3">
                            <h5 className="text-center font-bold" style={{ fontFamily: "Playfair Display", color: "#0D1321", fontSize: "1.1rem", textTransform: "uppercase" }}>{item.name}</h5>
                            <p className="text-center font-medium" style={{ fontFamily: "Playfair Display", color: "#0D1321", fontSize: "1.1rem", textTransform: "uppercase" }}>Prix: {item.price}€</p>
                            <button
                                // className="btn-facebook font-semibold rounded-full mt-10" 
                                style={{ width: "20%", margin: "0 auto", border: "none", backgroundColor: "#0D1321", color: "white", padding: "10px", borderRadius: "10px", cursor: "pointer" }}
                                onClick={() => handleAddToCart(item)}
                            >
                                <FontAwesomeIcon icon={faBasketShopping} style={{ fontSize: "1.5rem", color: "white" }} />
                            </button>
                        </div>
                    </div>
                ))}
                <div
                    className="fixed top-[80%] right-4 bg-chocolat-blanc rounded-md shadow-lg p-4"
                    style={{ transform: `translateY(-${cartPosition * 0.5}px)` }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <FontAwesomeIcon icon={faBasketShopping} style={{ fontSize: "1.5rem", color: "#0D1321" }} />
                        <span className="text-xl font-bold" style={{ fontFamily: "Playfair Display", color: "#0D1321" }}>
                            {cart.length}
                        </span>
                    </div>
                    <p className="text-sm font-medium" style={{ fontFamily: "Playfair Display", color: "#0D1321" }}>
                        Articles dans le panier
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Articles;



