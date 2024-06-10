/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import { useForm } from "react-hook-form";

const UserProfile = () => {
  const { updateUserProfile } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const { name, username, email, photoURL } = data;
    
    updateUserProfile(name, username, email, photoURL[0])
      .then(() => {
        alert("Profil mis à jour avec succès");
      })
      .catch((error) => {
        // Une erreur s'est produite
        console.error(error);
      });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nom</span>
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Votre nom"
              className="input input-bordered"
            />
            {errors.name && <span className="error-text">Ce champ est obligatoire</span>}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nom d'utilisateur</span>
            </label>
            <input
              type="text"
              {...register("username", { required: true })}
              placeholder="Votre nom d'utilisateur"
              className="input input-bordered"
            />
            {errors.username && <span className="error-text">Ce champ est obligatoire</span>}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Votre email"
              className="input input-bordered"
            />
            {errors.email && <span className="error-text">Ce champ est obligatoire</span>}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Télécharger une photo</span>
            </label>
            <input
              type="file"
              {...register("photoURL")}
              className="file-input"
            />
          </div>
          <div className="form-control mt-6">
            <input
              type="submit"
              value="Mettre à jour"
              className="btn bg-green text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
