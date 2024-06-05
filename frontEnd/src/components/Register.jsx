/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faInstagram,
  faFacebook,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faHouseUser } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Modal from "./Modal";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { createUser, signUpWithGmail, updateUserProfile } =
    useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    const { email, password, username } = data;
    createUser(email, password, username)
      .then((result) => {
        updateUserProfile(username)
          .then(() => {
            const userInfo = {
              username,
              email,
            };

            axiosPublic.post("/users", userInfo).then((response) => {
              console.log(response);
              alert("Signup successful!");
              navigate(from, { replace: true });
            });
          })
          .catch((error) => {
            console.error(error.message);
          });
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const handleRegister = () => {
    signUpWithGmail().then((result) => {
      const userInfo = {
        email: result.user?.email,
        username: result.user?.displayName,
      };
      axiosPublic.post("/users", userInfo).then((res) => {
        navigate("/");
      });
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-box relative">
            <button
              className="btn cursor-pointer hover-scale-110 button-circle absolute top-2 right-2"
              onClick={closeModal}
            >
              <Link to="/">X</Link>
            </button>
            <h2 className="font-bold mb-10 text-center text-3xl">
              Inscription
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="card-body">
              <div className="form-control">
                <label htmlFor="username" className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  id="username"
                  className="input input-bordered"
                  {...register("username", { required: true })}
                />
                {errors.username && (
                  <span className="error">Ce champ est requis.</span>
                )}
              </div>
              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="input input-bordered"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="error">Ce champ est requis.</span>
                )}
              </div>
              <div className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text">Mot de passe</span>
                </label>
                <input
                  type="password"
                  id="password"
                  className="input input-bordered"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <span className="error">Ce champ est requis.</span>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                S’inscrire
              </button>
            </form>
            <p>Vous avez déjà un compte ?</p>
            <div className="flex justify-center mb-10">
              <Modal />
              <button className="btn-primary-login rounded-full button-modal link">
                <Link to="/">
                  <FontAwesomeIcon icon={faHouseUser} className="text-white" />
                </Link>
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleRegister}
                className="btn btn-circle btn-outline-google hover-scale-110 mx-1"
              >
                <FontAwesomeIcon icon={faGoogle} size="2xl" />
              </button>
              <button className="btn btn-circle btn-outline-instagram hover-scale-110 mx-1">
                <FontAwesomeIcon icon={faInstagram} size="2xl" />
              </button>
              <button className="btn btn-circle btn-outline-facebook hover-scale-110 mx-1">
                <FontAwesomeIcon icon={faFacebook} size="2xl" />
              </button>
              <button className="btn btn-circle btn-outline-tiktok hover-scale-110 mx-1">
                <FontAwesomeIcon icon={faTiktok} size="2xl" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
