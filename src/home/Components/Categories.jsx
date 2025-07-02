import React, { useState } from 'react';
import './categories.css';
import { FiChevronDown } from 'react-icons/fi';
import table from '../assets/table.svg';
import paint from '../assets/paint.svg';
import bor from '../assets/bor.svg';
import mdi from '../assets/mdi.svg';
import maki from '../assets/maki.svg';
import sicon from '../assets/sicon.svg';
import BurgerMenu from './BurgerMenu';

const Categories = () => {
  const [showBurger, setShowBurger] = useState(false);

  const categories = [
    { icon: table, title: "Mebel yığımı", workers: "90+ Usta" },
    { icon: paint, title: "Rəngsaz", workers: "150+ Usta" },
    { icon: bor, title: "Santexnik", workers: "400+ Usta" },
    { icon: mdi, title: "Təmir və tikinti", workers: "360+ Usta" },
    { icon: maki, title: "Mexanik", workers: "760+ Usta" },
    { icon: sicon, title: "Derzi", workers: "566+ Usta" }
  ];

  return (
    <>
      <section className='categories-section'>
        <div className="categories-header">
          <h2>Kateqoriyalar</h2>
          <div className="view-all" onClick={() => setShowBurger(!showBurger)}>
            Daha çox <FiChevronDown className="arrow-icon" />
          </div>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <div className="category-card" key={index}>
              <img src={category.icon} alt={category.title} className='category-icon' />
              <div className="category-info">
                <h3>{category.title}</h3>
                <p>{category.workers}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BurgerMenu isOpen={showBurger} onClose={() => setShowBurger(false)} />
    </>
  );
};

export default Categories;
