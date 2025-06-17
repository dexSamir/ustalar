import './card.css';
import Card1 from '../assets/card1.svg';
import arrow from '../assets/arrow-down.svg';
import React from 'react';

const Card = () => {
  return (
    <section className="component-container">
      <div className="categories-hero">
        <h2 style={{fontSize: "2rem"}}>Ustalarimiz</h2>
        <a href="#" className="see-more-link">
          <span>Daha Çox</span>
          <img src={arrow} alt="arrow-right" className="arrow-icon" />
        </a>
      </div>
      <div className="main-profiles">
        <div className="profile-card">
          <div className="card-image-container">
            <img src={Card1} alt="Profile" className="card-image" />
          </div>
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Elektrik</h2>
              <p className="card-subtitle">Rəsul Quliyev</p>
              <div className="card-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="location-icon"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Bakı, Azərbaycan</span>
              </div>
            </div>
            <div className="card-rating">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="star-icon"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.336 24 12 20.232 4.664 24 6 15.268 0 9.423l7.332-1.268L12 .587z" />
              </svg>
              <span>4.5</span>
            </div>
          </div>
        </div>
        <div className="profile-card">
          <div className="card-image-container">
            <img src={Card1} alt="Profile" className="card-image" />
          </div>
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Elektrik</h2>
              <p className="card-subtitle">Rəsul Quliyev</p>
              <div className="card-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="location-icon"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Bakı, Azərbaycan</span>
              </div>
            </div>
            <div className="card-rating">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="star-icon"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.336 24 12 20.232 4.664 24 6 15.268 0 9.423l7.332-1.268L12 .587z" />
              </svg>
              <span>4.5</span>
            </div>
          </div>
        </div>
        <div className="profile-card">
          <div className="card-image-container">
            <img src={Card1} alt="Profile" className="card-image" />
          </div>
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Elektrik</h2>
              <p className="card-subtitle">Rəsul Quliyev</p>
              <div className="card-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="location-icon"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Bakı, Azərbaycan</span>
              </div>
            </div>
            <div className="card-rating">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="star-icon"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.336 24 12 20.232 4.664 24 6 15.268 0 9.423l7.332-1.268L12 .587z" />
              </svg>
              <span>4.5</span>
            </div>
          </div>
        </div>
        <div className="profile-card">
          <div className="card-image-container">
            <img src={Card1} alt="Profile" className="card-image" />
          </div>
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Elektrik</h2>
              <p className="card-subtitle">Rəsul Quliyev</p>
              <div className="card-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="location-icon"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Bakı, Azərbaycan</span>
              </div>
            </div>
            <div className="card-rating">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="star-icon"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.336 24 12 20.232 4.664 24 6 15.268 0 9.423l7.332-1.268L12 .587z" />
              </svg>
              <span>4.5</span>
            </div>
          </div>
        </div>
<div className="profile-card">
          <div className="card-image-container">
            <img src={Card1} alt="Profile" className="card-image" />
          </div>
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Elektrik</h2>
              <p className="card-subtitle">Rəsul Quliyev</p>
              <div className="card-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="location-icon"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Bakı, Azərbaycan</span>
              </div>
            </div>
            <div className="card-rating">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="star-icon"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.336 24 12 20.232 4.664 24 6 15.268 0 9.423l7.332-1.268L12 .587z" />
              </svg>
              <span>4.5</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <div className="card-image-container">
            <img src={Card1} alt="Profile" className="card-image" />
          </div>
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Elektrik</h2>
              <p className="card-subtitle">Rəsul Quliyev</p>
              <div className="card-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="location-icon"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Bakı, Azərbaycan</span>
              </div>
            </div>
            <div className="card-rating">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="star-icon"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.336 24 12 20.232 4.664 24 6 15.268 0 9.423l7.332-1.268L12 .587z" />
              </svg>
              <span>4.5</span>
            </div>
          </div>
        </div>
        <div className="profile-card">
          <div className="card-image-container">
            <img src={Card1} alt="Profile" className="card-image" />
          </div>
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Elektrik</h2>
              <p className="card-subtitle">Rəsul Quliyev</p>
              <div className="card-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="location-icon"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Bakı, Azərbaycan</span>
              </div>
            </div>
            <div className="card-rating">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="star-icon"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.336 24 12 20.232 4.664 24 6 15.268 0 9.423l7.332-1.268L12 .587z" />
              </svg>
              <span>4.5</span>
            </div>
          </div>
        </div>
        <div className="profile-card">
          <div className="card-image-container">
            <img src={Card1} alt="Profile" className="card-image" />
          </div>
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Elektrik</h2>
              <p className="card-subtitle">Rəsul Quliyev</p>
              <div className="card-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="location-icon"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Bakı, Azərbaycan</span>
              </div>
            </div>
            <div className="card-rating">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="star-icon"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.336 24 12 20.232 4.664 24 6 15.268 0 9.423l7.332-1.268L12 .587z" />
              </svg>
              <span>4.5</span>
            </div>
          </div>
        </div>
        <div className="profile-card">
          <div className="card-image-container">
            <img src={Card1} alt="Profile" className="card-image" />
          </div>
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Elektrik</h2>
              <p className="card-subtitle">Rəsul Quliyev</p>
              <div className="card-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="location-icon"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Bakı, Azərbaycan</span>
              </div>
            </div>
            <div className="card-rating">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="star-icon"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.336 24 12 20.232 4.664 24 6 15.268 0 9.423l7.332-1.268L12 .587z" />
              </svg>
              <span>4.5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Card;
