import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Recettes from "../pages/recette/Recettes";
import Register from "../components/Register";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import UserProfil from "../pages/dashboard/user/UserProfile";
import RecetteDetail from "../pages/recette/RecetteDetail";
import Order from "../pages/dashboard/user/Order";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/dashboard/admin/Dashboard";
import Payment from "../pages/recette/Payment";
import Users from "../pages/dashboard/admin/Users";
import Contact from "../components/Contact";
import About from "../components/About";
import RecipeManagement from "../pages/dashboard/user/UserDashboard";
import Gourmandise from "../pages/categories/Gourmandise";
import Chocolat from "../pages/categories/Chocolat";
import PainsViennoiserie from "../pages/categories/PainsViennoiserie";
import Fruits from "../pages/categories/Fruits";
import Erreur404 from "../components/Erreur404";
import Login from "../components/Login";
import CartPage from "../pages/recette/CartPage";
import AddRecette from "../pages/dashboard/admin/AddRecette";
import UpdateRecette from "../pages/dashboard/admin/UpdateRecette";
import ManageItems from "../pages/dashboard/admin/ManageItems";
import ManageBookings from "../pages/dashboard/admin/ManegeBookings";
import UserDashboard from "../pages/dashboard/user/UserDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/recettes",
        element: <Recettes />,
      },
      {
        path: "/order",
        element: (
          <PrivateRouter>
            <Order />
          </PrivateRouter>
        ),
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/*",
        element: <Erreur404 />,
      },
      {
        path: "/my-recipe",
        element: (
          <PrivateRouter>
            <RecipeManagement />
          </PrivateRouter>
        ),
      },
      {
        path: "/dashboard/:id",
        element: (
          <PrivateRouter>
            <UserDashboard />
          </PrivateRouter>
        ),
      },
      {
        path: "/process-checkout",
        element: <Payment />,
      },
      {
        path: "/update-profile",
        element: <UserProfil />,
      },
      {
        path: "/recettes/nouvelles",
        element: <div>Nouvelle</div>,
      },
      {
        path: "/recettes/populaires",
        element: <div>Populaire</div>,
      },
      {
        path: "/recettes/best",
        element: <div>Best</div>,
      },
      {
        path: "/recettes/:id",
        element: <RecetteDetail />,
      },
      {
        path: "/categories/gourmandise",
        element: <Gourmandise />,
      },
      {
        path: "/categories/chocolat",
        element: <Chocolat />,
      },
      {
        path: "/categories/pains-viennoiserie",
        element: <PainsViennoiserie />,
      },
      {
        path: "/categories/fruits",
        element: <Fruits />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "dashboard",
    element: (
      <PrivateRouter>
        <DashboardLayout />
      </PrivateRouter>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "add-recette",
        element: <AddRecette />,
      },
      {
        path: "manage-items",
        element: <ManageItems />,
      },
      {
        path: "update-recette/:id",
        element: <UpdateRecette />,
        loader: ({ params }) =>
          fetch(`http://localhost:3001/recettes/${params.id}`).then((res) =>
            res.json(),
          ),
      },
      {
        path: "bookings",
        element: <ManageBookings />,
      },
    ],
  },
]);

export default router;
