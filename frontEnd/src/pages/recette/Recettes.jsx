/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Cards from '../../components/Cards';

function Recettes() {
  const [recettes, setRecettes] = useState([]);
  const [filteredRecettes, setFilteredRecettes] = useState(recettes);
  const [search, setSearch] = useState('');
  const [searchOptions, setSearchOptions] = useState('toutes');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/recettes');
        const data = await response.json();
        const normalizedData = data.map(item => ({
          ...item,
          title: item.title || ''
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
    const filtered = search.trim() === ''
      ? recettes
      : recettes.filter(recette =>
        recette.title?.toLowerCase().includes(search.trim().toLowerCase())
        || recette.category?.toLowerCase().includes(search.trim().toLowerCase())
        || recette.difficulte?.toLowerCase().includes(search.trim().toLowerCase())
        || recette.description?.toLowerCase().includes(search.trim().toLowerCase())
        || recette.instruction?.toLowerCase().includes(search.trim().toLowerCase())
        || recette.ingredient?.toLowerCase().includes(search.trim().toLowerCase())
        || recette.type?.toLowerCase().includes(search.trim().toLowerCase())
      );
    setFilteredRecettes(filtered);
  }, [search, recettes]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const filterRecettes = (category) => {
    const filtered = category === 'toutes'
      ? recettes
      : recettes.filter(recette => recette.category === category);
    setFilteredRecettes(filtered);
    setSearch('');
    setSearchOptions(category);
    setCurrentPage(1);
  };

  const showCategory = (option) => {
    setSearchOptions(option);
    let sortedRecettes = recettes;
    switch (option) {
      case 'difficile':
        sortedRecettes = sortedRecettes.filter(recette => recette.difficulte === 'difficile');
        break;
      case 'facile':
        sortedRecettes = sortedRecettes.filter(recette => recette.difficulte === 'facile');
        break;
      case 'moyenne':
        sortedRecettes = sortedRecettes.filter(recette => recette.difficulte === 'moyenne');
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
  const currentRecettes = filteredRecettes.slice(indexOfFirstRecette, indexOfLastRecette);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className='container mx-auto px-4 xl-px-24 max-w-screen-2xl'>
        <div className='py-36 flex flex-col items-center justify-center gap-8'>
          <div className='text-center space-y-7 px-4'>
            <h2 className='media-text-5xl text-4xl font-bold media-leading-snug leading-snug'>La pâtisserie <span className='text-red'>gourmande</span> <span className='text-red'>elit</span>.</h2>
            <p className='text-xl text-gray text-xl media-w-4-5 mx-auto'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </div>

      <div className="section-container align-center mx-auto">
        {/* barre de recherche */}
        <div className='text-center mb-10'>Bouton de recherche</div>
        <div className='container'>
          <div className='search-bar'>
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
                {filteredRecettes.length} recette{filteredRecettes.length > 1 ? 's' : ''} trouvée{filteredRecettes.length > 1 ? 's' : ''}
              </p>
            ) : (
              <p className="search-results-count">Aucune recette trouvée</p>
            )}
          </div>
        </div>

        <div className='flex flex-wrap media-justify-between items-center flex-row mx-auto'>
          <div className='flex mb-10 media-mb-10 media-mt-10 gap-4 flex-wrap'>
            <button onClick={() => filterRecettes('toutes')} className={searchOptions === 'toutes' ? 'button active' : 'btn'}>Toutes</button>
            <button onClick={() => filterRecettes('Pains et viennoiserie')} className={searchOptions === 'Pains et viennoiserie' ? 'button active' : 'btn'}>Pains et viennoiserie</button>
            <button onClick={() => filterRecettes('Chocolat')} className={searchOptions === 'Chocolat' ? 'button active' : 'btn'}>Chocolat</button>
            <button onClick={() => filterRecettes('Gourmandises')} className={searchOptions === 'Gourmandises' ? 'button active' : 'btn'}>Gourmandises</button>
            <button onClick={() => filterRecettes('Fruits')} className={searchOptions === 'Fruits' ? 'button active' : 'btn'}>Fruits</button>
          </div>

          <div className='mb-10 media-mb-10 media-mt-10 flex'>
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

        {/* Affichage des recettes */}
        <div className='grid grid-cols-2 media-grid-cols-3 lg-grid-cols-4 gap-4 mb-10'>
          {currentRecettes.map((item, index) => (
            <Cards key={index} item={item} />
          ))}
        </div>
      </div>

      <div className='flex justify-center mb-10 gap-4'>
        {Array.from({ length: Math.ceil(filteredRecettes.length / itemsPerPage) }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-2 py-1 rounded-full ${currentPage === index + 1 ? 'btn-primary' : 'btn'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Recettes;
