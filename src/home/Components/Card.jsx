import React, { useState, useEffect } from 'react';
import './card.css';
import { FiChevronDown, FiMapPin, FiStar } from 'react-icons/fi';

const Card = () => {
  const [professionals, setProfessionals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async (url = 'https://api.peshekar.online/api/v1/professionals/') => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Map the API data to our card format
      const mappedProfessionals = data.results.map(professional => ({
        id: professional.id,
        category: professional.profession_speciality,
        name: professional.full_name,
        location: professional.cities?.join(', ') || professional.districts?.join(', ') || '',
        rating: professional.average_rating || 4.0, // Default rating if none provided
        image: professional.profile_image,
        experience: professional.experience_years,
        education: professional.education,
        gender: professional.gender
      }));

      setProfessionals(prev => [...prev, ...mappedProfessionals]);
      setNextPage(data.next);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      setIsLoading(false);
    }
  };

  const handleImageError = (e, id) => {
    // Fallback image if profile image fails to load
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
    e.target.onerror = null; // Prevent infinite loop
  };

  const loadMore = () => {
    if (nextPage) {
      fetchProfessionals(nextPage);
    }
  };

  return (
    <section className="listings-container">
      <div className="listings-header">
        <h2>Elanlar</h2>
        <div className="header-controls">
          <button onClick={loadMore} className="see-more-link" disabled={!nextPage}>
            <span>Daha Çox</span>
            <FiChevronDown className="arrow-icon" />
          </button>
        </div>
      </div>

      {isLoading && professionals.length === 0 ? (
        <div className="loading">Məlumatlar yüklənir...</div>
      ) : (
        <div className="listings-grid">
          {professionals.map((professional) => (
            <div className="listing-card" key={professional.id}>
              <div className="card-image-container">
                <img
                  src={professional.image}
                  alt={professional.category}
                  className="card-image"
                  loading="lazy"
                  onError={(e) => handleImageError(e, professional.id)}
                />
              </div>
              <div className="card-content">
                <div className="card-info">
                  <h3 className="card-title">{professional.category}</h3>
                  <p className="card-subtitle">{professional.name}</p>
                  <div className="card-location">
                    <FiMapPin className="location-icon" />
                    <span>{professional.location}</span>
                  </div>
                  <div className="card-experience">
                    <span>Təcrübə: {professional.experience} il</span>
                  </div>
                </div>
                <div className="card-rating">
                  <FiStar className="star-icon" />
                  <span>{professional.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && professionals.length > 0 && (
        <div className="loading">Əlavə məlumatlar yüklənir...</div>
      )}
    </section>
  );
};

export default Card;



// import React, { useState, useEffect } from 'react';
// import './card.css';
// import { FiChevronDown, FiMapPin, FiStar } from 'react-icons/fi';

// const Card = () => {
//   const [listings, setListings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const PEXELS_API_KEY = 'fGvJKwvOKYnhBypGOkTf43Aghd1eH0AAmvTh7CxopvDxIyjwLPYMCP4H';

//   const initialListings = [
//     { id: 1, category: 'Elektrik', name: 'Rəsul Quliyev', location: 'Bakı, Azərbaycan', rating: 4.5 },
//     { id: 2, category: 'Santexnik', name: 'Vüqar Məmmədov', location: 'Bakı, Azərbaycan', rating: 4.7 },
//     { id: 3, category: 'Mebel ustası', name: 'Əli Hüseynov', location: 'Sumqayıt, Azərbaycan', rating: 4.8 },
//     { id: 4, category: 'Rəngsaz', name: 'Nərmin Əliyeva', location: 'Gəncə, Azərbaycan', rating: 4.3 },
//     { id: 5, category: 'Mexanik', name: 'Orxan Əhmədov', location: 'Bakı, Azərbaycan', rating: 4.4 },
//     { id: 6, category: 'Derzi', name: 'Leyla Quliyeva', location: 'Şəki, Azərbaycan', rating: 4.6 },
//     { id: 7, category: 'Təmirçi', name: 'Elşən İbrahimov', location: 'Mingəçevir, Azərbaycan', rating: 4.9 },
//     { id: 8, category: 'Qazçı', name: 'Tural Həsənov', location: 'Xırdalan, Azərbaycan', rating: 4.2 }
//   ];

//   const categoryTranslations = {
//     'Elektrik': 'electrician',
//     'Santexnik': 'plumber',
//     'Mebel ustası': 'furniture craftsman',
//     'Rəngsaz': 'painter',
//     'Mexanik': 'car mechanic',
//     'Derzi': 'tailor',
//     'Təmirçi': 'repairman',
//     'Qazçı': 'gas technician'
//   };

//   useEffect(() => {
//     const cached = localStorage.getItem('listingsWithImages');
//     if (cached) {
//       setListings(JSON.parse(cached));
//       setIsLoading(false);
//     } else {
//       fetchAllImages();
//     }
//   }, []);

//   const fetchImage = async (category) => {
//     const englishTerm = categoryTranslations[category];
//     const randomPage = Math.floor(Math.random() * 10) + 1;
//     try {
//       const res = await fetch(
//         `https://api.pexels.com/v1/search?query=${encodeURIComponent(englishTerm)}&per_page=10&page=${randomPage}`,
//         {
//           headers: { Authorization: PEXELS_API_KEY }
//         }
//       );
//       const data = await res.json();
//       const photos = data.photos || [];
//       const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
//       return randomPhoto?.src?.medium || '';
//     } catch (error) {
//       console.error('Image fetch failed:', error);
//       return '';
//     }
//   };

//   const fetchAllImages = async () => {
//     setIsLoading(true);
//     const updatedListings = await Promise.all(
//       initialListings.map(async (item) => {
//         const image = await fetchImage(item.category);

//         // Simulate 404 error for 30% of images
//         const shouldBreak = Math.random() < 0.3;
//         return {
//           ...item,
//           image: shouldBreak ? 'https://fakebrokenurl.com/404.jpg' : image
//         };
//       })
//     );
//     setListings(updatedListings);
//     localStorage.setItem('listingsWithImages', JSON.stringify(updatedListings));
//     setIsLoading(false);
//   };

//   const handleImageError = async (listingId, category) => {
//     const newImage = await fetchImage(category);
//     setListings((prevListings) => {
//       const updated = prevListings.map((item) =>
//         item.id === listingId ? { ...item, image: newImage } : item
//       );
//       localStorage.setItem('listingsWithImages', JSON.stringify(updated));
//       return updated;
//     });
//   };

//   return (
//     <section className="listings-container">
//       <div className="listings-header">
//         <h2>Elanlar</h2>
//         <div className="header-controls">
//           <a href="#" className="see-more-link">
//             <span>Daha Çox</span>
//             <FiChevronDown className="arrow-icon" />
//           </a>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="loading">Şəkillər yüklənir...</div>
//       ) : (
//         <div className="listings-grid">
//           {listings.map((listing) => (
//             <div className="listing-card" key={listing.id}>
//               <div className="card-image-container">
//                 <img
//                   src={listing.image}
//                   alt={listing.category}
//                   className="card-image"
//                   loading="lazy"
//                   onError={(e) => {
//                     e.target.onerror = null; // prevent infinite loop
//                     handleImageError(listing.id, listing.category);
//                   }}
//                 />
//               </div>
//               <div className="card-content">
//                 <div className="card-info">
//                   <h3 className="card-title">{listing.category}</h3>
//                   <p className="card-subtitle">{listing.name}</p>
//                   <div className="card-location">
//                     <FiMapPin className="location-icon" />
//                     <span>{listing.location}</span>
//                   </div>
//                 </div>
//                 <div className="card-rating">
//                   <FiStar className="star-icon" />
//                   <span>{listing.rating}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default Card;
