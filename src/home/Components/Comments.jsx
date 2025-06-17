
import React from 'react';
import './comments.css';
import arrow from '../assets/arrow-down.svg';
import comImg from '../assets/image.svg'; // Assuming comImg is a local image
const testimonials = [
    {
        id: 1,
        name: 'Quliyev Rəsul',
        role: 'Təmir xidməti',
        quote: 'Çox məmnun qaldım. Peşəkar və sürətli xidmət göstərdilər.',
        date: '02 İyun 2025',
        rating: 5,
        image: comImg
    },
    {
        id: 2,
        name: 'Leyla Səfər',
        role: 'Dizayn',
        quote: 'Əla iş. Vaxtında və keyfiyyətli xidmət.',
        date: '22 Aprel 2025',
        rating: 5,
        image: comImg
    },
    {
        id: 3,
        name: 'Elnur Ağayev',
        role: 'Proqramlaşdırma',
        quote: 'Komandanızla işləmək çox xoş idi. Təklif edirəm!',
        date: '10 May 2025',
        rating: 5,
        image: comImg
    },
    {
        id: 4,
        name: 'Ayan Məmmədova',
        role: 'Marketinq',
        quote: 'Gözləntilərimi tam qarşıladı. Təşəkkürlər!',
        date: '15 Mart 2025',
        rating: 4,
        image: comImg
    }
];

const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
    ));
    return <div className="star-rating">{stars}</div>;
};

const Comments = () => {
    const duplicatedTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="testimonial-section">
            <div className="testimonial-header">
                <h2>Sizdən gələn rəylər</h2>
                <p style={{ display: "flex", alignItems:"center", gap:"10px" }}>Daha Cox <img src={arrow} alt="arrow-right" style={{ rotate:"-90deg", width:"20px" }} /></p>
            </div>
            <div className="carousel-container">
                <div className="carousel-track">
                    {duplicatedTestimonials.map((testimonial, index) => (
                        <div className="testimonial-box" key={index}>
                            <div className="author-info">
                                <img src={testimonial.image} alt={testimonial.name} className="author-image" />
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
