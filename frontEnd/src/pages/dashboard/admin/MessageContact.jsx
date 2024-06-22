/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MessagesContact = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [adminMessage, setAdminMessage] = useState("");

  // Récupérer les messages de contact
  const { data: messagesResponse = {} } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await axiosSecure.get("/contact", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return response.data;
    },
  });

  // Récupérer les utilisateurs
  const { data: usersResponse = {}, error: usersError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosSecure.get("/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log("Response from /users:", response);
      return response.data;
    },
  });

  if (usersError) {
    console.error("Erreur lors de la récupération des utilisateurs:", usersError);
  }

  const messages = Array.isArray(messagesResponse.messages) ? messagesResponse.messages : [];
  const users = Array.isArray(usersResponse.result) ? usersResponse.result : [];

  // Mutation pour supprimer un message
  const deleteMessageMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosSecure.delete(`/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  // Mutation pour répondre à un message
  const replyMessageMutation = useMutation({
    mutationFn: async ({ id, reply }) => {
      const response = await axiosSecure.post(`/contact/reply/${id}`, { reply }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  // Mutation pour envoyer un message à un utilisateur
  const sendMessageMutation = useMutation({
    mutationFn: async ({ userId, message }) => {
      const response = await axiosSecure.post(`/users/message/${userId}`, { message }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Succès!",
        text: "Message envoyé avec succès!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setSelectedUser("");
      setAdminMessage("");
    },
    onError: () => {
      Swal.fire({
        title: "Erreur!",
        text: "Échec de l'envoi du message",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const handleReply = (id) => {
    if (replyMessage.trim()) {
      replyMessageMutation.mutate({ id, reply: replyMessage });
      setReplyMessage("");
    }
  };

  const handleSendMessage = () => {
    if (selectedUser && adminMessage.trim()) {
      sendMessageMutation.mutate({ userId: selectedUser, message: adminMessage });
    }
  };

  return (
    <div className="admin-messages-container">
      <h2 className="title">
        Gestion des <span className="highlight">messages</span>
      </h2>
      <div className="messages">
        <h3>Messages de contact</h3>
        {messages.map((message) => (
          <div key={message._id} className="message bg-teal-200 p-4 rounded-lg mb-4">
            <h4>{message.subject}</h4>
            <p>{message.message}</p>
            <p><strong>From:</strong> {message.name} ({message.email})</p>
            <button onClick={() => deleteMessageMutation.mutate(message._id)} className="btn-delete">
              Supprimer
            </button>
            <div className="reply-section mt-4">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Votre réponse"
                className="input-reply"
              />
              <button onClick={() => handleReply(message._id)} className="btn-reply">
                Répondre
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="send-message">
        <h3>Envoyer un message à un utilisateur</h3>
        <div className="form-group">
          <label htmlFor="user">Utilisateur</label>
          <select
            id="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="form-control"
          >
            <option value="">Sélectionnez un utilisateur</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="adminMessage">Message</label>
          <textarea
            id="adminMessage"
            value={adminMessage}
            onChange={(e) => setAdminMessage(e.target.value)}
            placeholder="Votre message"
            className="form-control"
          />
        </div>

        <button onClick={handleSendMessage} className="btn-submit">
          Envoyer le message
        </button>
      </div>
    </div>
  );
};

export default MessagesContact;



