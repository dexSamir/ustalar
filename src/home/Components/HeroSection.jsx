import './hero.css';
import React from 'react';

import heroBackgroundVideo from '../assets/headervid.mp4'; 
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="hero-container">

      <video className="hero-background-video" autoPlay loop muted playsInline>
        <source src={heroBackgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="hero-overlay">
        <div className="hero-content">
          <h1>İşinin peşəkarını axtarırsınız?</h1>
          <p>Yüzlərlə peşəkar arasından sizə uyğun olanı tapın.</p>
          <Link to={"/ecom"}><button className="hero-button">Peşəkarlarla tanış ol</button></Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;