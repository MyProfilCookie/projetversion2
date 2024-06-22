/* eslint-disable no-unused-vars */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { FaTrashAlt, FaUsers, FaUserAltSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingScreen from '../../../components/LoadingScreen';

const Users = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data, refetch, isError, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
  });

  const users = data?.result || [];

  const toggleAdminMutation = useMutation({
    mutationFn: async (user) => {
      const res = await axiosSecure.put(`/users/toggle-admin/${user._id}`);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['users']);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `${variables.username} est maintenant ${data.role === 'admin' ? 'Admin' : 'Utilisateur'} !`,
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Erreur lors du changement de rôle',
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (user) => {
      await axiosSecure.delete(`/users/${user._id}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['users']);
      Swal.fire({
        title: 'Supprimé !',
        text: "L'utilisateur a été supprimé.",
        icon: 'success',
      });
    },
    onError: () => {
      Swal.fire({
        title: 'Erreur !',
        text: "Erreur lors de la suppression de l'utilisateur.",
        icon: 'error',
      });
    },
  });

  const handleToggleAdmin = (user) => {
    toggleAdminMutation.mutate(user);
  };

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas annuler cela !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(user);
      }
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <div>Erreur : {error.message}</div>;
  }

  return (
    <div id="users-container" className="users-container">
      <div className="header flex justify-between mx-4 my-4">
        <h2 className="text-2xl">Tous les utilisateurs</h2>
        <h2 className="text-2xl">
          Total des utilisateurs : {Array.isArray(users) ? users.length : 0}
        </h2>
      </div>

      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="table table-zebra md:w-[870px]">
            <thead className="bg-green-500 text-white">
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id} className={index % 2 === 0 ? 'bg-green-100' : ''}>
                    <th>{index + 1}</th>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role === 'admin' ? 'Admin' : 'Utilisateur'}</td>
                    <td>{user._id.substring(0, 4)}</td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleAdmin(user)}
                          className={`btn btn-xs btn-circle ${user.role === 'admin' ? 'bg-red-500' : 'bg-indigo-500'}`}
                        >
                          {user.role === 'admin' ? <FaUserAltSlash className="text-white" /> : <FaUsers className="text-white" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="btn bg-orange-500 btn-xs"
                        >
                          <FaTrashAlt className="text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">Aucun utilisateur trouvé</td>
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






