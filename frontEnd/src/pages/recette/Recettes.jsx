/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import Cards from "../../components/Cards";
import { LikeRecetteProvider, useLikeRecette } from "../../contexts/LikeRecetteProvider";
import { AuthContext } from "../../contexts/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarlybirds } from "@fortawesome/free-brands-svg-icons";

function Recettes() {
  const [recettes, setRecettes] = useState([]);
  const [filteredRecettes, setFilteredRecettes] = useState([]);
  const [search, setSearch] = useState("");
  const [searchOptions, setSearchOptions] = useState("toutes");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const { user, loading } = useContext(AuthContext);
  const { likes, dislikes } = useLikeRecette();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/recettes`);
        const data = await response.json();
        const normalizedData = data.map((item) => ({
          ...item,
          title: item.title || "",
          category: item.category || "",
          difficulte: item.difficulte || "",
          description: item.description || "",
          instructions: item.instructions || "",
          ingredients: item.ingredients || "",
          type: item.type || ""
        }));
        setRecettes(normalizedData);
        setFilteredRecettes(normalizedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered =
      search.trim() === ""
        ? recettes
        : recettes.filter(
          (recette) =>
            typeof recette.title === "string" && recette.title
              .toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            typeof recette.category === "string" && recette.category
              .toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            typeof recette.difficulte === "string" && recette.difficulte
              .toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            typeof recette.description === "string" && recette.description
              .toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            typeof recette.instructions === "string" && recette.instructions
              .toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            typeof recette.ingredients === "string" && recette.ingredients
              .toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            typeof recette.type === "string" && recette.type
              .toLowerCase()
              .includes(search.trim().toLowerCase())
        );
    setFilteredRecettes(filtered);
  }, [search, recettes]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const filterRecettes = (category) => {
    const filtered =
      category === "toutes"
        ? recettes
        : recettes.filter((recette) => recette.category === category);
    setFilteredRecettes(filtered);
    setSearch("");
    setSearchOptions(category);
    setCurrentPage(1);
  };

  const showCategory = (option) => {
    setSearchOptions(option);
    let sortedRecettes = recettes;
    switch (option) {
      case "difficile":
        sortedRecettes = sortedRecettes.filter(
          (recette) => recette.difficulte === "difficile"
        );
        break;
      case "facile":
        sortedRecettes = sortedRecettes.filter(
          (recette) => recette.difficulte === "facile"
        );
        break;
      case "moyenne":
        sortedRecettes = sortedRecettes.filter(
          (recette) => recette.difficulte === "moyenne"
        );
        break;
      default:
        sortedRecettes = recettes;
        break;
    }
    setFilteredRecettes(sortedRecettes);
    setCurrentPage(1);
  };

  const indexOfLastRecette = currentPage * itemsPerPage;
  const indexOfFirstRecette = indexOfLastRecette - itemsPerPage;
  const currentRecettes = filteredRecettes.slice(
    indexOfFirstRecette,
    indexOfLastRecette
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-10">
      <div className="container mx-auto px-4 xl-px-24 max-w-screen-2xl">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="text-center space-y-7 px-4 banner">
            <h2 className="media-text-5xl text-4xl font-bold media-leading-snug leading-snug" style={{ fontFamily: "Playfair Display", fontWeight: "bold", textShadow: "0px 1px 1px rgba(0, 0, 0, 0.25)", letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: "1.2", textAlign: "center", marginTop: "2rem", marginBottom: "3rem" }}>La pâtisserie gourmande elit <FontAwesomeIcon icon={faEarlybirds} /></h2>
            <p className="text-xl text-gray text-xl media-w-4-5 mx-auto text-justify">
            Bienvenue dans l'univers de la pâtisserie ! Que vous soyez un pâtissier débutant ou expérimenté, nous avons une collection de recettes pour tous les goûts et niveaux. Découvrez des techniques de cuisson, des astuces et des conseils pour réaliser des desserts délicieux et impressionnants. Laissez libre cours à votre créativité et réveillez le pâtissier qui sommeille en vous. Préparez-vous à épater vos proches avec des douceurs irrésistibles !
            </p>
          </div>
        </div>
      </div>

      <div
        className="section-container align-center mx-auto"
        style={{ maxWidth: "1400px" }}
      >
        <div className="text-center mb-10">
          <p className="subtitle">Trouver une recette</p>
        </div>
        <div className="container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher une recette"
              value={search}
              onChange={handleSearchChange}
              className="form-control"
            />
          </div>
          <div>
            {filteredRecettes.length > 0 ? (
              <p className="search-results-count">
                {filteredRecettes.length} recette
                {filteredRecettes.length > 1 ? "s" : ""} trouvée
                {filteredRecettes.length > 1 ? "s" : ""}
              </p>
            ) : (
              <p className="search-results-count">Aucune recette trouvée</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap media-justify-between items-center flex-row mx-auto">
          <div className="flex mb-10 media-mb-10 media-mt-10 gap-4 flex-wrap">
            <button
              onClick={() => filterRecettes("toutes")}
              className={searchOptions === "toutes" ? "button active" : "btn"}
            >
              Toutes
            </button>
            <button
              onClick={() => filterRecettes("Pains et viennoiserie")}
              className={
                searchOptions === "Pains et viennoiserie"
                  ? "button active"
                  : "btn"
              }
            >
              Pains et viennoiserie
            </button>
            <button
              onClick={() => filterRecettes("Chocolat")}
              className={
                searchOptions === "Chocolat" ? "button active" : "btn"
              }
            >
              Chocolat
            </button>
            <button
              onClick={() => filterRecettes("Gourmandises")}
              className={
                searchOptions === "Gourmandises" ? "button active" : "btn"
              }
            >
              Gourmandises
            </button>
            <button
              onClick={() => filterRecettes("Fruits")}
              className={searchOptions === "Fruits" ? "button active" : "btn"}
            >
              Fruits
            </button>
          </div>

          <div className="mb-10 media-mb-10 media-mt-10 flex">
            <select
              className="form-select form-select-lg btn"
              name="sort"
              id="sort"
              onChange={(e) => showCategory(e.target.value)}
              value={searchOptions}
            >
              <option value="toutes">Toutes</option>
              <option value="difficile">Difficile</option>
              <option value="facile">Facile</option>
              <option value="moyenne">Moyenne</option>
            </select>
          </div>
        </div>

        <div className="cards-grid">
          {currentRecettes.map((item, index) => (
            <Cards key={index} item={item} />
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-10 gap-4 mt-10">
        {Array.from({
          length: Math.ceil(filteredRecettes.length / itemsPerPage),
        }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-2 py-1 rounded-full ${currentPage === index + 1 ? "btn-primary" : "btn"
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Recettes;




