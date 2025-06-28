"use client"

import React, { useState, useEffect } from "react"

export default function CitySelectionPopup({ onSendData, cities: initialCitiesForShow }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCities, setSelectedCities] = useState(initialCitiesForShow.cities || [])
  const [selectedDistricts, setSelectedDistricts] = useState(initialCitiesForShow.distinc || [])
  const [allCities, setAllCities] = useState([])
  const [allDistricts, setAllDistricts] = useState([])
  const [bakuDistricts, setBakuDistricts] = useState([])
  const [isBakuOpen, setIsBakuOpen] = useState(false)

  useEffect(() => {
    // Fetch all cities
    fetch("https://api.peshekar.online/api/v1/cities/")
      .then((res) => res.json())
      .then((data) => {
        setAllCities(data)
      })
      .catch((error) => console.error("Şəhərləri yükləmək mümkün olmadı:", error))

    // Fetch all districts and separate Baku districts
    fetch("https://api.peshekar.online/api/v1/districts/")
      .then((res) => res.json())
      .then((data) => {
        const baku = data.find((item) => item.display_name === "Bakı")
        if (baku && baku.sub_districts) {
          setBakuDistricts(baku.sub_districts)
        }
        const otherDistricts = data.filter((item) => item.display_name !== "Bakı")
        setAllDistricts(otherDistricts)
      })
      .catch((error) => console.error("Rayonları yükləmək mümkün olmadı:", error))
  }, [])

  const normalizeAz = (str) => {
    return str
      .toLowerCase()
      .replace(/ə/g, "e")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ü/g, "u")
      .replace(/ç/g, "c")
      .replace(/ş/g, "s")
      .replace(/ğ/g, "g")
  }

  const filteredAllCities = allCities.filter((city) => normalizeAz(city.display_name).includes(normalizeAz(searchTerm)))

  const filteredAllDistricts = allDistricts.filter((district) =>
    normalizeAz(district.display_name).includes(normalizeAz(searchTerm)),
  )

  const filteredBakuDistricts = bakuDistricts.filter((district) =>
    normalizeAz(district.display_name).includes(normalizeAz(searchTerm)),
  )

  const handleCityToggle = (city) => {
    setSelectedCities((prev) =>
      prev.some((c) => c.id === city.id) ? prev.filter((c) => c.id !== city.id) : [...prev, city],
    )
  }

  const handleDistrictToggle = (district) => {
    setSelectedDistricts((prev) =>
      prev.some((d) => d.id === district.id) ? prev.filter((d) => d.id !== district.id) : [...prev, district],
    )
  }

  const handleConfirm = () => {
    onSendData({
      selectedCitiesForShow: selectedCities,
      selectedDistrictsForShow: selectedDistricts,
    })
  }

  const handleClose = () => {
    onSendData({
      selectedCitiesForShow: initialCitiesForShow.cities,
      selectedDistrictsForShow: initialCitiesForShow.distinc,
    })
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#1A4862]">Fəaliyyət göstərdiyi ərazi</h2>
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">
          &times;
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Şəhər və ya rayon axtar..."
          className="w-full p-2 border border-[#C3C8D1] rounded-lg outline-none text-[#1A4862] font-semibold"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-grow overflow-y-auto pr-2">
        {/* Baku and its districts */}
        {bakuDistricts.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsBakuOpen(!isBakuOpen)}>
              <input
                type="checkbox"
                id="baku-city"
                checked={
                  selectedCities.some((c) => c.display_name === "Bakı") ||
                  selectedDistricts.some((d) => bakuDistricts.some((bd) => bd.id === d.id))
                }
                onChange={() => {
                  // Toggle Baku city itself if it exists in allCities
                  const bakuCity = allCities.find((c) => c.display_name === "Bakı")
                  if (bakuCity) {
                    handleCityToggle(bakuCity)
                  }
                  // Toggle all Baku districts
                  if (selectedDistricts.some((d) => bakuDistricts.some((bd) => bd.id === d.id))) {
                    setSelectedDistricts((prev) => prev.filter((d) => !bakuDistricts.some((bd) => bd.id === d.id)))
                  } else {
                    setSelectedDistricts((prev) => [
                      ...prev,
                      ...bakuDistricts.filter((bd) => !prev.some((p) => p.id === bd.id)),
                    ])
                  }
                }}
              />
              <label htmlFor="baku-city" className="font-bold text-[#1A4862]">
                Bakı
              </label>
              <svg
                className={`w-4 h-4 transition-transform ${isBakuOpen ? "rotate-180" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {isBakuOpen && (
              <div className="ml-4 mt-2 grid grid-cols-2 gap-2">
                {filteredBakuDistricts.map((district) => (
                  <div key={district.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`district-${district.id}`}
                      checked={selectedDistricts.some((d) => d.id === district.id)}
                      onChange={() => handleDistrictToggle(district)}
                    />
                    <label htmlFor={`district-${district.id}`}>{district.display_name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other cities */}
        {filteredAllCities.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-[#1A4862] mb-2">Digər Şəhərlər</h3>
            <div className="grid grid-cols-2 gap-2">
              {filteredAllCities.map((city) => (
                <div key={city.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`city-${city.id}`}
                    checked={selectedCities.some((c) => c.id === city.id)}
                    onChange={() => handleCityToggle(city)}
                  />
                  <label htmlFor={`city-${city.id}`}>{city.display_name}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other districts (if any, not part of Baku) */}
        {filteredAllDistricts.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-[#1A4862] mb-2">Digər Rayonlar</h3>
            <div className="grid grid-cols-2 gap-2">
              {filteredAllDistricts.map((district) => (
                <div key={district.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`other-district-${district.id}`}
                    checked={selectedDistricts.some((d) => d.id === district.id)}
                    onChange={() => handleDistrictToggle(district)}
                  />
                  <label htmlFor={`other-district-${district.id}`}>{district.display_name}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={handleClose}
        >
          Ləğv et
        </button>
        <button
          className="px-6 py-2 bg-[#1A4862] text-white rounded-lg hover:bg-[#255C80] transition-colors"
          onClick={handleConfirm}
        >
          Təsdiqlə
        </button>
      </div>
    </div>
  )
}
