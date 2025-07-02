import React from 'react';
import './comments.css';
import { FiChevronDown } from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';

const testimonials = [
    {
        id: 1,
        name: 'Quliyev Rəsul',
        role: 'Təmir və quraşdırma xidmətləri mütəxəssisi',
        quote: 'Çox məmnun qaldım. Peşəkar və sürətli xidmət göstərdilər. İşlərin keyfiyyəti və müddəti gözləntilərimi üstələyib.',
        date: '02 İyun 2025',
        rating: 5,
        gender: 'male',
        image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
        id: 2,
        name: 'Leyla Səfərli',
        role: 'İnteryer dizayneri',
        quote: 'Əla iş. Vaxtında və keyfiyyətli xidmət. Mənzilimin dizaynı üçün çox kreativ ideyalar təqdim etdilər.',
        date: '22 Aprel 2025',
        rating: 5,
        gender: 'female',
        image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
        id: 3,
        name: 'Elnur Ağayev',
        role: 'Full-stack proqramçı',
        quote: 'Komandanızla işləmək çox xoş idi. Təklif edirəm! Veb saytımın hazırlanmasında çox peşəkarlıq göstərdilər.',
        date: '10 May 2025',
        rating: 5,
        gender: 'male',
        image: 'https://randomuser.me/api/portraits/men/65.jpg'
    },
    {
        id: 4,
        name: 'Ayan Məmmədova',
        role: 'Digital marketinq mütəxəssisi',
        quote: 'Gözləntilərimi tam qarşıladı. Təşəkkürlər! Sosial media strategiyamızın hazırlanmasında çox kömək oldular.',
        date: '15 Mart 2025',
        rating: 4,
        gender: 'female',
        image: 'https://randomuser.me/api/portraits/women/65.jpg'
    }
];

const StarRating = ({ rating }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((_, i) => (
                i < rating ? 
                <FaStar key={i} className="star filled" /> : 
                <FaRegStar key={i} className="star" />
            ))}
        </div>
    );
};

const Comments = () => {
    const duplicatedTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="testimonials-section">
            <div className="section-header">
                <h2 className="section-title">Sizdən gələn rəylər</h2>
                
            </div>
            
            <div className="testimonials-outer-container">
                <div className="testimonials-inner-container">
                    <div className="testimonials-track">
                        {duplicatedTestimonials.map((testimonial, index) => (
                            <div className="testimonial-card" key={`${testimonial.id}-${index}`}>
                                <div className="user-info">
                                    <img 
                                        src={testimonial.image} 
                                        alt={testimonial.name}
                                        className="user-avatar"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=0B4C5F&color=fff&rounded=true`;
                                        }}
                                    />
                                    <div className="user-details">
                                        <div className="name-and-rating">
                                            <h3 className="user-name">{testimonial.name}</h3>
                                            <StarRating rating={testimonial.rating} />
                                        </div>
                                        <p className="user-profession">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="testimonial-text">"{testimonial.quote}"</p>
                                <p className="testimonial-date">{testimonial.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Comments;