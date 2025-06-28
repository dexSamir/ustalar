import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function EcomSidebar({ onFilterChange }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isCityOpen, setIsCityOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isExperienceOpen, setIsExperienceOpen] = useState(true);

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);

  const prevFiltersRef = useRef({
    categories: [],
    cities: [],
    ratings: [],
    experience: [],
  });

  const ratingOptions = [
    { label: "4.5 Ulduz və Üzəri", value: "4.5" },
    { label: "4 Ulduz və Üzəri", value: "4" },
    { label: "3 Ulduz və Üzəri", value: "3" },
    { label: "2 Ulduz və Üzəri", value: "2" },
    { label: "1 Ulduz və Üzəri", value: "1" },
  ];

  const experienceOptions = [
    { label: "10-15 il", value: "10-15" },
    { label: "5-10 il", value: "5-10" },
    { label: "1-3 il", value: "1-3" },
  ];

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [categoriesRes, citiesRes, servicesRes] = await Promise.all([
          fetch("https://masters-1.onrender.com/api/v1/categories/"),
          fetch("https://masters-1.onrender.com/api/v1/services/"),
          fetch("https://masters-1.onrender.com/api/v1/cities/"),
        ]);

        const categoriesData = await categoriesRes.json();
        const citiesData = await citiesRes.json();
        const servicesData = await servicesRes.json();

        setCategories(categoriesData.results || categoriesData);
        setCities(citiesData.results || citiesData);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchFilterData();
  }, []);

  useEffect(() => {
    const currentFilters = {
      categories: selectedCategories,
      cities: selectedCities,
      ratings: selectedRatings,
      experience: selectedExperience,
    };

    const areArraysEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      const sortedArr1 = [...arr1].sort();
      const sortedArr2 = [...arr2].sort();
      for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) return false;
      }
      return true;
    };

    const prevFilters = prevFiltersRef.current;

    if (
      !areArraysEqual(prevFilters.categories, currentFilters.categories) ||
      !areArraysEqual(prevFilters.cities, currentFilters.cities) ||
      !areArraysEqual(prevFilters.ratings, currentFilters.ratings) ||
      !areArraysEqual(prevFilters.experience, currentFilters.experience)
    ) {
      onFilterChange(currentFilters);
      prevFiltersRef.current = currentFilters;
    }
  }, [
    selectedCategories,
    selectedCities,
    selectedRatings,
    selectedExperience,
    onFilterChange,
  ]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCityChange = (cityId) => {
    setSelectedCities((prev) =>
      prev.includes(cityId)
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId]
    );
  };

  const handleRatingChange = (ratingValue) => {
    setSelectedRatings((prev) =>
      prev.includes(ratingValue)
        ? prev.filter((val) => val !== ratingValue)
        : [...prev, ratingValue]
    );
  };

  const handleExperienceChange = (experienceValue) => {
    setSelectedExperience((prev) =>
      prev.includes(experienceValue)
        ? prev.filter((val) => val !== experienceValue)
        : [...prev, experienceValue]
    );
  };

  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow-md">
      <h2 className="font-bold text-xl mb-6">Filtrlər</h2>

      <div className="mb-6">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full flex justify-between items-center text-lg font-semibold py-2 px-4 hover:bg-gray-100 rounded-md"
        >
          Peşə sahəsi
          {isCategoryOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {isCategoryOpen && (
          <div className="mt-4 space-y-2 px-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-gray-700"
                >
                  {category.display_name || category.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={() => setIsCityOpen(!isCityOpen)}
          className="w-full flex justify-between items-center text-lg font-semibold py-2 px-4 hover:bg-gray-100 rounded-md"
        >
          Şəhər/Rayon
          {isCityOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {isCityOpen && (
          <div className="mt-4 space-y-2 px-4">
            {cities.map((city) => (
              <div key={city.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`city-${city.id}`}
                  checked={selectedCities.includes(city.id)}
                  onChange={() => handleCityChange(city.id)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`city-${city.id}`} className="text-gray-700">
                  {city.display_name || city.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={() => setIsRatingOpen(!isRatingOpen)}
          className="w-full flex justify-between items-center text-lg font-semibold py-2 px-4 hover:bg-gray-100 rounded-md"
        >
          Reytinq
          {isRatingOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {isRatingOpen && (
          <div className="mt-4 space-y-2 px-4">
            {ratingOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`rating-${option.value}`}
                  checked={selectedRatings.includes(option.value)}
                  onChange={() => handleRatingChange(option.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`rating-${option.value}`}
                  className="text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={() => setIsExperienceOpen(!isExperienceOpen)}
          className="w-full flex justify-between items-center text-lg font-semibold py-2 px-4 hover:bg-gray-100 rounded-md"
        >
          Təcrübə
          {isExperienceOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {isExperienceOpen && (
          <div className="mt-4 space-y-2 px-4">
            {experienceOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`experience-${option.value}`}
                  checked={selectedExperience.includes(option.value)}
                  onChange={() => handleExperienceChange(option.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`experience-${option.value}`}
                  className="text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}