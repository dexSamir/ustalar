import React, { useEffect, useState } from "react";
import axios from "axios";
import { SlClose } from "react-icons/sl";
import { IoIosArrowForward } from "react-icons/io";

const CitySelectionPopup = ({ cities, onSendData }) => {
  const [citiesFromParent, setCitiesFromParent] = useState([]);
  const [searchedCities, setSearchedCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [cityDistincs, setCityDistincs] = useState({});
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const getCities = () => {
    axios
      .get("https://masters-1.onrender.com/api/v1/cities/")
      .then((response) => {
        const sorted = response.data.sort((a, b) => a.id === 1 ? -1 : b.id === 1 ? 1 : 0);
        setCitiesFromParent(sorted);
        setSearchedCities(sorted);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const toggleDistrict = (district, cityId) => {
    const exists = selectedDistricts.some(
      (d) => d.id === district.id && d.cityId === cityId
    );

    if (exists) {
      setSelectedDistricts((prev) =>
        prev.filter((d) => !(d.id === district.id && d.cityId === cityId))
      );
    } else {
      setSelectedDistricts((prev) => [...prev, { ...district, cityId }]);
    }
  };

  useEffect(() => {
    getCities();
  }, []);

  const getDistincs = () => {
    axios
      .get("https://masters-1.onrender.com/api/v1/cities/1/districts")
      .then((response) => {
        setCityDistincs((prev) => ({
          ...prev,
          1: response.data,
        }));
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
      });
  };

  useEffect(() => {
    getDistincs();
  }, []);

  const deleteSelected = (index) => {
    setSelectedCities((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ]);
  };

  const sendDataToParent = () => {
    const citiesForSendParent = selectedCities.map((item) => item.id);
    const districtsForSendParent = selectedDistricts.map((item) => item.id);

    onSendData({
      cities: citiesForSendParent,
      districts: districtsForSendParent,
    });
  };

  const searchCities = (e) => {
    const { value } = e.target;
    value.length > 0
      ? setSearchedCities(
          citiesFromParent.filter((x) =>
            x.display_name.toLowerCase().includes(value.toLowerCase())
          )
        )
      : setSearchedCities(citiesFromParent);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full rounded-2xl p-6">
      <div className="flex flex-col items-center w-[30%] m-auto">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Fəaliyyət ərazisi seçin
        </h2>
        <div className="w-full flex">
          <div className="w-[15%] bg-white flex justify-center items-center rounded-tl-md rounded-bl-md">
            <img src="../../public/search-normal.svg" alt="" />
          </div>
          <input
            type="text"
            placeholder="Şəhər və ya rayon axtar"
            onInput={searchCities}
            className="w-[85%] px-4 py-2 rounded-tr-md rounded-br-md border border-l-0 bg-white  border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="flex gap-4 w-full h-[80%] rounded-2xl p-6">
        <div className="w-[70%] h-full">
          <div className="bg-white rounded-lg p-4 h-full overflow-y-scroll">
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              {searchedCities.map((item) => (
                <div key={item.id} className="break-inside-avoid">
                  <div className="flex items-center flex-wrap">
                    <input
                      type="checkbox"
                      id={`city-${item.id}`}
                      checked={selectedCities.some((c) => c.id === item.id)}
                      onChange={() => {
                        if (selectedCities.some((c) => c.id === item.id)) {
                          setSelectedCities((prev) =>
                            prev.filter((i) => i.id !== item.id)
                          );
                        } else {
                          setSelectedCities((prev) => [...prev, item]);
                        }
                      }}
                      className="accent-blue-500 w-4 h-4"
                    />
                    <label
                      htmlFor={`city-${item.id}`}
                      className="ml-2 text-cyan-900 font-semibold"
                    >
                      {item.display_name}
                    </label>
                  </div>

                  {item.id === 1 && cityDistincs[1] && (
                    <div className="mt-2 ml-6 flex flex-col gap-1">
                      {cityDistincs[1].map((district) => (
                        <div key={district.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`district-${district.id}`}
                            checked={selectedDistricts.some(
                              (d) => d.id === district.id
                            )}
                            onChange={() => toggleDistrict(district, 1)}
                            className="accent-blue-400 w-4 h-4"
                          />
                          <label
                            htmlFor={`district-${district.id}`}
                            className="ml-2 text-cyan-800"
                          >
                            {district.display_name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[30%] h-full flex flex-col justify-between">
          <div className="text-white">
            <h3 className="text-lg font-semibold mb-2">Seçilmiş ərazilər :</h3>
            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-auto pr-2">
              {selectedCities.map((item, index) => (
                <div
                  key={index}
                  className="bg-white text-cyan-900 rounded-2xl w-max px-3 py-1 flex items-center shadow-sm"
                >
                  <span>{item.display_name}</span>
                  <SlClose
                    className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={() => deleteSelected(index)}
                  />
                </div>
              ))}
              {selectedDistricts.map((district) => (
                <div
                  key={`district-${district.id}`}
                  className="bg-white text-cyan-900 rounded-2xl w-max px-3 py-1 flex items-center shadow-sm"
                >
                  <span>{district.display_name}</span>
                  <SlClose
                    className="ml-2 cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={() =>
                      setSelectedDistricts((prev) =>
                        prev.filter((d) => d.id !== district.id)
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => {
                setSelectedCities([]);
                setSelectedDistricts([]);
              }}
              className="bg-white text-gray-700 px-6 py-3 rounded-lg shadow hover:bg-gray-100 flex items-center gap-4"
            >
              <span>Sıfırla</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22"
                />
              </svg>
            </button>
            <button
              onClick={sendDataToParent}
              className="bg-cyan-900 flex items-center justify-center text-white px-8 py-3 rounded-lg shadow hover:bg-blue-800"
            >
              <span>Tamamla</span> <IoIosArrowForward className="mt-[5px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySelectionPopup;
