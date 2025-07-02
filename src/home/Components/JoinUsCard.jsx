import React, { useState } from 'react';
import './join.css';
import professionalsImage from '../assets/join.png';

const JoinUsCard = () => {
  const [phoneNumber, setPhoneNumber] = useState('+994');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.startsWith('+994') && value.length <= 13) {
      setPhoneNumber(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 13) {
      alert('Zəhmət olmasa düzgün nömrə daxil edin');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      
      setTimeout(() => {
        setIsSent(false);
        setPhoneNumber('+994');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="join-us-container">
      <div className="join-us-card">
        <div className="join-us-content">
          <h2 className="join-us-title">
            Aramıza qoşulmağa <br /> nə deyirsən?
          </h2>
          <p className="join-us-description">
            Yüzlərlə peşəkar sırasına sən də qoşul!
          </p>
          <form className="join-us-form" onSubmit={handleSubmit}>
            <input 
              placeholder="Nömrəni qeyd et" 
              maxLength={13}
              value={phoneNumber}
              onChange={handlePhoneChange}
              type="tel"
              className="phone-input"
            />
            <button 
              type="submit" 
              disabled={isLoading || isSent}
              className={`submit-button ${isLoading ? 'loading' : ''} ${isSent ? 'success' : ''}`}
            >
              {isLoading ? (
                <span className="button-loader"></span>
              ) : isSent ? (
                '✓ Göndərildi!'
              ) : (
                'Qeydiyyatdan keç'
              )}
            </button>
          </form>
        </div>
        <div className="join-us-image-container">
          <img 
            src={professionalsImage} 
            alt="Peşəkarlar" 
            className="professionals-image" 
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default JoinUsCard;