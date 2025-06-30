import React, { useState, useEffect } from "react";
import "./header.css";
import Logo from "../assets/logo.svg";
import BurgerMenu from "../assets/burgerMenu.svg";
import User from "../assets/profile-circle.svg";
import SearchIcon from "../assets/search.svg";
import ArrowDown from "../assets/arrow-down.svg";
import BurgerMenuOverlay from "./BurgerMenu";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const navigate = useNavigate();


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
      {isAuthenticated ? (
        <>
          <Link to="/profil" className="register-button">
            <img src={User} alt="user-icon" />
            {user?.first_name || "Profil"}
          </Link>
          <button
            className="register-button"
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("userData");
              setIsAuthenticated(false);
              setUser(null);
              navigate("/login");
            }}
          >
            Çıxış
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="register-button">
            Daxil Ol
          </Link>
          <Link to="/register" className="register-button">
            <img src={User} alt="user-icon" />
            Qeydiyyat
          </Link>
        </>
      )}

      <BurgerMenuOverlay isOpen={isMenuOpen} onClose={toggleMenu} />
    </header>
  );
}

export default Header;
