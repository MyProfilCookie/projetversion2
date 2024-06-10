/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaTrashAlt, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Users = () => {
  const axiosSecure = useAxiosSecure();
  const { data, refetch, isError, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      console.log("API Response:", res.data); 
      return res.data;
    },
  });

  const users = data?.result || [];

  console.log("Users:", users); 

  const handleMakeAdmin = (user) => {
    axiosSecure.patch(`/users/admin/${user.id}`).then((res) => {
      console.log(res.data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${user.name} est maintenant Admin !`,
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    });
  };

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas annuler cela !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le !",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`).then((res) => {
          console.log(res);
          Swal.fire({
            title: "Supprimé !",
            text: "L'utilisateur a été supprimé.",
            icon: "success",
          });
          refetch();
        });
      }
    });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError) {
    return <div>Erreur : {error.message}</div>;
  }

  return (
    <div id="users-container">
      <div className="header flex justify-between mx-4 my-4">
        <h2 className="text-2xl">Tous les utilisateurs</h2>
        <h2 className="text-2xl">
          Total des utilisateurs : {Array.isArray(users) ? users.length : 0}
        </h2>
      </div>

      {/* table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="table table-zebra md:w-[870px]">
            {/* head */}
            <thead className="bg-green text-white">
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <th>{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === "admin" ? (
                        "Admin"
                      ) : (
                        <button
                          onClick={() => handleMakeAdmin(user)}
                          className="btn btn-xs btn-circle bg-indigo-500"
                        >
                          <FaUsers className="text-white"></FaUsers>
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="btn bg-orange-500 btn-xs"
                      >
                        <FaTrashAlt className="text-white" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
