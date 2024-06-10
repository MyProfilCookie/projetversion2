import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcVisa } from "@fortawesome/free-brands-svg-icons";
import { FaBook, FaEuroSign, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom"
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

  const { data: stats = {} } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:3001/admin-stats", {
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

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:3001/users", {
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

  console.log("Users:", users);

  const { data: chartData = [] } = useQuery({
    queryKey: ["order-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:3001/order-stats", {
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

  const getFormattedName = (email) => {
    if (!email) return "None";
    const [firstPart] = email.split("@", 1);
    return firstPart.split(".").join(" ");
  };

  console.log("Stats:", stats);
  console.log("Chart Data:", chartData);

  const data = [
    { name: "Revenue", value: stats.revenue, color: "#34D399" },
    { name: "Users", value: stats.users, color: "#F97316" },
    { name: "Recettes", value: stats.recetteItems, color: "#6366F1" },
    { name: "Orders", value: stats.orders, color: "#A855F7" },
  ];

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Bonjour, {getFormattedName(user?.email)}</h2>
      </div>

      <div className="stats">
        <Link to="/dashboard/order" className="stat bg-emerald-200">
          <div className="stat-figure">
            <FaEuroSign />
          </div>
          <div className="stat-title">Revenue</div>
          <div className="stat-value">{stats.revenue} €</div>
          <div className="stat-desc">Jan 1ier - Feb 1ier</div>
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

        <Link to="/dashboard/order" className="stat bg-purple-300">
          <div className="stat-figure">
            <FontAwesomeIcon icon={faCcVisa} />
          </div>
          <div className="stat-title">Orders</div>
          <div className="stat-value">{stats.orders}</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </Link>
      </div>

      <div className="charts">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
