import React from "react";
import Logo from "../assets/logo.svg";
import BurgerMenu from "../assets/burgerMenu.svg";
import User from "../assets/profile-circle.svg";
import SearchIcon from "../assets/search.svg";
import ArrowDown from "../assets/arrow-down.svg";
import { useState, useEffect } from "react";
import "../Components/header.css";
import BurgerMenuOverlay from "./BurgerMenu";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="header-container">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <button className="menu-button" onClick={toggleMenu}>
        <img src={BurgerMenu} alt="Menu" />
      </button>
      <div className="search-area">
        <div className="search-input-wrapper">
          <img src={SearchIcon} alt="Search Icon" />
          <input
            type="text"
            placeholder="Axtar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-button" onClick={() => setSearchTerm("")}>
              <p>.</p>
            </button>
          )}
        </div>
        <div className="city-selector-wrapper">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="" disabled>
              Şəhər seçin
            </option>
            <option value="baku">Bakı</option>
            <option value="ganja">Gəncə</option>
            <option value="sumqayit">Sumqayıt</option>
          </select>
          <img src={ArrowDown} alt="arrow-down" />
        </div>
      </div>
      <button className="search-button-primary">Axtar</button>

      {isLoggedIn ? (
        <>
          <Link to="/profil">
            <button className="register-button">
              <img src={User} alt="User icon" />
              Profilim
            </button>
          </Link>
          <button className="register-button" onClick={handleLogout}>
            Çıxış
          </button>
        </>
      ) : (
        <>
          <Link to="/login">
            <button className="register-button">Daxil Ol</button>
          </Link>

          <Link to="/register">
            <button className="register-button">
              <img src={User} alt="User icon" />
              Qeydiyyat
            </button>
          </Link>
        </>
      )}
      <BurgerMenuOverlay isOpen={isMenuOpen} onClose={toggleMenu} />
    </header>
  );
}

export default Header;
