/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaUserSecret } from "react-icons/fa";
import {
  faGoogle,
  faInstagram,
  faFacebook,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import { useTheme } from "../hooks/ThemeContext";
import ChefPatisserieLogo from "./ChefPatisserieLogo";


function Modal() {
  const { signUpWithGmail, login } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const {isDarkMode} = useTheme();
  const modalRef = useRef(null);

  // Redirection vers la page d'accueil après la connexion
  // const location = useLocation();
  // const navigate = useNavigate();
  // const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const email = data.email;
    const password = data.password;
    try {
      const result = await login(email, password);
      const user = result.user;
      const userInfo = {
        email: result.user?.email,
        name: result.user?.displayName,
      };
      alert("Connexion réussie !");
      // navigate(from, { replace: true });
      closeModal();
      reset();
    } catch (error) {
      console.error(error.message);
      setErrorMessage("Merci de renseigner votre email et mot de passe !");
    }
  };

  const handleRegister = async () => {
    try {
      const result = await signUpWithGmail();
      console.log(result.user);
      const userInfo = {
        email: result.user?.email,
        name: result.user?.displayName,
      };
      const response = await fetch("/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription");
      }
      const responseData = await response.json();
      console.log(responseData);
      navigate("/");
      closeModal();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div>
      <button onClick={openModal} className={`${isDarkMode ? "bgDark inverti" : "PrimaryBG"}`} style={{height: "3rem", width: "3rem", borderRadius: "50%", marginRight: "1rem", border: "none", cursor: "pointer", backgroundColor: "transparent"}}>
        
        <ChefPatisserieLogo {...{ isDarkMode }} />
      </button>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <div className="modal-box">
              <div className="modal-action flex flex-col justify-center mt-0 relative">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="card-body"
                  method="dialog"
                >
                  <h3 className="font-bold flex justify-center align-center">
                    <img src="/logo.svg" alt="logo" className="w-14" />
                    Se connecter
                  </h3>
                  <button
                    onClick={closeModal}
                    className="bton cursor-pointer hover-scale-110 buton-circle absolute top-0 right-0"
                  >
                    x
                  </button>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="email"
                      className="input input-bordered"
                      required
                      {...register("email", { required: true })}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Mot de passe</span>
                    </label>
                    <input
                      type="password"
                      placeholder="mot de passe"
                      className="input input-bordered"
                      required
                      {...register("password", { required: true })}
                    />
                    <label className="label mt-2">
                      <a href="#" className="label-text-alt link link-hover">
                        Mot de passe oublié ?
                      </a>
                    </label>
                  </div>
                  {errorMessage && (
                    <span className="error text-red font-bold">
                      {errorMessage}
                    </span>
                  )}
                  <div className="form-control mt-6">
                    <input
                      type="submit"
                      value="Se connecter"
                      className="btn btn-primary mx-auto"
                    />
                  </div>
                  <div className="form-control mx-auto">
                    <p className="text-center">
                      Vous n’avez pas de compte ?{" "}
                      <Link
                        to="/register"
                        className="underline text-red font-bold mt-2"
                      >
                        S’inscrire
                      </Link>
                    </p>
                  </div>
                </form>
                <div className="flex justify-center">
                  <button
                    className="butn btn-circle bton-outline-google hover-scale-110 mx-1"
                    onClick={handleRegister}
                  >
                    <FontAwesomeIcon icon={faGoogle} size="2xl" />
                  </button>
                  <button className="butn btn-circle bton-outline-instagram hover-scale-110 mx-1">
                    <FontAwesomeIcon icon={faInstagram} size="2xl" />
                  </button>
                  <button className="butn btn-circle bton-outline-facebook hover-scale-110 mx-1">
                    <FontAwesomeIcon icon={faFacebook} size="2xl" />
                  </button>
                  <button className="butn btn-circle bton-outline-tiktok hover-scale-110 mx-1">
                    <FontAwesomeIcon icon={faTiktok} size="2xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;







