/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faClipboardList, faCircleUser, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../contexts/AuthProvider';
import { RiCake3Line } from "react-icons/ri";
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Profile({ user }) {
    const { logOut } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    //  const pour dashboard

    const handleDashboard = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        logOut().then(() => {
            alert('Vous êtes déconnecté');
            setIsModalOpen(false);
            navigate(from, { replace: true }); // Redirection vers la page
        }).catch((error) => {
            console.log(error);
        });
    };

    // Redirection vers la page d'accueil après connexion
    const location = useLocation();
    const navigate = useNavigate();
    // Redirection vers la page d'accueil après connexion
    const from = location.state?.from?.pathname || '/';

    if (!user) {
        return null; // or a loader/spinner
    }

    return (
        <div>
            <div className="drawer drawer-end h-full z-100">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer-4" className="drawer-button bton-ghost btn-circle avatar-profile">
                        <div className="w-12">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="avatar" className="w-12 rounded-full" />
                            ) : (
                                // Dans le cas où l'utilisateur n'a pas de photo de profil, on affiche une icône par défaut
                                <RiCake3Line style={{ height: '3rem', width: '1.8rem', color: 'black' }} />
                            )}
                        </div>
                    </label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu-drawer min-h-full">
                        {/* Sidebar content here */}
                        <li style={{ fontSize: '1rem' }}>
                            <Link to={`/update-profile`}>
                                <FontAwesomeIcon icon={faUser} size='2xl' /> Profile
                            </Link>
                        </li>
                        <li style={{ fontSize: '1rem' }}>
                            <Link to='/my-recipe'>
                                <FontAwesomeIcon icon={faClipboardList} size='2xl' /> Mes recettes
                            </Link>
                        </li>
                        <li style={{ fontSize: '1rem' }}>
                            <Link to={`/dashboard/`}>
                                <FontAwesomeIcon icon={faCircleUser} size='2xl' /> Dashboard
                            </Link>

                        </li>
                       
                        <li style={{ fontSize: '1rem' }}>
                            <a onClick={handleLogout}>
                                <FontAwesomeIcon icon={faRightFromBracket} size='2xl' /> Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Profile;
