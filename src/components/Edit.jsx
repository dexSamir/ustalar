import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { az } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, subYears, isValid } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import addsvg from "../assets/add.svg";
import calendarsvg from "../assets/calendar.svg";
import callsvg from "../assets/call.svg";
import cinssvg from "../assets/cins.svg";
import closesvg from "../assets/close.svg";
import datasvg from "../assets/data.svg";
import educationsvg from "../assets/education.svg";
import facebooksvg from "../assets/facebook.svg";
import infosvg from "../assets/info.svg";
import instagramsvg from "../assets/instagram.svg";
import linkedinsvg from "../assets/linkedin.svg";
import locationsvg from "../assets/location.svg";
import locksvg from "../assets/lock.svg";
import logsvg from "../assets/log.svg";
import placesvg from "../assets/place.svg";
import practicesvg from "../assets/practice.svg";
import savesvg from "../assets/save.svg";
import schoolsvg from "../assets/school.svg";
import teachersvg from "../assets/teacher.svg";
import tiktoksvg from "../assets/tiktok.svg";
import trashsvg from "../assets/trash.svg";
import usersvg from "../assets/user.svg";
import worksvg from "../assets/work.svg";
import axios from "axios";
import Sidebar from "../sidebar";
import CitySelectionPopup from "./CitySelectionPopup";
import { Eye, EyeOff } from "lucide-react";

export default function Edit() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [showSaveSuccessPopup, setShowSaveSuccessPopup] = useState(false);
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false);
  const [visible, setVisible] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [tempImagePreview, setTempImagePreview] = useState(null);
  const [zoom, setZoom] = useState(50);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [location, setLocation] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [activityAreaError, setActivityAreaError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [servicies, setServicies] = useState([]);
  const [language, setLanguage] = useState([]);
  const [note, setNote] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [bakuDistricts, setBakuDistricts] = useState([]);
  const [isBakuOpen, setIsBakuOpen] = useState(false);
  const [filteredBakuDistricts, setFilteredBakuDistricts] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState("");

  const [professionArea, setProfessionArea] = useState("");
  const [professionAreaError, setProfessionAreaError] = useState("");
  const [professionSpecialization, setProfessionSpecialization] = useState("");
  const [professionSpecializationError, setProfessionSpecializationError] =
    useState("");
  const [otherSpecializationInput, setOtherSpecializationInput] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [workExperienceError, setWorkExperienceError] = useState("");
  const [activityArea, setActivityArea] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [profileImageSrc, setProfileImageSrc] = useState(
    "/placeholder.svg?height=120&width=120"
  );

  const [educationLevel, setEducationLevel] = useState("");
  const [educationLevelError, setEducationLevelError] = useState("");
  const [educationSpecialization, setEducationSpecialization] = useState("");
  const [educationSpecializationError, setEducationSpecializationError] =
    useState("");
  const [languages, setLanguages] = useState([]);
  const [languageSkillsError, setLanguageSkillsError] = useState("");
  const [citiesForShow, setCitiesForShow] = useState({
    cities: [],
    districts: [],
  });

  const registrationDate = new Date("2025-08-11");
  const formattedRegistrationDate = format(registrationDate, "dd MMMM");

  const isAzerbaijaniLetter = (char) => {
    return /^[a-zA-ZçÇəƏğĞıİöÖşŞüÜ]+$/.test(char);
  };

  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    tiktok: "",
    linkedin: "",
  });

  const educationMap = {
    "Tam ali": 1,
    "Natamam ali": 2,
    Orta: 3,
    "Peşə təhsili": 4,
    "Orta ixtisas təhsili": 5,
    Yoxdur: 6,
  };

  const genderMap = {
    Qadın: "FEMALE",
    Kişi: "MALE",
  };

  const fetchUserData = async (
    fetchedCategories,
    fetchedAllServices,
    fetchedLanguages,
    fetchedLocations
  ) => {
    let token = localStorage.getItem("authToken");

    if (!token) {
      await loginUser();
      token = localStorage.getItem("authToken");
    }

    if (!token) {
      console.error("Token yoxdur. Profil məlumatları alına bilməz.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://api.peshekar.online/api/v1/profile/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profil məlumatları:", response.data);

      const data = response.data;

      let firstName = "";
      let lastName = "";
      if (data.full_name) {
        const nameParts = data.full_name.split(" ");
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }

      setUserData(data);

      const formattedWorkImages =
        data.work_images?.map((item) => {
          const url = item.replace("İş Şəkli ", "");
          return {
            url: url,
            name: url.split("/").pop(),
          };
        }) || [];

      setUploadedImages(formattedWorkImages);

      setFirstName(firstName);
      setLastName(lastName);
      setBirthDate(data.birth_date ? new Date(data.birth_date) : null);
      setMobileNumber(data.mobile_number || "");
      setPassword(data.password || "");
      setGender(data.gender || "");

      if (typeof data.profession_area === "string") {
        const category = fetchedCategories.find(
          (c) => c.display_name === data.profession_area
        );
        if (category) {
          setProfessionArea(category.id);
          const filtered = fetchedAllServices.filter(
            (service) => service.category.id === category.id
          );
          setFilteredServices(filtered);
        }
      } else if (data.profession_area?.id) {
        setProfessionArea(data.profession_area.id);
        const filtered = fetchedAllServices.filter(
          (service) => service.category.id === data.profession_area.id
        );
        setFilteredServices(filtered);
      }

      if (data.profession_speciality) {
        let foundServiceId = "";
        let specialityDisplayName = "";

        if (data.profession_speciality.id) {
          foundServiceId = data.profession_speciality.id;
          specialityDisplayName = data.profession_speciality.display_name || "";
        } else if (typeof data.profession_speciality === "string") {
          specialityDisplayName = data.profession_speciality.trim();

          let service = fetchedAllServices.find(
            (s) => s.display_name.trim() === specialityDisplayName
          );

          if (!service) {
            const normalizedSpeciality = specialityDisplayName.toLowerCase();
            service = fetchedAllServices.find(
              (s) =>
                s.display_name.toLowerCase().trim() === normalizedSpeciality
            );
          }

          if (!service) {
            service = fetchedAllServices.find((s) => {
              if (s.category && s.category.display_name) {
                const fullDisplayName = `${s.display_name.trim()} (${s.category.display_name.trim()})`;
                return (
                  fullDisplayName.toLowerCase() ===
                  specialityDisplayName.toLowerCase()
                );
              }
              return false;
            });
          }

          if (
            !service &&
            specialityDisplayName.includes("(") &&
            specialityDisplayName.includes(")")
          ) {
            const serviceNameOnly = specialityDisplayName
              .substring(0, specialityDisplayName.indexOf("("))
              .trim();
            service = fetchedAllServices.find(
              (s) =>
                s.display_name.toLowerCase().trim() ===
                serviceNameOnly.toLowerCase()
            );
          }

          if (service) {
            foundServiceId = service.id;
          }
        }

        setProfessionSpecialization(foundServiceId);
        setOtherSpecializationInput("");
      } else {
        setProfessionSpecialization("");
        setOtherSpecializationInput("");
      }

      setWorkExperience(data.experience_years || "");
      setEducationLevel(data.education || "");
      setEducationSpecialization(data.education_speciality || "");
      setNote(data.note || "");

      setLanguages(
        data.languages
          ?.map((lang) => {
            if (typeof lang === "string") {
              const langObj = fetchedLanguages.find(
                (l) => l.display_name === lang
              );
              return langObj ? langObj.id : null;
            }
            return lang.id || null;
          })
          .filter(Boolean) || []
      );
      setProfileImageSrc(
        data.profile_image || "/placeholder.svg?height=120&width=120"
      );

      if (data.cities || data.districts) {
        const allAvailableCities = fetchedLocations;
        const allAvailableDistricts = [...districts, ...bakuDistricts];

        const selectedCities = Array.isArray(data.cities)
          ? data.cities
              .map((cityName) => {
                const cityObj = allAvailableCities.find(
                  (c) => c.display_name === cityName
                );
                return cityObj
                  ? { id: cityObj.id, display_name: cityObj.display_name }
                  : null;
              })
              .filter(Boolean)
          : [];

        const selectedDistricts = Array.isArray(data.districts)
          ? data.districts
              .map((districtName) => {
                const districtObj = allAvailableDistricts.find(
                  (d) => d.display_name === districtName
                );
                return districtObj
                  ? {
                      id: districtObj.id,
                      display_name: districtObj.display_name,
                    }
                  : null;
              })
              .filter(Boolean)
          : [];

        setCitiesForShow({
          cities: selectedCities,
          districts: selectedDistricts,
        });
      }

      setSocialLinks({
        facebook: data.facebook || "",
        instagram: data.instagram || "",
        tiktok: data.tiktok || "",
        linkedin: data.linkedin || "",
      });
    } catch (error) {
      console.error("Profil məlumatları yüklənərkən xəta:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(professionSpecialization);
  }, [professionSpecialization]);

  const loginUser = async () => {
    try {
      const response = await axios.post(
        "https://api.peshekar.online/api/v1/login/",
        {
          mobile_number: mobileNumber,
          password: password,
        }
      );

      const token = response.data.access || response.data.token;
      if (token) {
        localStorage.setItem("authToken", token);
        console.log("Token alındı:", token);
      } else {
        console.error("Token cavabda tapılmadı:", response.data);
      }
    } catch (error) {
      console.error("Login xətası:", error.response?.data || error.message);
    }
  };

  const getProfile = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        "https://api.peshekar.online/api/v1/profile/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("🟢 Profil məlumatı:", response.data);
    } catch (error) {
      console.error(
        "🔴 Profil alınmadı:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetch("https://api.peshekar.online/api/v1/districts/")
      .then((res) => res.json())
      .then((data) => {
        const baku = data.find((item) => item.display_name === "Bakı");
        console.log(data);
        if (baku && baku.sub_districts) {
          setBakuDistricts(baku.sub_districts);
        }
        const filtered = data.filter((item) => item.display_name !== "Bakı");
        setDistricts(filtered);
      });
  }, []);

  const updateProfile = async () => {
    const token = localStorage.getItem("authToken");

    const formData = new FormData();

    if (firstName !== userData.first_name) {
      formData.append("first_name", firstName);
    }
    if (lastName !== userData.last_name) {
      formData.append("last_name", lastName);
    }

    const formattedBirthDate = new Date(birthDate).toISOString().split("T")[0];

    if (birthDate !== userData.birth_date) {
      const formattedDate = birthDate ? format(birthDate, "yyyy-MM-dd") : "";
      formData.append("birth_date", formattedDate);
    }
    if (gender !== userData.gender)
      formData.append("gender", genderMap[gender]);

    if (mobileNumber !== userData.mobile_number) {
      formData.append("mobile_number", `${mobileNumber}`);
    }

    if (professionArea !== userData.profession_area?.id) {
      formData.append("profession_area", professionArea);
    }

    if (professionSpecialization !== userData.profession_speciality?.id) {
      formData.append("profession_speciality", professionSpecialization);
    }

    if (Number(workExperience) !== userData.experience_years) {
      formData.append("experience_years", Number(workExperience));
    }
    if (educationLevel !== userData.education) {
      formData.append("education", educationMap[educationLevel]);

      if (educationLevel === "Yoxdur") {
        formData.append("education_speciality", "");
      } else if (educationSpecialization !== userData.education_speciality) {
        formData.append("education_speciality", educationSpecialization);
      }
    } else if (
      educationLevel !== "Yoxdur" &&
      educationSpecialization !== userData.education_speciality
    ) {
      formData.append("education_speciality", educationSpecialization);
    }

    if (note !== userData.note) {
      formData.append("note", note);
    }

    formData.delete("languages");
    languages
      .filter((langId) => !isNaN(langId))
      .forEach((langId) => {
        formData.append("languages", langId.toString());
      });

    citiesForShow.cities.forEach((city) => {
      if (!userData.cities?.some((c) => c.id === city.id)) {
        formData.append("cities", Number(city.id));
      }
    });

    citiesForShow.districts.forEach((district) =>
      formData.append("districts", Number(district.id))
    );

    userData.cities?.forEach((city) => {
      if (!citiesForShow.cities.some((c) => c.id === city.id)) {
        formData.append("remove_cities", Number(city.id));
      }
    });

    if (selectedImageFile) {
      formData.append("profile_image", selectedImageFile);
    }

    uploadedImages.forEach((image) => {
      if (image.file instanceof File) {
        formData.append("work_images", image.file);
      }
    });

    if (socialLinks.facebook !== userData.facebook) {
      formData.append("facebook", socialLinks.facebook);
    }
    if (socialLinks.instagram !== userData.instagram) {
      formData.append("instagram", socialLinks.instagram);
    }
    if (socialLinks.tiktok !== userData.tiktok) {
      formData.append("tiktok", socialLinks.tiktok);
    }
    if (socialLinks.linkedin !== userData.linkedin) {
      formData.append("linkedin", socialLinks.linkedin);
    }

    console.log("🟡 Form məlumatları:");
    console.log("first_name:", firstName);
    console.log("last_name:", lastName);
    console.log("birth_date:", formattedBirthDate);
    console.log("gender:", gender.toUpperCase());
    console.log("mobile_number:", mobileNumber);
    console.log("profession_speciality:", professionSpecialization);
    console.log("experience_years:", workExperience);
    console.log("education:", educationLevel);
    console.log("education_speciality:", educationSpecialization);
    console.log("languages:", languages);
    console.log("profile_image:", selectedImageFile);
    console.log("Note", note);
    console.log(
      "Selected Cities (IDs):",
      citiesForShow.cities.map((c) => c.id)
    );
    console.log(
      "Selected Districts (IDs):",
      citiesForShow.districts.map((d) => d.id)
    );

    console.log("📦 formData.entries():");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await axios.patch(
        "https://api.peshekar.online/api/v1/profile/update/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data);
      setShowSaveSuccessPopup(true);
    } catch (error) {
      console.error(
        "🔴 Yeniləmə xətası:",
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteAccountClick = async () => {
    const token = localStorage.getItem("authToken");
    setShowDeleteConfirmPopup(false);

    try {
      const response = await axios.delete(
        "https://api.peshekar.online/api/v1/profile/delete/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Hesab uğurla silindi:", response.data);

      localStorage.removeItem("authToken");
      setShowSuccessPopup(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(
        "Hesab silinərkən xəta:",
        error.response?.data || error.message
      );
    }
  };

  const handleShowpopSuccess = () => {
    setShowDeleteConfirmPopup(false);
    handleDeleteAccount();
  };

  const validateFirstName = (name) => {
    if (!name.trim()) {
      setFirstNameError("Zəhmət olmasa, məlumatları daxil edin.");
      return false;
    }

    const azRegex =
      /^[AaBbCcÇçDdEeƏəFfGgĞğHhXxIıİiJjKkLlMmNnOoÖöPpQqRrSsŞşTtUuÜüVvYyZz\s]+$/;

    if (!azRegex.test(name)) {
      setFirstNameError("Yalnız Azərbaycan hərfləri ilə yazılmalıdır.");
      return false;
    }

    if (name.length > 20) {
      setFirstNameError("Maksimum 20 simvol.");
      return false;
    }

    setFirstNameError("");
    return true;
  };

  const validateLastName = (surname) => {
    if (!surname.trim()) {
      setLastNameError("Zəhmət olmasa, məlumatları daxil edin.");
      return false;
    }

    const azRegex =
      /^[AaBbCcÇçDdEeƏəFfGgĞğHhXxIıİiJjKkLlMmNnOoÖöPpQqRrSsŞşTtUuÜüVvYyZz\s]+$/;
    if (!azRegex.test(surname)) {
      setLastNameError("Yalnız Azərbaycan hərfləri ilə yazılmalıdır.");
      return false;
    }

    if (surname.length > 20) {
      setLastNameError("Maksimum 20 simvol.");
      return false;
    }

    setLastNameError("");
    return true;
  };

  const validateBirthDate = (date) => {
    if (!date) {
      setBirthDateError("Zəhmət olmasa, məlumatları daxil edin.");
      return false;
    }

    if (date instanceof Date) {
      const minDate = subYears(new Date(), 15);
      if (date > minDate) {
        setBirthDateError("Yaşınız ən az 15 olmalıdır.");
        return false;
      }
      setBirthDateError("");
      return true;
    }

    const parsedDate = parse(date, "yyyy/MM/dd", new Date());
    if (!isValid(parsedDate)) {
      setBirthDateError("Düzgün tarix formatı daxil edin (İl/ay/gün).");
      return false;
    }
    const minDate = subYears(new Date(), 15);
    if (parsedDate > minDate) {
      setBirthDateError("Yaşınız ən az 15 olmalıdır.");
      return false;
    }
    setBirthDateError("");
    return true;
  };

  const validateMobileNumber = (number) => {
    if (!number.trim()) {
      setMobileNumberError("Zəhmət olmasa, məlumatları daxil edin.");
      return false;
    }
    const cleanedNumber = number.replace(/[^0-9]/g, "");
    if (!/^\d{9}$/.test(cleanedNumber)) {
      setMobileNumberError(
        "Mobil nömrə düzgün daxil edilməyib. 50 123 45 67 formatında daxil edin."
      );
      return false;
    }
    setMobileNumberError("");
    return true;
  };

  const validatePassword = (pwd) => {
    if (!pwd.trim()) {
      setPasswordError("Zəhmət olmasa, məlumatları daxil edin.");
      return false;
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#\-_+])[A-Za-z\d!@#\-_+]{8,15}$/;
    if (!passwordRegex.test(pwd)) {
      setPasswordError(
        "Şifrəniz 8-15 simvol aralığından ibarət olmalı, özündə minimum bir böyük hərf, rəqəm və xüsusi simvol (məsələn: !, @, #, -, _) ehtiva etməlidir."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateGender = (selectedGender) => {
    if (!selectedGender) {
      setGenderError("Zəhmət olmasa, seçim edin.");
      return false;
    }
    setGenderError("");
    return true;
  };

  const validateProfessionArea = (area) => {
    if (!area) {
      setProfessionAreaError("Zəhmət olmasa, peşə sahəsini seçin.");
      return false;
    }
    setProfessionAreaError("");
    return true;
  };

  const validateProfessionSpecialization = (specialization) => {
    if (!specialization) {
      setProfessionSpecializationError("Zəhmət olmasa, peşə ixtisasını seçin.");
      return false;
    }
    setProfessionSpecializationError("");
    return true;
  };

  const validateWorkExperience = (experience) => {
    if (!experience || experience <= 0) {
      setWorkExperienceError("Zəhmət olmasa, iş təcrübəsini daxil edin.");
      return false;
    }
    setWorkExperienceError("");
    return true;
  };

  const validateActivityArea = (citiesData) => {
    if (citiesData.cities.length === 0 && citiesData.districts.length === 0) {
      setActivityAreaError(
        "Zəhmət olmasa, fəaliyyət göstərdiyi ərazini seçin."
      );
      return false;
    }
    setActivityAreaError("");
    return true;
  };

  const validateEducationLevel = (level) => {
    if (!level) {
      setEducationLevelError("Zəhmət olmasa, təhsil səviyyəsini seçin.");
      return false;
    }
    setEducationLevelError("");
    return true;
  };

  const validateEducationSpecialization = (specialization) => {
    if (!specialization.trim() && educationLevel !== "Yoxdur") {
      setEducationSpecializationError(
        "Zəhmət olmasa, təhsil ixtisasını daxil edin."
      );
      return false;
    }
    setEducationSpecializationError("");
    return true;
  };

  const validateLanguageSkills = (skills) => {
    if (skills.length === 0) {
      setLanguageSkillsError("Zəhmət olmasa, dil biliklərinizi seçin.");
      return false;
    }
    setLanguageSkillsError("");
    return true;
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-ZçÇəƏğĞıİöÖşŞüÜА-Яа-яЁё\s]*$/.test(value)) {
      setFirstName(value);
      setFirstNameError("");
    }
  };

  const handleFirstNameBlur = () => {
    validateFirstName(firstName);
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-ZçÇəƏğĞıİöÖşŞüÜА-Яа-яЁё\s]*$/.test(value)) {
      setLastName(value);
      setLastNameError("");
    }
  };

  const handleLastNameBlur = () => {
    validateLastName(lastName);
  };

  const handleBirthDateChange = (date) => {
    setBirthDate(date);
    validateBirthDate(date ? format(date, "yyyy/MM/dd") : "");
  };

  const handleBirthDateBlur = () => {
    validateBirthDate(birthDate);
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === "") {
      setMobileNumber(value);
      setMobileNumberError("");
    }
  };

  const handleMobileNumberBlur = () => {
    validateMobileNumber(mobileNumber);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handlePasswordBlur = () => {
    validatePassword(password);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setGenderError("");
  };

  const handleGenderBlur = () => {
    validateGender(gender);
  };

  const handleProfessionAreaBlur = () => {
    validateProfessionArea(professionArea);
  };

  const handleProfessionSpecializationChange = (e) => {
    setProfessionSpecialization(e.target.value);
    setProfessionSpecializationError("");
  };

  const handleProfessionSpecializationBlur = () => {
    validateProfessionSpecialization(professionSpecialization);
  };

  const handleOtherSpecializationInputChange = (e) => {
    setOtherSpecializationInput(e.target.value);
    setProfessionSpecializationError("");
  };

  const handleWorkExperienceChange = (e) => {
    setWorkExperience(e.target.value);
    setWorkExperienceError("");
  };

  const handleWorkExperienceBlur = () => {
    validateWorkExperience(workExperience);
  };

  const handleActivityAreaChange = (e) => {
    setActivityArea(e.target.value);
    setActivityAreaError("");
  };
  const selectedService = filteredServices.find(
    (s) => s.id === professionSpecialization
  );

  const handleProfessionSpecialityOtherChange = (e) => {
    setProfessionArea(e.target.value);
    setProfessionAreaError("");
  };

  const handleProfessionSpecialityOtherBlur = () => {
    validateProfessionArea(professionArea);
  };

  const handleActivityAreaBlur = () => {
    validateActivityArea(citiesForShow);
  };

  const handleEducationLevelChange = (e) => {
    setEducationLevel(e.target.value);
    setEducationLevelError("");
  };

  const handleEducationLevelBlur = () => {
    validateEducationLevel(educationLevel);
  };

  const handleEducationSpecializationChange = (e) => {
    setEducationSpecialization(e.target.value);
    setEducationSpecializationError("");
  };

  const handleEducationSpecializationBlur = () => {
    validateEducationSpecialization(educationSpecialization);
  };

  const handleLanguageSkillChange = (e) => {
    const langId = Number.parseInt(e.target.value, 10);
    if (isNaN(langId)) return;

    if (e.target.checked) {
      setLanguages((prev) => [...prev, langId]);
    } else {
      setLanguages((prev) => prev.filter((id) => id !== langId));
    }
  };

  const handleLanguageSkillsBlur = () => {
    validateLanguageSkills(languages);
  };

  async function handleLocation() {
    try {
      const res = await fetch("https://api.peshekar.online/api/v1/cities/");
      const data = await res.json();
      console.log(data);
      setLocation(data);
      console.log(data);
      return data;
    } catch (error) {
      console.error("Şəhərləri yükləmək mümkün olmadı:", error);
      return [];
    }
  }

  const toggleBaku = () => {
    setIsBakuOpen((prev) => !prev);
  };

  async function handleCategories() {
    try {
      const res = await fetch("https://api.peshekar.online/api/v1/services/");
      const data = await res.json();

      const uniqueCategories = Array.from(
        new Map(data.map((item) => [item.category.id, item.category])).values()
      );

      setCategories(uniqueCategories);
      setAllServices(data);

      return { categories: uniqueCategories, services: data };
    } catch (error) {
      console.error("Kateqoriyalar yüklənərkən xəta:", error);
      return { categories: [], services: [] };
    }
  }

  const handleProfessionAreaChange = (e) => {
    const selectedCategoryId = Number.parseInt(e.target.value);
    setProfessionArea(selectedCategoryId);

    const currentSpecialization = allServices.find(
      (s) => s.id === professionSpecialization
    );
    if (
      !currentSpecialization ||
      currentSpecialization.category.id !== selectedCategoryId
    ) {
      setProfessionSpecialization("");
    }

    const filtered = allServices.filter(
      (service) => service.category.id === selectedCategoryId
    );
    setFilteredServices(filtered);
  };

  async function handleLanguage() {
    try {
      const res = await fetch("https://api.peshekar.online/api/v1/languages/");
      const data = await res.json();
      setLanguage(data);
      console.log("Fetched languages:", data);
      return data;
    } catch (error) {
      console.error("Dilləri yükləmək mümkün olmadı:", error);
      return [];
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const fetchedLanguages = await handleLanguage();
        const { categories: fetchedCategories, services: fetchedAllServices } =
          await handleCategories();
        const fetchedLocations = await handleLocation();

        await fetchUserData(
          fetchedCategories,
          fetchedAllServices,
          fetchedLanguages,
          fetchedLocations
        );
      } catch (error) {
        console.error("İlkin məlumat yükləmə xətası:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isBirthDateValid = validateBirthDate(birthDate);
    const isMobileNumberValid = validateMobileNumber(mobileNumber);
    const isPasswordValid = validatePassword(password);
    const isGenderValid = validateGender(gender);
    const isProfessionAreaValid = validateProfessionArea(professionArea);
    const isProfessionSpecializationValid = validateProfessionSpecialization(
      professionSpecialization
    );
    const isWorkExperienceValid = validateWorkExperience(workExperience);
    const isActivityAreaValid = validateActivityArea(citiesForShow);
    const isEducationLevelValid = validateEducationLevel(educationLevel);
    const isEducationSpecializationValid = validateEducationSpecialization(
      educationSpecialization
    );
    const isLanguageSkillsValid = validateLanguageSkills(languages);

    if (
      isFirstNameValid &&
      isLastNameValid &&
      isBirthDateValid &&
      isMobileNumberValid &&
      isPasswordValid &&
      isGenderValid &&
      isProfessionAreaValid &&
      isProfessionSpecializationValid &&
      isWorkExperienceValid &&
      isActivityAreaValid &&
      isEducationLevelValid &&
      isEducationSpecializationValid &&
      isLanguageSkillsValid
    ) {
      console.log("Form data:", {
        firstName,
        lastName,
        birthDate,
        mobileNumber,
        password,
        gender,
        professionArea,
        professionSpecialization: professionSpecialization,
        workExperience,
        selectedCities: citiesForShow.cities.map((c) => c.id),
        selectedDistricts: citiesForShow.districts.map((d) => d.id),
        educationLevel,
        educationSpecialization,
        languages,
      });
      setShowSaveSuccessPopup(true);
      updateProfile();
    } else {
      console.log("Form has errors. Please correct them.");
      validateFirstName(firstName);
      validateLastName(lastName);
      validateBirthDate(birthDate);
      validateMobileNumber(mobileNumber);
      validatePassword(password);
      validateGender(gender);
      validateProfessionArea(professionArea);
      validateProfessionSpecialization(professionSpecialization);
      validateWorkExperience(workExperience);
      validateActivityArea(citiesForShow);
      validateEducationLevel(educationLevel);
      validateEducationSpecialization(educationSpecialization);
      validateLanguageSkills(languages);
    }
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleSaveSuccessOk = () => {
    setShowSaveSuccessPopup(false);
  };

  const handleDeleteAccountCancel = () => {
    setShowDeleteConfirmPopup(false);
  };

  const handleChangeVisible = () => {
    setVisible(!visible);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file: file,
    }));

    setUploadedImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirmPopup(true);
  };

  const handleDeleteAccountConfirm = () => {
    console.log("Account deletion confirmed!");
    setShowDeleteConfirmPopup(false);
    setShowSuccessPopup(true);
  };

  const handleSaveProfilePicture = () => {
    if (selectedImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Simulating save for:", selectedImageFile.name);
        setProfileImageSrc(reader.result);
        handleClosePhotoPopup();
      };
      reader.readAsDataURL(selectedFile);
    } else {
      handleClosePhotoPopup();
    }
  };

  const handleToggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
    console.log("Profile visibility toggled to:", !isProfileVisible);
  };

  const handleEditProfilePicture = () => {
    setShowPhotoPopup(true);
    setTempImagePreview(profileImageSrc);
    setSelectedFile(null);
    setZoom(50);
  };
  const handleClosePhotoPopup = () => {
    setShowPhotoPopup(false);
    setTempImagePreview(null);
    setSelectedFile(null);
  };
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleChangeImageInPopup = (event) => {
    handleFileChange(event);
  };

  const handleDeleteImageInPopup = () => {
    setTempImagePreview(null);
    setSelectedFile(null);
  };

  const handleConfirmImage = () => {
    if (tempImagePreview && containerRef.current) {
      const image = new Image();
      image.src = tempImagePreview;
      image.crossOrigin = "anonymous";

      image.onload = () => {
        const canvasSize = containerRef.current.offsetWidth;
        const canvas = document.createElement("canvas");
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        const ctx = canvas.getContext("2d");

        const normalizedZoom = zoom / 100;
        const scale = normalizedZoom < 0.5 ? 0.5 : normalizedZoom;

        const previewWidth = containerRef.current.offsetWidth;
        const previewHeight = containerRef.current.offsetHeight;

        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;

        const relativeX = dragPosition.x * (image.width / previewWidth);
        const relativeY = dragPosition.y * (image.height / previewHeight);

        const offsetX = canvasSize / 2 - scaledWidth / 2 - dragPosition.x;
        const offsetY = canvasSize / 2 - scaledHeight / 2 - dragPosition.y;

        ctx.beginPath();
        ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);

        const finalImage = canvas.toDataURL("image/png");
        setProfileImageSrc(finalImage);
        handleClosePhotoPopup();

        const blob = dataURLtoBlob(finalImage);
        const file = new File([blob], "profile.png", { type: "image/png" });
        setSelectedImageFile(file);
      };
    } else {
      setProfileImageSrc("/placeholder.svg?height=220&width=220");
      handleClosePhotoPopup();
    }
  };

  function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";");
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const handleZoomChange = (event) => {
    setZoom(Number.parseInt(event.target.value));
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 10, 100));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 10, 0));
  };

  const handleToggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible);
    console.log("Profile visibility toggled to:", !isProfileVisible);
  };
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(uploadedImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setUploadedImages(items);
  };

  const handleActivityAreaClick = () => {
    setOpenPopup(true);
  };

  const handleCloseActivityAreaPopup = () => {
    setOpenPopup(false);
    setCitySearchTerm("");
  };

  const handleCityCheckboxChange = (city) => {
    setSelectedCities((prevSelectedCities) => {
      if (prevSelectedCities.includes(city)) {
        return prevSelectedCities.filter((item) => item !== city);
      } else {
        return [...prevSelectedCities, city];
      }
    });
  };

  const handleRemoveSelectedCity = (cityToRemove) => {
    setSelectedCities((prevSelectedCities) =>
      prevSelectedCities.filter((city) => city !== cityToRemove)
    );
  };

  const handleCitySearchChange = (event) => {
    setCitySearchTerm(event.target.value);
  };

  const handleSelectAllCities = () => {
    const allVisibleCities = filteredCities.map((city) => city.display_name);
    setSelectedCities(allVisibleCities);
  };

  const handleClearAllCities = () => {
    setSelectedCities([]);
  };

  const handleConfirmActivityAreaSelection = () => {
    if (selectedCities.length === 0) {
      setActivityAreaError(true);
      return;
    }
    setActivityAreaError(false);
    console.log("Confirmed Activity Areas:", selectedCities);
    setOpenPopup(false);
  };

  const normalizeAz = (str) => {
    return str
      .toLowerCase()
      .replace(/ə/g, "e")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ü/g, "u")
      .replace(/ç/g, "c")
      .replace(/ş/g, "s")
      .replace(/ğ/g, "g");
  };

  const filteredCities = location.filter((city) =>
    normalizeAz(city.display_name).includes(normalizeAz(citySearchTerm))
  );

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragOffset, setStartDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startDragOffset.x,
      y: e.clientY - startDragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  console.log("uploadedImages:", uploadedImages);
  const handleChildData = (dataFromChild) => {
    console.log("Data from CitySelectionPopup:", dataFromChild);
    // setFormData((prev) => ({ // formData is not defined in this scope
    //   ...prev,
    //   cities: [...dataFromChild.cities, ...dataFromChild.districts],
    // }));

    setCitiesForShow({
      cities: [...dataFromChild.selectedCitiesForShow].map((item) => ({
        id: item.id,
        display_name: item.display_name,
      })),
      districts: [...dataFromChild.selectedDistrictsForShow].map((item) => ({
        id: item.id,
        display_name: item.display_name,
      })),
    });

    setOpenPopup(false);
    document.body.style.overflowY = "auto";
  };

  console.log("Current openPopup state:", openPopup);

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-[63.4rem] bg-[#F9FAFB] flex-grow">
        <div className="w-[66.4rem] m-auto flex justify-between items-start pt-5">
          <div className="flex gap-[1.4rem] items-center">
            <div className="relative">
              <img
                src={profileImageSrc || "/placeholder.svg"}
                alt="profil-image"
                className="w-[120px] h-[120px] object-cover rounded-full border-2 border-white shadow-md"
              />

              <img
                src={addsvg || "/placeholder.svg"}
                alt="add-image"
                className="h-[2rem] w-[2rem] absolute bottom-2 left-[93px] cursor-pointer"
                onClick={handleEditProfilePicture}
              />
            </div>
            <div className="">
              <h1 className="text-[32px] text-[#1A4862] font-bold">
                Tənzimləmələr
              </h1>
              <p className="text-[16px] text-[#656F83]">
                Profil məlumatlarınızı yeniləyin.
              </p>
              <p className="text-[14px] text-[#1A4862] font-semibold">
                Qeydiyyat tarixi: {formattedRegistrationDate}
              </p>
            </div>
          </div>
          <div className="flex gap-[1.4rem] items-center">
            <div>
              <p className="text-[1rem] text-[#1A4862] font-medium">
                Profilim ana səhifədə görünsün.
              </p>
            </div>
            <div
              className={`
      relative w-[3rem] h-[1.5rem] cursor-pointer rounded-full flex items-center transition-colors duration-300
      ${
        isProfileVisible
          ? "bg-[#CDE4F2] justify-end"
          : "bg-gray-300 justify-start"
      }
    `}
              onClick={handleToggleProfile}
            >
              <div
                className={`
        w-[1.3rem] h-[1.2rem] rounded-full shadow-md transition-transform duration-300
        ${
          isProfileVisible
            ? "bg-[#3187B8] transform translate-x-[0.3rem] mr-1"
            : "bg-white transform translate-x-[0.15rem]"
        }
      `}
              ></div>
            </div>
          </div>
        </div>

        <div className="w-100% bg-white mt-7">
          <div className="w-[66.4rem] m-auto py-5">
            <div className="flex items-center gap-3">
              <img
                src={logsvg || "/placeholder.svg"}
                alt="log-image"
                className="w-[1.3rem] h-[1.3rem]"
              />
              <p className="text-[#1A4862] text-[1.2rem] font-bold">
                Şəxsi Məlumatlar
              </p>
            </div>
            <form
              action=""
              className="mt-5 flex justify-between flex-wrap gap-7"
              onSubmit={handleSubmit}
            >
              <div>
                <div className="flex gap-[4px]">
                  <img
                    src={usersvg || "/placeholder.svg"}
                    alt="user-image"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">Ad</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>
                <div>
                  <input
                    maxLength="20"
                    type="text"
                    className={`w-[27.5rem] h-[3rem] border ${
                      firstNameError ? "border-red-500" : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                    value={firstName}
                    name="first_name"
                    onChange={handleFirstNameChange}
                    onBlur={handleFirstNameBlur}
                    onKeyDown={(e) => {
                      const isControlKey = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                      ].includes(e.key);

                      const isLetter = /^[a-zA-ZəöüçğışƏÖÜÇĞŞİIА-Яа-яЁё]$/.test(
                        e.key
                      );
                      const isValidInput = isLetter || isControlKey;

                      if (!isValidInput) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {firstNameError && (
                    <p className="text-[#EF4444] text-[.8rem] mt-1">
                      {firstNameError}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex gap-[4px]">
                  <img
                    src={usersvg || "/placeholder.svg"}
                    alt="user-image"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">Soyad</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>
                <div>
                  <input
                    maxLength="20"
                    type="text"
                    className={`w-[27.5rem] h-[3rem] border ${
                      lastNameError ? "border-red-500" : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                    value={lastName}
                    onChange={handleLastNameChange}
                    onBlur={handleLastNameBlur}
                  />
                  {lastNameError && (
                    <p className="text-[#EF4444] text-[.8rem] mt-1">
                      {lastNameError}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex gap-[4px]">
                  <img
                    src={calendarsvg || "/placeholder.svg"}
                    alt="user-image"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">Doğum tarixi</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>
                <div>
                  <DatePicker
                    selected={
                      birthDate
                        ? typeof birthDate === "string"
                          ? parse(birthDate, "yyyy/MM/dd", new Date())
                          : birthDate
                        : null
                    }
                    onChange={handleBirthDateChange}
                    name="birth_date"
                    onBlur={handleBirthDateBlur}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="İl / ay / gün"
                    locale={az}
                    maxDate={subYears(new Date(), 15)}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    calendarStartDay={1}
                    onChangeRaw={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                      let formatted = "";

                      if (val.length >= 4) {
                        formatted += val.slice(0, 4);
                        if (val.length >= 6) {
                          formatted += "/" + val.slice(4, 6);
                          if (val.length > 6) {
                            formatted += "/" + val.slice(6, 8);
                          }
                        } else if (val.length > 4) {
                          formatted += "/" + val.slice(4);
                        }
                      } else {
                        formatted = val;
                      }

                      e.target.value = formatted;
                      setBirthDate(formatted);
                      validateBirthDate(formatted);
                    }}
                    onKeyDown={(e) => {
                      const allowedKeys = [
                        "Backspace",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                        "Tab",
                      ];
                      if (
                        !/[0-9]/.test(e.key) &&
                        !allowedKeys.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className={`w-[27.5rem] h-[3rem] border ${
                      birthDateError ? "border-red-500" : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                  />
                  {birthDateError && (
                    <p className="text-[#EF4444] text-[.8rem] mt-1">
                      {birthDateError}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex gap-[4px]">
                  <img
                    src={callsvg || "/placeholder.svg"}
                    alt="user-image"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">Mobil nömrə</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>
                <div>
                  <div
                    className={`w-[27.5rem] h-[3rem] border ${
                      mobileNumberError ? "border-red-500" : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                  >
                    <span className=" text-[#1A4862] font-semibold px-3">
                      +994
                    </span>
                    <input
                      type="tel"
                      maxLength={9}
                      className="flex-1 h-full p-2 outline-none text-[#1A4862] font-semibold"
                      placeholder="50 123 45 67"
                      value={mobileNumber}
                      onChange={handleMobileNumberChange}
                      onBlur={handleMobileNumberBlur}
                    />
                  </div>
                  {mobileNumberError && (
                    <p className="text-[#EF4444] text-[.8rem] mt-1">
                      {mobileNumberError}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex gap-[4px]">
                  <img
                    src={locksvg || "/placeholder.svg"}
                    alt="user-image"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">Şifrə</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>
                <div>
                  <div className="relative w-[27.5rem]">
                    <input
                      type={`${visible ? "text" : "password"}`}
                      maxLength={15}
                      className={`w-[27.5rem] h-[3rem] border ${
                        passwordError ? "border-red-500" : "border-[#C3C8D1]"
                      } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={handlePasswordBlur}
                    />
                    <button
                      type="button"
                      onClick={handleChangeVisible}
                      className="w-6 h-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#1A4862]"
                    >
                      {visible ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="w-[450px] text-[#EF4444] text-[.8rem] mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex gap-[4px]">
                  <img
                    src={cinssvg || "/placeholder.svg"}
                    alt="user-image"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">Cins</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>
                <div className="w-[27.5rem] h-[3rem] rounded-lg p-2 flex items-center gap-4 text-[#1A4862]">
                  <div className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="gender"
                      id="male"
                      value="Kişi"
                      checked={gender === "Kişi"}
                      onChange={handleGenderChange}
                      onBlur={handleGenderBlur}
                    />
                    <label htmlFor="male">Kişi</label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="gender"
                      id="female"
                      value="Qadın"
                      checked={gender === "Qadın"}
                      onChange={handleGenderChange}
                      onBlur={handleGenderBlur}
                    />
                    <label htmlFor="female">Qadın</label>
                  </div>
                </div>
                {genderError && (
                  <p className="text-[#EF4444] text-[.8rem] mt-1">
                    {genderError}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="w-100% bg-white mt-7">
          <div className="w-[66.4rem] m-auto py-5">
            <div className="flex items-center gap-3">
              <img
                src={datasvg || "/placeholder.svg"}
                alt="log-image"
                className="w-[1.3rem] h-[1.3rem]"
              />
              <p className="text-[#1A4862] text-[1.2rem] font-bold">
                Peşə Məlumatları
              </p>
            </div>
            <form
              action=""
              className="mt-5 flex justify-between flex-wrap gap-7"
            >
              <div>
                <div className="flex gap-[4px] mb-1">
                  <img
                    src={worksvg || "/placeholder.svg"}
                    alt="work-image"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">Peşə sahəsi</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>

                <div className="relative w-[27.5rem]">
                  <select
                    className={`w-full h-[3rem] border ${
                      professionAreaError
                        ? "border-red-500"
                        : "border-[#C3C8D1]"
                    } rounded-lg outline-none pr-10 pl-3 text-[#1A4862] font-semibold appearance-none`}
                    value={professionArea}
                    onChange={handleProfessionAreaChange}
                    onBlur={handleProfessionAreaBlur}
                  >
                    <option value="">Seçin</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.display_name}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="w-5 h-5 text-[#1A4862]"
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
                </div>

                {professionAreaError && (
                  <p className="text-[#EF4444] text-[.8rem] mt-1">
                    {professionAreaError}
                  </p>
                )}
              </div>

              <div>
                <div className="flex gap-[4px] mb-1">
                  <img
                    src={placesvg || "/placeholder.svg"}
                    alt="place-image"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">Peşə ixtisası</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>

                <div className="relative w-[27.5rem]">
                  <select
                    className={`w-full h-[3rem] border ${
                      professionSpecializationError
                        ? "border-red-500"
                        : "border-[#C3C8D1]"
                    } rounded-lg outline-none pr-10 pl-3 text-[#1A4862] font-semibold appearance-none`}
                    value={professionSpecialization}
                    onChange={handleProfessionSpecializationChange}
                    onBlur={handleProfessionSpecializationBlur}
                  >
                    <option value="">Seçin</option>
                    {filteredServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.display_name}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="w-5 h-5 text-[#1A4862]"
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
                </div>

                {professionSpecializationError && (
                  <p className="text-[#EF4444] text-[.8rem] mt-1">
                    {professionSpecializationError}
                  </p>
                )}
              </div>

              <div>
                <div className="flex gap-[4px]">
                  <img
                    src={practicesvg || "/placeholder.svg"}
                    alt="practice-image"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">
                    İş təcrübəsi (il)
                  </p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>
                <div className="w-[27.4rem] h-[3rem] rounded-lg flex items-center gap-4 text-[#1A4862]">
                  <input
                    type="number"
                    min="0"
                    className={`w-[27.5rem] h-[3rem] border ${
                      workExperienceError
                        ? "border-red-500"
                        : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                    value={workExperience}
                    onChange={handleWorkExperienceChange}
                    onBlur={handleWorkExperienceBlur}
                  />
                </div>
                {workExperienceError && (
                  <p className="text-[#EF4444] text-[.8rem] mt-1">
                    {workExperienceError}
                  </p>
                )}
              </div>
              <div className="flex gap-[4px]">
                <div className="mb-4">
                  <div className="flex gap-[4px]">
                    <img
                      src={locationsvg || "/placeholder.svg"}
                      alt="location-image"
                      className="w-[1.2rem] h-[1.2rem]"
                    />
                    <label
                      htmlFor="activity-area"
                      className="block text-[#656F83] text-[.8rem]"
                    >
                      Fəaliyyət göstərdiyi ərazi{" "}
                    </label>
                    <p className="text-[#EF4444] text-[1rem]">*</p>
                  </div>
                  <input
                    type="text"
                    readOnly
                    onClick={() => {
                      console.log(
                        "Activity area input clicked, setting openPopup to true"
                      );
                      setOpenPopup(true);
                    }}
                    placeholder={
                      citiesForShow.cities.length > 0 ||
                      citiesForShow.districts.length > 0
                        ? [
                            ...citiesForShow.cities.map(
                              (item) => item.display_name
                            ),
                            ...citiesForShow.districts.map(
                              (item) => item.display_name
                            ),
                          ].join(", ")
                        : "Ərazi seç"
                    }
                    className={`w-[27.5rem] h-[3rem] border ${
                      activityAreaError ? "border-red-500" : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                    onBlur={handleActivityAreaBlur}
                  />
                  {activityAreaError && (
                    <p className="text-red-500 text-sm mt-1">
                      Fəaliyyət ərazisi seçilməlidir.
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="w-100% bg-white mt-7">
          <div className="w-[66.4rem] m-auto py-5">
            <div className="flex items-center gap-3">
              <img
                src={teachersvg || "/placeholder.svg"}
                alt="education-icon"
                className="w-[1.3rem] h-[1.3rem]"
              />
              <p className="text-[#1A4862] text-[1.2rem] font-bold">
                Təhsil və Bacarıqlar
              </p>
            </div>

            <form
              action=""
              className="mt-5 flex justify-between flex-wrap gap-7"
            >
              <div>
                <div className="flex gap-[4px]">
                  <img
                    src={schoolsvg || "/placeholder.svg"}
                    alt="university-icon"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">Təhsil</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>
                <div className="w-[27.5rem] rounded-lg p-2 flex flex-col gap-3 text-[#1A4862] mt-2">
                  <div className="flex gap-4">
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name="education"
                        id="tamAli"
                        value={"Tam ali"}
                        checked={educationLevel === "Tam ali"}
                        onChange={handleEducationLevelChange}
                        onBlur={handleEducationLevelBlur}
                      />
                      <label htmlFor="tamAli">Tam ali</label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name="education"
                        id="natamamAli"
                        value="Natamam ali"
                        checked={educationLevel === "Natamam ali"}
                        onChange={handleEducationLevelChange}
                        onBlur={handleEducationLevelBlur}
                      />
                      <label htmlFor="natamamAli">Natamam ali</label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name="education"
                        id="orta"
                        value="Orta"
                        checked={educationLevel === "Orta"}
                        onChange={handleEducationLevelChange}
                        onBlur={handleEducationLevelBlur}
                      />
                      <label htmlFor="orta">Orta</label>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name="education"
                        id="pesheTehsili"
                        value="Peşə təhsili"
                        checked={educationLevel === "Peşə təhsili"}
                        onChange={handleEducationLevelChange}
                        onBlur={handleEducationLevelBlur}
                      />
                      <label htmlFor="pesheTehsili">Peşə təhsili</label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name="education"
                        id="ortaIxtisasTehsili"
                        value="Orta ixtisas təhsili"
                        checked={educationLevel === "Orta ixtisas təhsili"}
                        onChange={handleEducationLevelChange}
                        onBlur={handleEducationLevelBlur}
                      />
                      <label htmlFor="ortaIxtisasTehsili">
                        Orta ixtisas təhsili
                      </label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name="education"
                        id="yoxdur"
                        value="Yoxdur"
                        checked={educationLevel === "Yoxdur"}
                        onChange={handleEducationLevelChange}
                        onBlur={handleEducationLevelBlur}
                      />
                      <label htmlFor="yoxdur">Yoxdur</label>
                    </div>
                  </div>
                </div>
                {educationLevelError && (
                  <p className="text-[#EF4444] text-[.8rem] mt-1">
                    {educationLevelError}
                  </p>
                )}
              </div>
              <div>
                <div className="flex gap-[4px]">
                  <img
                    src={educationsvg || "/placeholder.svg"}
                    alt="education-icon"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">Təhsil ixtisası</p>
                  {educationLevel === "Yoxdur" ? (
                    <p className="text-white">.</p>
                  ) : (
                    <p className="text-[#EF4444] text-[1rem]">*</p>
                  )}
                </div>
                <div>
                  <input
                    maxLength={50}
                    placeholder="Dülgərlik"
                    className={`w-[27.5rem] h-[3rem] border ${
                      educationSpecializationError &&
                      educationLevel !== "Yoxdur"
                        ? "border-red-500"
                        : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                    value={educationSpecialization}
                    onChange={handleEducationSpecializationChange}
                    onBlur={handleEducationSpecializationBlur}
                    disabled={educationLevel === "Yoxdur"}
                  />
                  {educationLevel !== "Yoxdur" &&
                    educationSpecializationError && (
                      <p className="text-[#EF4444] text-[.8rem] mt-1">
                        {educationSpecializationError}
                      </p>
                    )}
                </div>
              </div>
              <div className="w-full">
                <div className="flex gap-[4px]">
                  <img
                    src="./src/assets/language.svg"
                    alt="language-icon"
                    className="w-[1.2rem] h-[1.2rem]"
                  />
                  <p className="text-[#656F83] text-[.8rem]">Dil bilikləri</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>
                <div className="w-[27.5rem] h-[3rem] rounded-lg p-2 flex items-center gap-4 text-[#1A4862]">
                  {language.map((lang) => (
                    <div className="flex gap-2 items-center" key={lang.id}>
                      <input
                        type="checkbox"
                        name="language"
                        id={`language-${lang.id}`}
                        value={lang.id}
                        checked={languages.includes(lang.id)}
                        onChange={handleLanguageSkillChange}
                        onBlur={handleLanguageSkillsBlur}
                      />
                      <label htmlFor={`language-${lang.id}`}>
                        {lang.display_name}
                      </label>
                    </div>
                  ))}
                </div>
                {languageSkillsError && (
                  <p className="text-[#EF4444] text-[.8rem] mt-1">
                    {languageSkillsError}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="w-100% bg-white mt-7">
          <div className="w-[66.4rem] m-auto py-5">
            <div className="flex items-center gap-3">
              <img
                src={infosvg || "/placeholder.svg"}
                alt="log-image"
                className="w-[1.3rem] h-[1.3rem]"
              />
              <p className="text-[#1A4862] text-[1.2rem] font-bold">
                Əlavə məlumatlar
              </p>
            </div>

            <div className="mt-5">
              <p className="text-[#1A4862] text-[1rem] font-bold">
                Gördüyünüz işlər{" "}
                <span className="text-[#656F83] text-[.9rem] font-semibold">
                  (Max 10 ədəd şəkil yüklənilə bilər.)
                </span>
              </p>
              <div className="flex gap-4 mt-3 flex-wrap">
                <div className="relative w-[7.5rem] h-[7.5rem] border border-dashed border-[#C3C8D1] rounded-lg flex flex-col items-center justify-center text-[#656F83] cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg, image/png"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <img
                    src="/src/assets/upload.svg"
                    alt="upload-icon"
                    className="w-6 h-6"
                  />
                  <p className="text-[.8rem] mt-1">JPG/PNG</p>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                      <div
                        className="flex gap-2"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {uploadedImages.map((image, index) => (
                          <Draggable
                            key={index}
                            draggableId={`image-${index}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                className={`relative w-[7.5rem] h-[7.5rem] rounded-lg overflow-hidden ${
                                  snapshot.isDragging
                                    ? "opacity-70"
                                    : "opacity-100"
                                }`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <img
                                  src={image.url || "/placeholder.svg"}
                                  alt={`uploaded-image-${index}`}
                                  className="w-full h-full object-cover"
                                  draggable={false}
                                />
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md cursor-pointer"
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  <img
                                    src={closesvg || "/placeholder.svg"}
                                    alt="close-image"
                                    className="w-4 h-4"
                                    draggable={false}
                                  />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
              <p className="text-[#656F83] text-[.8rem] mt-2">
                Şəkillərin sırasını dəyişmək üçün sürükləyin.
              </p>
            </div>

            <div className="mt-10">
              <p className="text-[#1A4862] text-[1.2rem] font-bold">
                Sosial şəbəkə linkləri
              </p>
              <p className="text-[#656F83] text-[.8rem] mt-1">
                Peşənizlə əlaqədar sosial şəbəkə səhifəsinin (olduqda) linkini
                əlavə edə bilərsiniz.
              </p>

              <div className="flex items-center border border-[#C3C8D1] rounded-lg h-[3rem] mt-3 p-3 gap-3">
                <img
                  src={facebooksvg || "/placeholder.svg"}
                  alt="facebook-icon"
                  className="w-5 h-5"
                />
                <input
                  type="text"
                  placeholder="Facebook linki"
                  className="w-full outline-none text-[#1A4862] font-semibold"
                  value={socialLinks.facebook}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, facebook: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center border border-[#C3C8D1] rounded-lg h-[3rem] mt-3 p-3 gap-3">
                <img
                  src={instagramsvg || "/placeholder.svg"}
                  alt="instagram-icon"
                  className="w-5 h-5"
                />
                <input
                  type="text"
                  placeholder="Instagram linki"
                  className="w-full outline-none text-[#1A4862] font-semibold"
                  value={socialLinks.instagram}
                  onChange={(e) =>
                    setSocialLinks({
                      ...socialLinks,
                      instagram: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center border border-[#C3C8D1] rounded-lg h-[3rem] mt-3 p-3 gap-3">
                <img
                  src={tiktoksvg || "/placeholder.svg"}
                  alt="tiktok-icon"
                  className="w-5 h-5"
                />
                <input
                  type="text"
                  placeholder="TikTok linki"
                  className="w-full outline-none text-[#1A4862] font-semibold"
                  value={socialLinks.tiktok}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, tiktok: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center border border-[#C3C8D1] rounded-lg h-[3rem] mt-3 p-3 gap-3">
                <img
                  src={linkedinsvg || "/placeholder.svg"}
                  alt="linkedin-icon"
                  className="w-5 h-5"
                />
                <input
                  type="text"
                  placeholder="LinkedIn linki"
                  className="w-full outline-none text-[#1A4862] font-semibold"
                  value={socialLinks.linkedin}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-100% bg-white mt-7 mb-7">
          <div className="w-[66.4rem] m-auto py-5">
            <div className="flex items-center gap-3">
              <img
                src={datasvg || "/placeholder.svg"}
                alt="log-image"
                className="w-[1.3rem] h-[1.3rem]"
              />
              <p className="text-[#1A4862] text-[1.2rem] font-bold">
                Haqqınızda
              </p>
            </div>

            <div className="mt-5">
              <textarea
                maxLength={1500}
                className="w-full h-[12rem] border border-[#C3C8D1] rounded-lg outline-none p-4 text-[#1A4862] text-[.9rem] font-medium resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Özünüz haqqında məlumat yazın"
              />
            </div>

            <div className="flex justify-between mt-8">
              <button
                className="cursor-pointer flex items-center gap-2 text-[#EF4444] text-[.9rem] font-semibold px-4 py-2 rounded-lg hover:bg-red-50"
                onClick={handleShowpopSuccess}
              >
                <img
                  src={trashsvg || "/placeholder.svg"}
                  alt="trash-icon"
                  className="w-5 h-5"
                />
                Hesabı sil
              </button>

              <form onSubmit={handleSaveChanges}>
                <button
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                  className="cursor-pointer flex items-center gap-2 bg-[#1A4862] text-white text-[.9rem] font-semibold px-4 py-2 rounded-lg hover:bg-[#255C80]"
                >
                  <img
                    src={savesvg || "/placeholder.svg"}
                    alt="trash-icon"
                    className="w-5 h-5"
                  />
                  Dəyişiklikləri yadda saxla
                </button>
              </form>
            </div>
          </div>
        </div>

        {showPhotoPopup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-[25rem]">
              <div className="flex justify-center p-5 items-center mb-4">
                <h2 className="text-xl font-bold text-[#1A4862]">
                  Şəkli dairəyə yerləşdirin.
                </h2>
                <button
                  onClick={handleClosePhotoPopup}
                  className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="w-[22rem] relative bg-gray-100 rounded-lg overflow-hidden mb-6 flex items-center justify-center h-64">
                {tempImagePreview ? (
                  <>
                    <div className="relative w-[31rem] h-full flex items-center justify-center">
                      <img
                        src={tempImagePreview || "/placeholder.svg"}
                        alt="Background Blur"
                        className="w-full h-full object-cover blur-sm opacity-70"
                      />
                      <div
                        ref={containerRef}
                        className="w-[220px] h-[220px] rounded-full overflow-hidden border-2 border-white shadow-lg z-10 absolute"
                      >
                        <img
                          src={tempImagePreview || "/placeholder.svg"}
                          alt="Profil Şəkil Preview"
                          className="w-full h-full object-cover cursor-grab active:cursor-grabbing select-none"
                          draggable={false}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                          style={{
                            transform: `translate(${position.x}px, ${
                              position.y
                            }px) scale(${1 + (zoom - 50) / 100})`,
                            objectPosition: "50% 50%",
                            transition: isDragging
                              ? "none"
                              : "transform 0.1s ease-out",
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 flex flex-col items-center justify-center h-full">
                    <p className="mb-4">Şəkil seçilməyib.</p>
                    <label
                      htmlFor="file-upload-main"
                      className="cursor-pointer bg-[#1A4862] text-white py-2 px-4 rounded-md hover:bg-[#2A5872] transition-colors"
                    >
                      Şəkil Seç
                    </label>
                    <input
                      id="file-upload-main"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center mb-2 justify-center gap-1">
                <label
                  htmlFor="change-photo-input"
                  className="cursor-pointer text-sm font-semibold text-blue-600"
                >
                  Şəkli dəyiş
                  <input
                    id="change-photo-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChangeImageInPopup}
                  />
                </label>
                <button
                  className="cursor-pointer text-sm font-semibold text-red-600"
                  onClick={handleDeleteImageInPopup}
                >
                  Sil
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 mb-3">
                <span
                  className="text-xl text-gray-600 cursor-pointer"
                  onClick={handleZoomOut}
                >
                  -
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={zoom}
                  className="w-64 accent-[#ABB1BE] bg-[#3187B8] cursor-pointer"
                  onChange={handleZoomChange}
                />
                <span
                  className="text-xl text-gray-600 cursor-pointer"
                  onClick={handleZoomIn}
                >
                  +
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Böyütmək üçün sürüşdürün.
              </p>

              <div className="mt-6 flex justify-between gap-3">
                <button
                  className="w-[9rem] cursor-pointer px-6 py-2 border bg-white border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                  onClick={handleClosePhotoPopup}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Geri
                </button>
                <button
                  className="w-[13rem] cursor-pointer px-6 py-2 bg-[#1A4862] text-white rounded-lg hover:bg-[#255C80] transition-colors flex items-center justify-center gap-1"
                  onClick={handleConfirmImage}
                >
                  Təsdiqlə
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSaveSuccessPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[25rem] text-center">
            <h2 className="text-xl font-bold text-[#1A4862] mb-2">
              Məlumatlar yadda saxlanıldı!
            </h2>
            <p className="text-gray-600 mb-4">
              Dəyişikliklər uğurla qeydə alındı.
            </p>
            <button
              className="cursor-pointer px-6 py-2 bg-[#1A4862] text-white rounded-lg hover:bg-[#255C80]"
              onClick={handleSaveSuccessOk}
            >
              Bağla
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirmPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[25rem] text-center">
            <h2 className="text-xl font-bold text-[#EF4444] mb-2">
              Hesabı silmək
            </h2>
            <p className="text-gray-600 mb-4">
              Hesabınızı silmək istədiyinizə əminsiniz?
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-white bg-[#1A4862]"
                onClick={handleDeleteAccountClick}
              >
                Bəli
              </button>
              <button
                className="cursor-pointer px-4 py-2 border-gray-300 text-white rounded-lg bg-[#1A4862]"
                onClick={handleDeleteAccountCancel}
              >
                Xeyr
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm w-full">
            <h2 className="text-xl font-semibold text-green-600 mb-2">
              Hesab silindi
            </h2>
            <p className="text-gray-700 mb-4">
              Siz uğurla sistemdən çıxarıldınız.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-900 transition"
            >
              Daxil ol
            </button>
          </div>
        </div>
      )}
      {openPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm  bg-black/50">
          <div className="w-[65%] h-[90%] rounded-2xl bg-image overflow-hidden shadow-lg">
            <CitySelectionPopup
              onSendData={handleChildData}
              cities={citiesForShow}
            />
          </div>
        </div>
      )}
    </div>
  );
}
