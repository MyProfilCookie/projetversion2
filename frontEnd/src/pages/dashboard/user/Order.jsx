/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import LoadingScreen from "../../../components/LoadingScreen";

const Order = () => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("access_token");

  const { refetch, data: orders = [], isError, isLoading, error } = useQuery({
    queryKey: ["orders"],
    enabled: !loading && !!token,
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/all`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('La réponse du réseau n\'était pas correcte');
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error('Le format des données n\'est pas un tableau');
      }

      return data;
    },
  });

  const formatDate = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    return createdAtDate.toLocaleDateString();
  };

  const handleContact = (email) => {
    const mailtoLink = `mailto:${email}?subject=Regarding your order&body=Hello, I have a question about my order.`;
    window.location.href = mailtoLink;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <div>Erreur : {error.message}</div>;
  }

  // Trier les commandes par email
  const sortedOrders = orders.sort((a, b) => a.email.localeCompare(b.email));

  return (
    <div className="containers mx-auto xl:px-24 px-4">
      <div className="headers">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Suivez toutes vos<span className="text-green"> commandes</span>
            </h2>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="table text-center">
          <thead className="bg-green text-white rounded-sm">
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Date de commande</th>
              <th>ID de transaction</th>
              <th>Prix</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-green-100" : ""}>
                <td>{index + 1}</td>
                <td>{item.email}</td>
                <td>{formatDate(item.createdAt)}</td>
                <td className="font-medium">{item._id}</td>
                <td>{item.price} €</td>
                <td>{item.status}</td>
                <td>
                  <button
                    className="btn btn-sm border-none text-orange-400 bg-transparent"
                    onClick={() => handleContact(item.email)}
                  >
                    Contacter
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;


