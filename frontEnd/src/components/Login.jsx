/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import CustomNavbar from "../components/CustomNavbar";

const Login = () => {
  const { login, resetPassword } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      alert("Login successful!");
      navigate(from, { replace: true });
      reset();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handlePasswordReset = async () => {
    const email = prompt("Veuillez entrer votre email pour réinitialiser le mot de passe:");
    if (email) {
      try {
        await resetPassword(email);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div>
      <CustomNavbar />
      <div className="login-container">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <h3 className="font-bold text-lg">Merci de vous connecter</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="email" className="input input-bordered" {...register("email", { required: true })} />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" placeholder="password" className="input input-bordered" {...register("password", { required: true })} />
              <label className="label">
                <span className="label-text-alt link link-hover mt-2" onClick={handlePasswordReset}>
                  Mot de passe oublié ?
                </span>
              </label>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="form-control mt-4">
              <input type="submit" className="submit-btn" value="Login" />
            </div>
            <div className="register-link">
              Vous n'avez pas de compte ? <Link to="/register" className="underline">S'enregistrer</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
