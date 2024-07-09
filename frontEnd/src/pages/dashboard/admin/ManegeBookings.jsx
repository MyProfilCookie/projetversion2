/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaTrashAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingScreen from "../../../components/LoadingScreen";
import useAuth from "../../../hooks/useAuth";

const ManegeBooking = () => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("access_token");

  const { refetch, data: orders = [], isError, isLoading, error } = useQuery({
    queryKey: ["orders", user?.email],
    enabled: !loading,
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/payments/all`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    },
  });

  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const items_Per_Page = 10;
  const indexOfLastItem = currentPage * items_Per_Page;
  const indexOfFirstItem = indexOfLastItem - items_Per_Page;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteItem = async (item) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas annuler cela!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/payments/${item._id}`);
          Swal.fire("Supprimé!", "Votre réservation a été supprimée.", "success");
          refetch();
        } catch (error) {
          Swal.fire(
            "Erreur!",
            "Il y a eu un problème lors de la suppression de votre réservation.",
            "error"
          );
        }
      }
    });
  };

  const confiremedOrder = async (item) => {
    await axiosSecure.patch(`/payments/${item._id}`).then((res) => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Commande confirmée!`,
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <div>Erreur : {error.message}</div>;
  }

  return (
    <div className="manage-booking-container w-full md:w-[870px] mx-auto px-4">
      <h2 className="header text-2xl font-semibold my-4">
        Gestion des <span className="text-green">commandes!</span>
      </h2>

      <div className="table-container">
        <div className="overflow-x-auto lg-overflow-x-visible">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Utilisateur</th>
                <th>ID de Transaction</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Confirmation de paiement</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.email}</td>
                  <td>{item._id ? item._id.substring(0, 8) : "N/A"}</td>
                  <td>{item.price}€</td>
                  <td>{item.status}</td>
                  <td className="text-center">
                    {item.status === "confirmed" ? (
                      "terminé"
                    ) : (
                      <button
                        className="btn bg-green text-white btn-xs text-center"
                        onClick={() => confiremedOrder(item)}
                      >
                        <GiConfirmed />
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="btn btn-ghost btn-xs"
                    >
                      <FaTrashAlt className="text-red"></FaTrashAlt>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination-container flex justify-center my-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-sm mr-2 btn-warning"
        >
          <FaArrowLeft /> Précédent
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastItem >= orders.length}
          className="btn btn-sm bg-green text-white"
        >
          Suivant <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ManegeBooking;



