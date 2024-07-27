/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const BackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleGoBack}
            className="btn-back flex items-center font-semibold rounded-full"
            style={{ backgroundColor: '#cd3333', color: 'white', padding: '10px' }}
        >
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
            Retour
        </button>
    );
};

export default BackButton;
