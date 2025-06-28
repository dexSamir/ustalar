import React, { useState } from 'react';
import './header.css';
import Logo from '../assets/logo.svg';
import BurgerMenu from '../assets/burgerMenu.svg';
import User from '../assets/profile-circle.svg';
import SearchIcon from '../assets/search.svg';
import ArrowDown from '../assets/arrow-down.svg';
import BurgerMenuOverlay from './BurgerMenu';
import { Link } from 'react-router-dom';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const toggleMenu = () => { 
    setIsMenuOpen(!isMenuOpen);
  };

  return (
      <header className="header-container">
        <div className="logo">
          <img src={Logo} />
        </div>
        <button className="menu-button" onClick={toggleMenu}> 
        <img src={BurgerMenu} alt="Menu" />
      </button>
        <div className="search-area">
          <div className="search-input-wrapper">
            <img src={SearchIcon} alt="ss" />
            <input
              type="text"
              placeholder="Axtar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-button" onClick={() => setSearchTerm('')}>
                <p>.</p>
              </button>
            )}
          </div>
          <div className="city-selector-wrapper">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="" disabled>Şəhər seçin</option>
              <option value="baku">Bakı</option>
              <option value="ganja">Gəncə</option>
              <option value="sumqayit">Sumqayıt</option>
            </select>
           <img src={ArrowDown} alt="arrow-down" />
          </div>
        </div>
        <button className="search-button-primary">Axtar</button>
        <Link to="/login" className="register-button">
          Daxil Ol
        </Link>
        <Link to="/register" className="register-button">
          <img src={User} />
          Qeydiyyat
        </Link>
        <BurgerMenuOverlay isOpen={isMenuOpen} onClose={toggleMenu} />
      </header>
  );
}

export default Header;