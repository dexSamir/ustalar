import './burger.css';
import arrow from '../assets/arrow-down.svg'; 
import temir from '../assets/temir.svg';
import ev from '../assets/ev.svg';
import tehsil from '../assets/tehsil.svg';
import gozelik from '../assets/gozellik.svg';
import aile from '../assets/aile.svg';
import ictimai from '../assets/ictimai.svg';
import React from 'react';

function BurgerMenu({ isOpen, onClose }) {
  return (
    <div className={`burger-overlay ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>
        &times; 
      </button>
      <div className="overlay-content">
        <ul className="menu-categories">
          <li>
            <a href='#'>
              <img src={temir} alt="Təmir və tikinti ikonu" /> 
              Təmir və tikinti
            </a>
            <img src={arrow} alt="" className='arrow-right' />
          </li>
          <li>
            <a href='#'>
              <img src={ev} alt="Ev və məişət xidmətləri ikonu" />
              Ev və məişət xidmətləri
            </a>
            <img src={arrow} alt="" className='arrow-right' />
          </li>
          <li>
            <a href='#'>
              <img src={tehsil} alt="Təhsil xidmətləri ikonu" />
              Təhsil xidmətləri
            </a>
            <img src={arrow} alt="" className='arrow-right' />
          </li>
          <li>
            <a href='#'>
              <img src={gozelik} alt="Gözəllik və sağlamlıq ikonu" />
              Gözəllik və sağlamlıq
            </a>
            <img src={arrow} alt="" className='arrow-right' />
          </li>
          <li>
            <a href='#'>
              <img src={aile} alt="Ailə və Baxıcı xidmətləri ikonu" />
              Ailə və Baxıcı xidmətləri
              
            </a>
            <img src={arrow} alt="" className='arrow-right' />
          </li>
          <li>
            <a href='#'>
              <img src={ictimai} alt="İctimai və fərdi təlimlər ikonu" />
              İctimai və fərdi təlimlər
              
            </a>
            <img src={arrow} alt="" className='arrow-right' />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default BurgerMenu;