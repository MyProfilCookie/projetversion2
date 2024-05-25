import { createBrowserRouter } from "react-router-dom"
import Main from "../layout/Main"
import Home from "../pages/home/Home"
import Recettes from "../pages/recette/Recettes"
import Register from "../components/Register"
import PrivateRouter from "../PrivateRouter/PrivateRouter"
import UserProfil from "../pages/dashboard/user/UserProfile"
import RecetteDetail from "../pages/recette/RecetteDetail"
import AdminPanel from "../pages/dashboard/admin/AdminPanel"
import DashboardLayout from "../layout/DashboardLayout"
import Dashboard from "../pages/dashboard/admin/Dashboard"
import UserDashboard from "../pages/dashboard/user/UserDashboard"
import Users from "../pages/dashboard/admin/Users"
import Contact from "../components/Contact"
import About from "../components/About"
import RecipeManagement from "../pages/dashboard/user/UserDashboard"
// import Login from "../components/Login"
// import UpdateRecette from "../pages/dashboard/admin/UpdateRecette"
// import UpdateUser from "../pages/dashboard/admin/UpdateUser"
// import Login from "../components/Login"
// import UpdateRecette from "../pages/dashboard/admin/UpdateRecette"
// import UpdateUser from "../pages/dashboard/admin/UpdateUser"


const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/recettes",
                element: <Recettes />
            },
            {
                path: "/admin-panel",
                element: <PrivateRouter><AdminPanel /></PrivateRouter>

            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/*",
                element: <div>404</div>
            },
            {
                path:"/my-recipe",
                element:<PrivateRouter><RecipeManagement /></PrivateRouter>
            },
            {
                path: "/update-profile",
                element: <UserProfil />
            },
            {
                path: "/recettes/nouvelles",
                element: <div>Nouvelle</div>
            },
            {
                path: "/recettes/populaires",
                element: <div>Populaire</div>
            },
            {
                path: "/recettes/best",
                element: <div>Best</div>
            },
            {
                path: "/recettes/:id",
                element: <RecetteDetail />
            }
        ]
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <div>Login</div>
    },
    {
        path: 'dashboard',
        element: <PrivateRouter><DashboardLayout /></PrivateRouter>,
        
        children: [
            {
                path: ':userId',
                element: <UserDashboard />
            },
            {
                path: 'users',
                element: <Users />
            },
            {
                path: '',
                element: <Dashboard />
            }
        ]
    }
])

export default router