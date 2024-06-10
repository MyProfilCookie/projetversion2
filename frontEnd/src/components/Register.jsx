/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthProvider";

function Register() {
  const { signUpWithGmail } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/login";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password, username } = data;
    console.log("Envoi des données:", { email, password, username });

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription");
      }

      const responseData = await response.json();
      console.log("Données de réponse:", responseData);
      Swal.fire("Succès", "Inscription réussie !", "success");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Erreur:", error);
      Swal.fire("Erreur", "L'inscription a échoué !", "error");
    }
  };

  const handleRegister = async () => {
    try {
      const result = await signUpWithGmail();
      console.log("Résultat de la connexion Google:", result.user);
      const userInfo = {
        email: result.user?.email,
        username: result.user?.displayName,
      };
      console.log("Envoi des informations de l'utilisateur Google:", userInfo);

      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription avec Google");
      }

      const responseData = await response.json();
      console.log("Données de réponse:", responseData);
      navigate('/');
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="mb-5">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Veuillez créer un compte !</h3>
          {/* username */}
          <div className="form-control">
            <label className="label" htmlFor="username">
              <span className="label-text">Nom d'utilisateur</span>
            </label>
            <input
              type="text"
              id="username"
              placeholder="Votre nom d'utilisateur"
              className="input input-bordered"
              {...register("username", { required: true })}
            />
            {errors.username && <span className="text-red-500">Nom d'utilisateur requis</span>}
          </div>

          {/* email */}
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="input input-bordered"
              {...register("email", { required: true })}
            />
            {errors.email && <span className="text-red-500">Email requis</span>}
          </div>

          {/* password */}
          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text">Mot de passe</span>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Mot de passe"
              className="input input-bordered"
              {...register("password", { required: true })}
            />
            {errors.password && <span className="text-red-500">Mot de passe requis</span>}
            <label className="label">
              <a href="#" className="label-text-alt link link-hover mt-2">
                Mot de passe oublié ?
              </a>
            </label>
          </div>

          {/* message d'erreur */}
          {errors.message && <p className="text-red-500">{errors.message}</p>}

          {/* bouton de soumission */}
          <div className="form-control mt-6">
            <input
              type="submit"
              className="btn bg-green text-white"
              value="S'inscrire"
            />
          </div>

          <div className="text-center my-2">
            Vous avez déjà un compte ?
            <Link to="/login">
              <button className="ml-2 underline">Connectez-vous ici</button>
            </Link>
          </div>
        </form>
        <div className="text-center space-x-3">
          <button
            onClick={handleRegister}
            className="btn btn-circle hover:bg-green hover:text-white"
          >
            <FaGoogle />
          </button>
          <button className="btn btn-circle hover:bg-green hover:text-white">
            <FaFacebookF />
          </button>
          <button className="btn btn-circle hover:bg-green hover:text-white">
            <FaGithub />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;

