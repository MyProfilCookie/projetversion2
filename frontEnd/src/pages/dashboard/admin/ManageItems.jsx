/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../../contexts/AuthProvider";

const ManageItems = () => {
  const { user } = useContext(AuthContext);
  const [recette, setRecette] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recette.slice(indexOfFirstItem, indexOfLastItem);

  // Fetch recettes
  const fetchRecettes = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Token non trouvé, veuillez vous reconnecter");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/recettes", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des recettes");
      }

      const data = await response.json();
      setRecette(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchRecettes();
  }, []);

  // Supprimer une recette
  const handleDeleteItem = (item) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("access_token");
          if (!token) {
            console.error("Token non trouvé, veuillez vous reconnecter");
            return;
          }

          const response = await fetch(`http://localhost:3001/recettes/${item._id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (!response.ok) {
            throw new Error("Erreur lors de la suppression de la recette");
          }

          setRecette(recette.filter((rec) => rec._id !== item._id));
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${item.titre} a été supprimé`,
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error("Erreur:", error);
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Une erreur est survenue lors de la suppression de la recette.",
          });
        }
      }
    });
  };

  return (
    <div className="manage-items-container w-full md:w-[870px] mx-auto px-4">
      <h2 className="header text-2xl font-semibold my-4">
        Gérer toutes les <span className="text-green">recettes!</span>
      </h2>

      {/* Recettes table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Titre</th>
                <th>Mettre à jour</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar" style={{ borderRadius: "1rem" }}>
                        <div
                          className="mask mask-squircle w-12 h-12"
                          style={{
                            backgroundColor: "#2D3748",
                            borderRadius: "5px",
                          }}
                        >
                          {item.image ? (
                            item.image.startsWith('uploads/') ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                                alt="recette image"
                              />
                            ) : (
                              <img
                                src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                                alt="recette image"
                              />
                            )
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center text-white">
                              No Image
                            </div>
                          )}


                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{item.titre}</td>
                  <td>
                    <Link to={`/dashboard/update-recette/${item._id}`}>
                      <button
                        style={{
                          backgroundColor: "green",
                          borderRadius: "5px",
                        }}
                        className="btn btn-ghost btn-xs"
                      >
                        <FaEdit className="text-white"></FaEdit>
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      style={{ backgroundColor: "tomato", borderRadius: "5px" }}
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleDeleteItem(item)}
                    >
                      <FaTrashAlt className="text-white"></FaTrashAlt>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center my-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className=" btn-sm mr-2 btn-warning"
        >
          <FaArrowLeft /> Précédent
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastItem >= recette.length}
          className="btn-sm bg-green text-white"
        >
          Suivant <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ManageItems;


