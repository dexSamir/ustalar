import React, { useState } from 'react';
import './join.css';
import professionalsImage from '../assets/join.png';

const JoinUsCard = () => {
  const [phoneNumber, setPhoneNumber] = useState('+994');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(null);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.startsWith('+994') && value.length <= 13) {
      setPhoneNumber(value);
      setError(null);
    }
  };

  const formatPhoneForApi = (phone) => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.startsWith('994') ? digitsOnly.substring(3) : digitsOnly;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (phoneNumber.length < 13) {
      setError('Zəhmət olmasa düzgün nömrə daxil edin (+994XXXXXXXXX)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formattedNumber = formatPhoneForApi(phoneNumber);
      
      if (formattedNumber.length !== 9 || !formattedNumber.startsWith('5')) {
        throw new Error('Mobil nömrə 5 ilə başlamalı və 9 rəqəmdən ibarət olmalıdır (məs: 501234567)');
      }

      const response = await fetch('https://api.peshekar.online/api/v1/check-phone/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile_number: formattedNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mobile_number?.[0] || 'Xəta baş verdi');
      }

      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setPhoneNumber('+994');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
            {error && <p className="error-message">{error}</p>}
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