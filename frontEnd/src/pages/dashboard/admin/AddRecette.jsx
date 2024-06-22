/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddRecette = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("titre", data.titre);
    formData.append("description", data.description);
    formData.append("ingredients", data.ingredients);
    formData.append("instructions", data.instructions);
    formData.append("temps_preparation", data.temps_preparation);
    formData.append("temps_cuisson", data.temps_cuisson);
    formData.append("difficulte", data.difficulte);
    formData.append("category", data.category);
    formData.append("image", data.image[0]);

    try {
      const response = await axiosSecure.post("/recettes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      Swal.fire({
        title: "Succès!",
        text: "Recette ajoutée avec succès!",
        icon: "success",
        confirmButtonText: "OK",
      });
      reset();
      navigate("/"); 
    } catch (error) {
      console.error("Error adding recette:", error);
      Swal.fire({
        title: "Erreur!",
        text: "Échec de l'ajout de la recette",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="add-recette-container">
      <h2 className="title">
        Ajouter une nouvelle <span className="highlight">recette</span>
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="form-group">
          <label htmlFor="titre">Titre</label>
          <input
            {...register("titre", {
              required: true,
              minLength: 5,
              maxLength: 100,
            })}
            id="titre"
            type="text"
            placeholder="Titre"
          />
          {errors.titre && (
            <span className="error">
              Ce champ est requis (5-100 caractères).
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            {...register("description", {
              required: true,
              minLength: 5,
              maxLength: 200,
            })}
            id="description"
            placeholder="Description"
          />
          {errors.description && (
            <span className="error">
              Ce champ est requis (5-200 caractères).
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingrédients</label>
          <textarea
            {...register("ingredients", {
              required: true,
              minLength: 5,
              maxLength: 200,
            })}
            id="ingredients"
            placeholder="Ingrédients (séparés par une virgule)"
          />
          {errors.ingredients && (
            <span className="error">
              Ce champ est requis (5-200 caractères).
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            {...register("instructions", {
              required: true,
              minLength: 5,
              maxLength: 200,
            })}
            id="instructions"
            placeholder="Instructions (séparées par une virgule)"
          />
          {errors.instructions && (
            <span className="error">
              Ce champ est requis (5-200 caractères).
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="temps_preparation">Temps de préparation</label>
          <input
            {...register("temps_preparation", {
              required: true,
              minLength: 1,
              maxLength: 100,
            })}
            id="temps_preparation"
            type="text"
            placeholder="Temps de préparation"
          />
          {errors.temps_preparation && (
            <span className="error">
              Ce champ est requis (1-100 caractères).
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="temps_cuisson">Temps de cuisson</label>
          <input
            {...register("temps_cuisson", {
              required: true,
              minLength: 1,
              maxLength: 100,
            })}
            id="temps_cuisson"
            type="text"
            placeholder="Temps de cuisson"
          />
          {errors.temps_cuisson && (
            <span className="error">
              Ce champ est requis (1-100 caractères).
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="difficulte">Difficulté</label>
          <select
            {...register("difficulte", { required: true })}
            id="difficulte"
          >
            <option value="facile">Facile</option>
            <option value="moyenne">Moyenne</option>
            <option value="difficile">Difficile</option>
          </select>
          {errors.difficulte && (
            <span className="error">Ce champ est requis.</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select {...register("category", { required: true })} id="category">
            <option value="Chocolat">Chocolat</option>
            <option value="Gourmandises">Gourmandises</option>
            <option value="Pains et viennoiserie">Pains et viennoiserie</option>
            <option value="Fruits">Fruits</option>
          </select>
          {errors.category && (
            <span className="error">Ce champ est requis.</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image">Image (fichier)</label>
          <input {...register("image")} id="image" type="file" />
        </div>

        <button type="submit" className="btn-submit">
          Ajouter la recette
        </button>
      </form>
    </div>
  );
};

export default AddRecette;
