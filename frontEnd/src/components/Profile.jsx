/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faClipboardList, faCircleUser  } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../contexts/AuthProvider' 
import { RiCake3Line } from "react-icons/ri";
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Profile({ user }) {
    const {logOut} = useContext(AuthContext)
    const [isModalOpen, setIsModalOpen] = useState();
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    
    const handleLogout = () => {
        logOut().then(() => {
            alert('Vous êtes déconnecté')
            setIsModalOpen(false);
            navigate(from, { replace: true }); //  redirection vers la page 
        }).catch((error) => {console.log(error)})
    }
//  redirection vers la page d'accueil après connexion
const location = useLocation()
const navigate = useNavigate()
//  redirection vers la page d'accueil après connexion
const from = location.state?.from?.pathname || '/'
    return (
        <div>
            <div className="drawer drawer-end h-full z-100">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-4" className="drawer-button bton-ghost btn-circle avatar-profile ">
                    <div className="w-12">
                           {user.photoURL? <img src={user.photoURL} alt="avatar" className="w-12 rounded-full" /> : 
                        //    dans le cas où l'utilisateur n'a pas de photo de profil, on affiche une icône par défaut
                        //    <FontAwesomeIcon icon={faUserAstronaut} size='2xl' style={{height: '2.5rem', width: '2.5rem', color: '#fff'}}/>}
                           <RiCake3Line  style={{height: '2.5rem', width: '2.5rem', color: '#fff'}}/>}
                           
                        </div>
                    </label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu-drawer p-4 w-80 min-h-full">
                        {/* Sidebar content here */}
                        <li><a href='/update-profile'><FontAwesomeIcon icon={faCircleUser} /> Profile</a></li>
                        <li><a href='/my-recipe'><FontAwesomeIcon icon={faClipboardList} /> Mes recettes</a></li>
                        <li><a onClick={handleLogout} ><FontAwesomeIcon icon={faRightFromBracket} /> Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Profile