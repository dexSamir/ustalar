import React from 'react';
import './comments.css';
import arrow from '../assets/arrow-down.svg';

const testimonials = [
    {
        id: 1,
        name: 'Quliyev Rəsul',
        role: 'Təmir xidməti',
        quote: 'Çox məmnun qaldım. Peşəkar və sürətli xidmət göstərdilər.',
        date: '02 İyun 2025',
        rating: 5,
        gender: 'male'
    },
    {
        id: 2,
        name: 'Leyla Səfər',
        role: 'Dizayn',
        quote: 'Əla iş. Vaxtında və keyfiyyətli xidmət.',
        date: '22 Aprel 2025',
        rating: 5,
        gender: 'female'
    },
    {
        id: 3,
        name: 'Elnur Ağayev',
        role: 'Proqramlaşdırma',
        quote: 'Komandanızla işləmək çox xoş idi. Təklif edirəm!',
        date: '10 May 2025',
        rating: 5,
        gender: 'male'
    },
    {
        id: 4,
        name: 'Ayan Məmmədova',
        role: 'Marketinq',
        quote: 'Gözləntilərimi tam qarşıladı. Təşəkkürlər!',
        date: '15 Mart 2025',
        rating: 4,
        gender: 'female'
    }
];

// Pre-generated realistic face images from randomuser.me API
const faceImages = {
    male: [
        'https://randomuser.me/api/portraits/men/32.jpg',
        'https://randomuser.me/api/portraits/men/44.jpg',
        'https://randomuser.me/api/portraits/men/65.jpg'
    ],
    female: [
        'https://randomuser.me/api/portraits/women/44.jpg',
        'https://randomuser.me/api/portraits/women/65.jpg',
        'https://randomuser.me/api/portraits/women/32.jpg'
    ]
};

const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
    ));
    return <div className="star-rating">{stars}</div>;
};

const getRandomFace = (gender) => {
    const images = faceImages[gender];
    return images[Math.floor(Math.random() * images.length)];
};

const Comments = () => {
    const duplicatedTestimonials = [...testimonials, ...testimonials].map(testimonial => ({
        ...testimonial,
        faceImage: getRandomFace(testimonial.gender)
    }));

    return (
        <section className="testimonial-section">
            <div className="testimonial-header">
                <h2>Sizdən gələn rəylər</h2>
                <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    Daha Cox <img src={arrow} alt="arrow-right" style={{ rotate: "-90deg", width: "20px" }} />
                </p>
            </div>
            <div className="carousel-container">
                <div className="carousel-track">
                    {duplicatedTestimonials.map((testimonial, index) => (
                        <div className="testimonial-box" key={index}>
                            <div className="author-info">
                                <img 
                                    src={testimonial.faceImage} 
                                    alt={testimonial.name} 
                                    className="author-image" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=4e73df&color=fff&rounded=true`;
                                    }}
                                />
                                <div className="author-content-wrapper">
                                    <div className="author-details">
                                        <h3 className="author-name">{testimonial.name}</h3>
                                        <p className="author-role">{testimonial.role}</p>
                                    </div>
                                    <StarRating rating={testimonial.rating} />
                                </div>
                            </div>
                            <p className="testimonial-quote">"{testimonial.quote}"</p>
                            <p className="testimonial-date">{testimonial.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Comments;