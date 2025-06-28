import React from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `https://masters-1.onrender.com${path}`;
};

export default function EcomCard({
  professional,
  categoryName,
  specialityName,
  cityNames,
}) {
  const displayRating = professional.rating?.toFixed(1) || "N/A";
  const displayReviewCount = professional.reviewCount || 0;
  const displayTags = professional.tags || [];
  const locationText =
    cityNames && cityNames.length > 0 ? cityNames.join(", ") : "Yer yoxdur";

  return (
    <div className="w-[300px] h-[400px] rounded-lg shadow-md overflow-hidden bg-white flex flex-col">
      <div className="relative w-full h-48">
        <img
          src={getImageUrl(professional.profile_image) || "/placeholder.svg"}
          alt={`${professional.first_name} ${professional.last_name}`}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-1">
          {professional.first_name} {professional.last_name}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {categoryName}
          {specialityName && ` - ${specialityName}`}
        </p>
        <div className="flex items-center mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-sm font-semibold">{displayRating}</span>
          <span className="text-sm text-gray-500 ml-2">
            ({displayReviewCount} rəy)
          </span>
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{locationText}</span>
        </div>
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {displayTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#cde4f2] text-[#1a4862]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto">
          <Link to={`/reviews/${professional.id}`}>
            {" "}
            <button className="w-full bg-[#1A4862] text-white py-2 rounded-lg font-medium hover:bg-[#1A4862]/90 transition-colors">
              Ətraflı
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}