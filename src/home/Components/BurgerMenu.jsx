import React, { useState } from 'react';
import './burger.css';

// Import your icons
// import arrow from '../assets/arrow-down.svg';
// Icons
import { FiChevronDown, FiX } from 'react-icons/fi';

import temir from '../assets/temir.svg';
import ev from '../assets/ev.svg';
import tehsil from '../assets/tehsil.svg';
import gozelik from '../assets/gozellik.svg';
import aile from '../assets/aile.svg';
import ictimai from '../assets/ictimai.svg';

const categoriesData = [
  {
    id: 'temir',
    name: 'Təmir və tikinti',
    icon: temir,
    subcategories: ['Santexnika və isitmə', 'Elektrik işləri', 'Dizayn və memarlıq', 'Usta xidməti', 'Təmir işləri'],
  },
  {
    id: 'ev',
    name: 'Ev və məişət xidmətləri',
    icon: ev,
    subcategories: ['Təmizlik xidmətləri', 'Mebel təmiri və yığılması', 'Yük daşıma', 'Pərdə və jalüz'],
  },
  {
    id: 'tehsil',
    name: 'Təhsil xidmətləri',
    icon: tehsil,
    subcategories: ['Repetitorlar', 'Xarici dil kursları', 'Musiqi dərsləri', 'Sürücülük kursları'],
  },
  {
    id: 'gozellik',
    name: 'Gözəllik və sağlamlıq',
    icon: gozelik,
    subcategories: ['Salon xidmətləri', 'Dietoloq', 'Psixoloq', 'İdman məşqçisi', 'Lazer epilyasiyası'],
  },
  {
    id: 'aile',
    name: 'Ailə və Baxıcı xidmətləri',
    icon: aile,
    subcategories: ['Dayə xidməti', 'Xəstə baxıcısı', 'Yaşlı baxıcısı', 'Ev köməkçisi'],
  },
  {
    id: 'ictimai',
    name: 'İctimai və fərdi təlimlər',
    icon: ictimai,
    subcategories: ['Biznes təlimləri', 'Marketinq təlimləri', 'İT və proqramlaşdırma', 'Fərdi inkişaf'],
  },
];

const BurgerMenu = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleCategory = (id) => {
    setActiveCategory(activeCategory === id ? null : id);
  };

  return (
    <div className={`burger-wrapper ${isOpen ? 'open' : ''}`}>
      <div className="burger-overlay" onClick={onClose} />
      
      <div className="burger-menu">
        {/* <div className="burger-header">
          <button onClick={onClose} className="close-button">
            <FiX size={24} />
          </button>
        </div> */}
        
        <nav className="burger-nav">
          <ul className="category-list">
            {categoriesData.map((category) => (
              <li key={category.id} className="category-item">
                <button 
                  className="category-button"
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={activeCategory === category.id}
                >
                  <span>{category.name}</span>
                  <FiChevronDown 
                    className={`arrow ${activeCategory === category.id ? 'open' : ''}`} 
                  />
                </button>
                
                {activeCategory === category.id && (
                  <ul className="subcategory-list">
                    {category.subcategories.map((sub, index) => (
                      <li key={index} className="subcategory-item">
                        <a href="#" className="subcategory-link">{sub}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default BurgerMenu;