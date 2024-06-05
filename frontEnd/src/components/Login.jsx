/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Login = () => {
  const axiosPublic = useAxiosPublic();
  const [errorMessage, seterrorMessage] = useState("");
  const { signUpWithGmail, login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  //react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;
    login(email, password)
      .then((result) => {
        // Signed in
        const user = result.user;

        const userInfo = {
          email: result.user?.email,
          username: result.user?.displayName,
        };
        axiosPublic.post("/users", userInfo).then((res) => {
          console.log(res.data);
          navigate("/");
        });
        // console.log(user);
        alert("Login successful!");
        navigate("/");
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        seterrorMessage("Error: " + errorMessage);
      });
    reset();
  };

  // login with google
  const handleRegister = () => {
    signUpWithGmail().then((result) => {
      console.log(result.user);
      const userInfo = {
        email: result.user?.email,
        username: result.user?.displayName,
      };
      axiosPublic.post("/users", userInfo).then((res) => {
        console.log(res.data);
        alert("Login successful!");
      });
      navigate("/");
    });
  };
  return (
    <div className="max-w-md shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="mb-5">
        <form
          className="card-body"
          method="dialog"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="font-bold text-lg">Merci de vous connecter</h3>

          {/* email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              {...register("email")}
            />
          </div>

          {/* password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              {...register("password", { required: true })}
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover mt-2">
                Mot de passe oublie ?
              </a>
            </label>
          </div>

          {/* show errors */}
          {errorMessage ? (
            <p className="text-red text-xs italic">
              Merci verifier votre email et mot de passe
            </p>
          ) : (
            ""
          )}

          {/* submit btn */}
          <div className="form-control mt-4">
            <input
              type="submit"
              className="btn bg-green text-white"
              value="Login"
              style={{
                width: "100%",
                height: "40px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                backdropFilter: "blur(2px)",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              }}
            />
          </div>

          <p className="text-center my-2">
            Vous n'avez pas de compte ?{" "}
            <Link to="/register" className="underline text-red ml-1">
              S'enregistrer
            </Link>
          </p>
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
};

export default Login;
