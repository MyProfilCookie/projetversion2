/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import successIcon from '/images/site/validation.png';
import errorIcon from '/images/site/warning.gif';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    const validationErrors = validateInputs(name, email, subject, message);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:3000/contact', { name, email, subject, message });
      if (response.data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setErrors([response.data.message || "Échec de l'envoi du message."]);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'envoi du message. Veuillez réessayer.';
      setErrors([errorMessage]);
    }
  };

  const validateInputs = (name, email, subject, message) => {
    const newErrors = [];
    if (!name) newErrors.push("Veuillez renseigner votre nom !");
    if (!validateEmail(email)) newErrors.push("Veuillez renseigner une adresse email valide !");
    if (!subject) newErrors.push("Veuillez renseigner le sujet !");
    if (!message) newErrors.push("Veuillez écrire un message !");
    return newErrors;
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  return (
    <div className="contact-page">
      <div className='container mx-auto max-w-screen-2xl'>
        <div className='flex flex-col items-center justify-center gap-8'>
          <div className='text-center space-y-7 px-4'>
            <h2 className='media-text-5xl text-4xl font-bold media-leading-snug leading-snug'>
              Contactez <span className='text-red'>Nous</span>
            </h2>
            <p className='text-xl text-gray text-xl media-w-4-5 mx-auto'>
              Vous avez une question ou souhaitez nous laisser un message ? Utilisez le formulaire ci-dessous pour nous contacter.
            </p>
          </div>
        </div>
      </div>

      <div className="section-container align-center mx-auto">
        <form onSubmit={handleSubmit} className="form contact-form" encType="multipart/form-data">
          {errors.length > 0 && (
            <div id="messagesErrors" className="error">
              <img src={errorIcon} alt="Erreur" className="imgErrorAndValid" />
              <ul>
                {errors.map((error, index) => (
                  <li key={index} className="fsz2">{error}</li>
                ))}
              </ul>
            </div>
          )}
          {success && (
            <div id="messageValidation" className="success">
              <img src={successIcon} alt="Succès" className="imgErrorAndValid" />
              <ul>
                <li className="fsz2">Message envoyé avec succès !</li>
              </ul>
            </div>
          )}
          <div className="form2">
            <input
              type="text"
              id="name"
              name="name"
              placeholder=""
              className="form__input"
              value={name}
              onChange={handleInputChange(setName)}
            />
             <label htmlFor="name" className={name ? "form__label active" : "form__label"}>Nom</label>
          </div>
          <div className="form2">
            <input
              type="email"
              id="email"
              name="email"
              placeholder=""
              className="form__input"
              value={email}
              onChange={handleInputChange(setEmail)}
            />
            <label htmlFor="email" className={email ? "form__label active" : "form__label"}>Email</label>
          </div>
          <div className="form2">
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder=""
              className="form__input"
              value={subject}
              onChange={handleInputChange(setSubject)}
            />
            <label htmlFor="subject" className={subject ? "form__label active" : "form__label"}>Sujet</label>
          </div>
          <div className="form2">
            <textarea
              id="message"
              name="message"
              placeholder=""
              rows="5"
              className="form__input"
              value={message}
              onChange={handleInputChange(setMessage)}
            />
            <label htmlFor="message" className={message ? "form__label active" : "form__label"}>Message</label>
          </div>
          <div className="flex justify-between mt-10 mb-10">
            <button type="reset" className="btn-formulaire cancel">Annuler</button>
            <button type="submit" className="btn-formulaire confirm">Envoyer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;