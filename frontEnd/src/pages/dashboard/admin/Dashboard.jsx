/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcVisa } from "@fortawesome/free-brands-svg-icons";
import { FaBook, FaEuroSign, FaUsers, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [replyMessage, setReplyMessage] = useState("");

  const { data: stats = {} } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/admin-stats", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const { data: messagesResponse = {} } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/contact", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const messages = Array.isArray(messagesResponse.messages) ? messagesResponse.messages : [];

  const deleteMessageMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const replyMessageMutation = useMutation({
    mutationFn: async ({ id, reply }) => {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/contact/reply/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reply }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const handleReply = (id) => {
    if (replyMessage.trim()) {
      replyMessageMutation.mutate({ id, reply: replyMessage });
      setReplyMessage("");
    }
  };

  const getFormattedName = (email) => {
    if (!email) return "None";
    const [firstPart] = email.split("@", 1);
    return firstPart.split(".").join(" ");
  };

  const data = [
    { name: "Revenue", value: stats.revenue, color: "#34D399" },
    { name: "Users", value: stats.users, color: "#F97316" },
    { name: "Recettes", value: stats.recetteItems, color: "#6366F1" },
    { name: "Orders", value: stats.orders, color: "#A855F7" },
    { name: "Messages", value: messages.length, color: "#D63384" },
  ];

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Bonjour, {getFormattedName(user?.email)}</h2>
      </div>

      <div className="stats">
        <Link to="/" className="stat bg-emerald-200">
          <div className="stat-figure">
            <FaEuroSign />
          </div>
          <div className="stat-title">Revenue</div>
          <div className="stat-value">{stats.revenue} €</div>
          <div className="stat-desc">Jan 1ier - Fev 1ier</div>
        </Link>

        <Link to="/dashboard/users" className="stat bg-orange-200">
          <div className="stat-figure">
            <FaUsers />
          </div>
          <div className="stat-title">Users</div>
          <div className="stat-value">{stats.users}</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </Link>

        <Link to="/dashboard/manage-items" className="stat bg-indigo-400">
          <div className="stat-figure">
            <FaBook />
          </div>
          <div className="stat-title">Recettes</div>
          <div className="stat-value">{stats.recetteItems}</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </Link>

        <Link to="/order" className="stat bg-purple-300">
          <div className="stat-figure">
            <FontAwesomeIcon icon={faCcVisa} />
          </div>
          <div className="stat-title">Orders</div>
          <div className="stat-value">{stats.orders}</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </Link>

        <Link to="/dashboard/messages" className="stat bg-teal-300">
          <div className="stat-figure">
            <FaEnvelope />
          </div>
          <div className="stat-title">Messages</div>
          <div className="stat-value">{messages.length}</div>
          <div className="stat-desc">Total des messages</div>
        </Link>
      </div>

      <div className="charts">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#fff"> {/* Remplit les barres en blanc */}
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* <div className="messages">
        <h3>Messages</h3>
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
      </div> */}
    </div>
  );
};

export default Dashboard;



