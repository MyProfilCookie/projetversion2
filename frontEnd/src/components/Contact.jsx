/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";
import successIcon from "/images/site/validation.png";
import errorIcon from "/images/site/warning.gif";
import Swal from "sweetalert2"; // Importez SweetAlert2

const validateInputs = (name, email, subject, message) => {
  const errors = [];

  // Validate name: Minimum 2 characters and no commas or periods
  if (name.trim().length < 2) {
    errors.push("Veuillez renseigner votre nom et qu'il contienne au moins 2 lettres !");
  } else if (/[,.;?/]/.test(name)) {
    errors.push("Le nom ne doit pas contenir de virgules ou de points.");
  }

  // Validate email: Non-empty and valid email format
  if (email.trim().length === 0 || !validateEmail(email)) {
    errors.push("Veuillez renseigner une adresse email valide !");
  }

  // Validate subject: Non-empty
  if (subject.trim().length === 0) {
    errors.push("Veuillez sélectionner un sujet !");
  }

  // Validate message: Minimum 10 characters
  if (message.trim().length < 10) {
    errors.push("Le message doit contenir au moins 10 caractères !");
  }

  return errors;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|fr)$/;
  return emailRegex.test(email);
};

const Contact = () => {
  const { isAuthenticated, userEmail } = useAuth(); // Get userEmail from useAuth
  const [name, setName] = useState("");
  const [email, setEmail] = useState(userEmail || ""); // Set email to userEmail if available
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`/api/contact/subjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setSubjects(response.data.subjects);
        } else {
          setErrors(["Erreur lors du chargement des sujets."]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sujets :", error);
        setErrors(["Erreur lors du chargement des sujets."]);
      }
    };

    fetchSubjects();
  }, []);

  const handleInputChange = (setter, validator) => (e) => {
    const value = e.target.value;
    if (!validator || validator(value)) {
      setter(value);
    }
  };

  const validateName = (name) => {
    return !/[,.;?/:=+£$%#@€*§&°¨<>]/.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    if (!isAuthenticated) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Vous devez être connecté pour envoyer un message.",
      });
      return;
    }

    const validationErrors = validateInputs(name, email, subject, message);
    if (validationErrors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        html: `<ul>${validationErrors.map((error, index) => `<li key="${index}">${error}</li>`).join('')}</ul>`,
      });
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `/api/contact`,
        {
          name,
          email,
          subject,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Message envoyé avec succès !',
        });
        setName("");
        setEmail(userEmail || ""); // Reset email to userEmail if available
        setSubject("");
        setMessage("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: response.data.message || "Échec de l'envoi du message.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erreur lors de l'envoi du message. Veuillez réessayer.";
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="contact-page">
      <div className="container mx-auto max-w-screen-2xl">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="text-center space-y-7 py-4">
            <h2 className="media-text-5xl text-4xl font-bold media-leading-snug leading-snug">
              Contactez <span className="text-red">Nous</span>
            </h2>
            <p className="text-xl text-gray text-xl media-w-4-5 mx-auto">
              Vous avez une question ou souhaitez nous laisser un message ?
              Utilisez le formulaire ci-dessous pour nous contacter.
            </p>
          </div>
        </div>
      </div>
      <div className="section-container align-center mx-auto mt-6">
        <form
          onSubmit={handleSubmit}
          className="form contact-form"
          encType="multipart/form-data"
        >
          <div className="form2">
            <input
              type="text"
              id="name"
              name="name"
              placeholder=""
              className="form__input"
              value={name}
              onChange={handleInputChange(setName, validateName)}
            />
            <label
              htmlFor="name"
              className={name ? "form__label active" : "form__label"}
              style={{ color: name.length >= 2 && !/[,.;?/:=+£$%#@€*§&°¨<>]/.test(name) ? "green" : "red" }}
            >
              Nom
            </label>
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
            <label
              htmlFor="email"
              className={email ? "form__label active" : "form__label"}
              style={{ color: validateEmail(email) ? "green" : "red" }}
            >
              Email
            </label>
          </div>
          <div className="form2">
            <select
              id="subject"
              name="subject"
              className="form__input"
              value={subject}
              onChange={handleInputChange(setSubject)}
            >
              <option value="">Sélectionnez un sujet</option>
              {subjects.map((subjectOption) => (
                <option key={subjectOption} value={subjectOption}>
                  {subjectOption}
                </option>
              ))}
            </select>
            <label
              htmlFor="subject"
              className={subject ? "form__label active" : "form__label"}
              style={{ color: subject ? "green" : "red", fontSize: "0.8rem" }}
            >
              Sujet
            </label>
          </div>
          <div className="form2">
            <textarea
              id="message"
              name="message"
              placeholder=""
              rows="6"
              className="form__input"
              value={message}
              onChange={handleInputChange(setMessage)}
            />
            <label
              htmlFor="message"
              className={message ? "form__label active" : "form__label"}
              style={{ color: message.length >= 10 ? "green" : "red" }}
            >
              Message
            </label>
          </div>
          <div className="flex justify-between mt-10 mb-10">
            <button type="reset" className="btn-formulaire cancel">
              Annuler
            </button>
            <button type="submit" className="btn-formulaire confirm">
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
















