/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const UpdateRecette = () => {
  const item = useLoaderData();
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/';
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setValue("titre", item.titre);
    setValue("description", item.description);
    setValue("ingredients", item.ingredients.join(", "));
    setValue("instructions", item.instructions.join(", "));
    setValue("temps_preparation", item.temps_preparation);
    setValue("temps_cuisson", item.temps_cuisson);
    setValue("difficulte", item.difficulte);
    setValue("category", item.category);
    setImagePreview(`${API_URL}/${item.image}`);
  }, [item, setValue, API_URL]);

  const watchImage = watch("image");

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    formData.append("titre", data.titre);
    formData.append("description", data.description);
    formData.append("ingredients", data.ingredients);
    formData.append("instructions", data.instructions);
    formData.append("temps_preparation", data.temps_preparation);
    formData.append("temps_cuisson", data.temps_cuisson);
    formData.append("difficulte", data.difficulte);
    formData.append("category", data.category);

    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const res = await axiosSecure.patch(`/recettes/${item._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Response from server:", res);
      if (res.data) {
        reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Votre recette a été mise à jour",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/manage-items");
      }
    } catch (err) {
      console.error("Erreur: ", err);
      console.log("Error response: ", err.response);
      const errorMessage = err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour de la recette.';
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="update-recette-container">
      <h2 className="title">
        Mettre à jour la <span className="highlight">recette</span>
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="form-group">
          <label htmlFor="titre">Titre</label>
          <input
            {...register("titre")}
            id="titre"
            type="text"
            placeholder="Titre de la recette"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            {...register("description")}
            id="description"
            placeholder="Description de la recette"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ingredients">Ingrédients</label>
          <textarea
            {...register("ingredients")}
            id="ingredients"
            placeholder="Ingrédients (séparés par une virgule)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            {...register("instructions")}
            id="instructions"
            placeholder="Instructions (séparées par une virgule)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="temps_preparation">Temps de préparation</label>
          <input
            {...register("temps_preparation")}
            id="temps_preparation"
            type="text"
            placeholder="Temps de préparation"
          />
        </div>
        <div className="form-group">
          <label htmlFor="temps_cuisson">Temps de cuisson</label>
          <input
            {...register("temps_cuisson")}
            id="temps_cuisson"
            type="text"
            placeholder="Temps de cuisson"
          />
        </div>
        <div className="form-group">
          <label htmlFor="difficulte">Difficulté</label>
          <select {...register("difficulte")} id="difficulte">
            <option value="facile">Facile</option>
            <option value="moyenne">Moyenne</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select {...register("category")} id="category">
            <option value="Chocolat">Chocolat</option>
            <option value="Gourmandises">Gourmandises</option>
            <option value="Pains et viennoiserie">Pains et viennoiserie</option>
            <option value="Fruits">Fruits</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image (fichier)</label>
          <input {...register("image")} id="image" type="file" />
        </div>
        {imagePreview && (
          <div className="form-group">
            <label>Prévisualisation de l'image</label>
            <img
              src={imagePreview}
              alt="Prévisualisation"
              style={{ width: "200px" }}
            />
          </div>
        )}
        {item.image && !imagePreview && (
          <div className="form-group">
            <label>Image actuelle</label>
            <img
              src={`${API_URL}/${item.image}`}
              alt="Recette"
              style={{ width: "200px" }}
            />
          </div>
        )}
        <div className="form-group">
          <button type="submit" className="btn-submit">
            Mettre à jour
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRecette;








