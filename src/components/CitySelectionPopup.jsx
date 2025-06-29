import React, { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import axios from "axios";

export default function CitySelectionPopup({
  onSendData,
  cities: initialCities,
}) {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCities, setSelectedCities] = useState(
    initialCities.cities || []
  );
  const [selectedDistricts, setSelectedDistricts] = useState(
    initialCities.districts || []
  );
  const [activeTab, setActiveTab] = useState("cities");
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  const fetchCitiesAndDistricts = useCallback(async () => {
    try {
      const [citiesRes, districtsRes] = await Promise.all([
        axios.get("https://api.peshekar.online/api/v1/cities/"),
        axios.get("https://api.peshekar.online/api/v1/districts/"),
      ]);

      setCities(citiesRes.data.results || citiesRes.data);
      const allDistricts = districtsRes.data.results || districtsRes.data;
      setDistricts(allDistricts);

      if (initialCities.cities?.length > 0) {
        const cityIds = initialCities.cities.map((c) => c.id);
        const filtered = allDistricts.filter((d) =>
          cityIds.includes(d.city?.id || d.city)
        );
        setFilteredDistricts(filtered);
      } else {
        setFilteredDistricts(allDistricts);
      }
    } catch (error) {
      console.error("Error fetching cities or districts:", error);
    }
  }, [initialCities.cities]);

  useEffect(() => {
    fetchCitiesAndDistricts();
  }, [fetchCitiesAndDistricts]);

  const handleSelectCity = (city) => {
    const newSelectedCities = selectedCities.some((s) => s.id === city.id)
      ? selectedCities.filter((s) => s.id !== city.id)
      : [...selectedCities, city];

    setSelectedCities(newSelectedCities);

    if (newSelectedCities.length > 0) {
      const cityIds = newSelectedCities.map((c) => c.id);
      const filtered = districts.filter((d) =>
        cityIds.includes(d.city?.id || d.city)
      );
      setFilteredDistricts(filtered);

      setSelectedDistricts((prev) =>
        prev.filter((d) => filtered.some((fd) => fd.id === d.id))
      );
    } else {
      setFilteredDistricts(districts);
    }
  };

  const handleSelectDistrict = (district) => {
    setSelectedDistricts((prev) =>
      prev.some((s) => s.id === district.id)
        ? prev.filter((s) => s.id !== district.id)
        : [...prev, district]
    );
  };

  const handleConfirm = () => {
    onSendData({
      selectedCitiesForShow: selectedCities,
      selectedDistrictsForShow: selectedDistricts,
    });
  };

  const filteredCities = cities.filter((city) =>
    (city.display_name || city.name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const displayedDistricts =
    activeTab === "districts"
      ? filteredDistricts.filter((district) =>
          (district.display_name || district.name)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : [];

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1A4862]">
          Fəaliyyət göstərdiyi ərazi
        </h2>
        <button
          onClick={() =>
            onSendData({
              selectedCitiesForShow: [],
              selectedDistrictsForShow: [],
            })
          }
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6">
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Axtar..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A4862]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "cities"
                ? "text-[#1A4862] border-b-2 border-[#1A4862]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("cities")}
          >
            Şəhərlər
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "districts"
                ? "text-[#1A4862] border-b-2 border-[#1A4862]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              if (selectedCities.length === 0) {
                alert("Əvvəlcə şəhər seçməlisiniz");
                return;
              }
              setActiveTab("districts");
            }}
          >
            Rayonlar
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto pr-2">
          {activeTab === "cities"
            ? filteredCities.map((city,) => (
                <label
                  key={`city-${city.id}`}
                  className="flex items-center text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#1A4862] rounded"
                    checked={selectedCities.some((s) => s.id === city.id)}
                    onChange={() => handleSelectCity(city)}
                  />
                  <span className="ml-2">{city.display_name || city.name}</span>
                </label>
              ))
            : displayedDistricts.map((district) => (
                <label
                  key={`district-${district.id}`}
                  className="flex items-center text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#1A4862] rounded"
                    checked={selectedDistricts.some(
                      (s) => s.id === district.id
                    )}
                    onChange={() => handleSelectDistrict(district)}
                  />
                  <span
                    className="ml-2"
                    key={`selected-district-${district.id}`}
                  >
                    {district.display_name || district.name}
                  </span>
                </label>
              ))}
        </div>

        {selectedCities.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-[#1A4862] mb-2">
              Seçilmiş şəhərlər:
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedCities.map((city) => (
                <span
                  key={`selected-city-${city.id}`}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                >
                  {city.display_name || city.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedDistricts.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-[#1A4862] mb-2">
              Seçilmiş rayonlar:
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedDistricts.map((district) => (
                <span
                  key={district.id}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                >
                  {district.display_name || district.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-200 mt-auto">
        <button
          className="w-full bg-[#1A4862] text-white py-3 rounded-md font-semibold hover:bg-[#1A4862]/90 transition-colors"
          onClick={handleConfirm}
        >
          Təsdiqlə
        </button>
      </div>
    </div>
  );
}
