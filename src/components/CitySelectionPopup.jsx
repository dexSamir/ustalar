
import React, { useState, useEffect, useCallback } from "react"
import { Search, X } from "lucide-react"
import axios from "axios"

export default function CitySelectionPopup({ onSendData, cities: initialCities }) {
  const [cities, setCities] = useState([])
  const [districts, setDistricts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCities, setSelectedCities] = useState(initialCities.cities || [])
  const [selectedDistricts, setSelectedDistricts] = useState(initialCities.districts || [])
  const [activeTab, setActiveTab] = useState("cities")

  const fetchCitiesAndDistricts = useCallback(async () => {
    try {
      const [citiesRes, districtsRes] = await Promise.all([
        axios.get("https://api.peshekar.online/api/v1/cities/"),
        axios.get("https://api.peshekar.online/api/v1/districts/"),
      ])
      setCities(citiesRes.data.results || citiesRes.data)
      setDistricts(districtsRes.data.results || districtsRes.data)
    } catch (error) {
      console.error("Error fetching cities or districts:", error)
    }
  }, [])

  useEffect(() => {
    fetchCitiesAndDistricts()
  }, [fetchCitiesAndDistricts])

  const handleSelect = (item, type) => {
    if (type === "city") {
      setSelectedCities((prev) =>
        prev.some((s) => s.id === item.id) ? prev.filter((s) => s.id !== item.id) : [...prev, item],
      )
    } else {
      setSelectedDistricts((prev) =>
        prev.some((s) => s.id === item.id) ? prev.filter((s) => s.id !== item.id) : [...prev, item],
      )
    }
  }

  const handleConfirm = () => {
    const allSelectedIds = [...selectedCities.map((c) => c.id), ...selectedDistricts.map((d) => d.id)]
    onSendData({
      cities: allSelectedIds,
      selectedCitiesForShow: selectedCities,
      selectedDistrictsForShow: selectedDistricts,
    })
  }

  const filteredCities = cities.filter((city) =>
    (city.display_name || city.name).toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const filteredDistricts = districts.filter((district) =>
    (district.display_name || district.name).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1A4862]">Fəaliyyət göstərdiyi ərazi</h2>
        <button
          onClick={() => onSendData({ cities: [], selectedCitiesForShow: [], selectedDistrictsForShow: [] })}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
            onClick={() => setActiveTab("districts")}
          >
            Rayonlar
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto pr-2">
          {activeTab === "cities"
            ? filteredCities.map((city) => (
                <label key={city.id} className="flex items-center text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#1A4862] rounded"
                    checked={selectedCities.some((s) => s.id === city.id)}
                    onChange={() => handleSelect(city, "city")}
                  />
                  <span className="ml-2">{city.display_name || city.name}</span>
                </label>
              ))
            : filteredDistricts.map((district) => (
                <label key={district.id} className="flex items-center text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#1A4862] rounded"
                    checked={selectedDistricts.some((s) => s.id === district.id)}
                    onChange={() => handleSelect(district, "district")}
                  />
                  <span className="ml-2">{district.display_name || district.name}</span>
                </label>
              ))}
        </div>
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
  )
}
