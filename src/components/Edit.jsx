"use client"

import React, { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { az } from "date-fns/locale"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { parse, subYears, isValid } from "date-fns"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import addsvg from "../assets/add.svg"
import calendarsvg from "../assets/calendar.svg"
import callsvg from "../assets/call.svg"
import cinssvg from "../assets/cins.svg"
import closesvg from "../assets/close.svg"
import datasvg from "../assets/data.svg"
import educationsvg from "../assets/education.svg"
import eyesvg from "../assets/eye.svg"
import facebooksvg from "../assets/facebook.svg"
import infosvg from "../assets/info.svg"
import instagramsvg from "../assets/instagram.svg"
import languagesvg from "../assets/language.svg"
import linkedinsvg from "../assets/linkedin.svg"
import locationsvg from "../assets/location.svg"
import locksvg from "../assets/lock.svg"
import logsvg from "../assets/log.svg"
import placesvg from "../assets/place.svg"
import practicesvg from "../assets/practice.svg"
import savesvg from "../assets/save.svg"
import schoolsvg from "../assets/school.svg"
import teachersvg from "../assets/teacher.svg"
import tiktoksvg from "../assets/tiktok.svg"
import trashsvg from "../assets/trash.svg"
import usersvg from "../assets/user.svg"
import worksvg from "../assets/work.svg"
import axios from "axios"
import CitySelectionPopup from "./CitySelectionPopup"
// import { data } from "autoprefixer";

export default function Edit() {
  const [isProfileVisible, setIsProfileVisible] = useState(true)
  const [showPhotoPopup, setShowPhotoPopup] = useState(false)
  const [showSaveSuccessPopup, setShowSaveSuccessPopup] = useState(false)
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false)
  const [visible, setVisible] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [tempImagePreview, setTempImagePreview] = useState(null) // For image preview in the popup
  const [zoom, setZoom] = useState(50) // Initial zoom value for the slider (0-100 scale)
  const [selectedFile, setSelectedFile] = useState(null) // The actual file object for potential upload
  const [openPopup, setOpenPopup] = useState(false) // Controls popup visibility
  const [location, setLocation] = useState([]) // Stores cities fetched from API
  const [selectedCities, setSelectedCities] = useState([]) // Stores selected cities by the user
  const [citySearchTerm, setCitySearchTerm] = useState("") // For filtering cities in the popup
  const [activityAreaError, setActivityAreaError] = useState(false) // For validation feedback
  const [categories, setCategories] = useState([])
  const [servicies, setServicies] = useState([])
  const [language, setLanguage] = useState([])
  const [note, setNote] = useState("")
  const [previewImage, setPreviewImage] = useState(null)
  const [cities, setCities] = useState([])
  const [bakuDistricts, setBakuDistricts] = useState([])
  const [isBakuOpen, setIsBakuOpen] = useState(false)
  const [filteredBakuDistricts, setFilteredBakuDistricts] = useState([])
  const [allServices, setAllServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])

  // State for Personal Information fields and their errors
  const [firstName, setFirstName] = useState("")
  const [firstNameError, setFirstNameError] = useState("")
  const [lastName, setLastName] = useState("")
  const [lastNameError, setLastNameError] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [birthDateError, setBirthDateError] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [mobileNumberError, setMobileNumberError] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [gender, setGender] = useState("")
  const [genderError, setGenderError] = useState("")

  // State for Professional Information fields and their errors
  const [professionArea, setProfessionArea] = useState("")
  const [professionAreaError, setProfessionAreaError] = useState("")
  const [professionSpecialization, setProfessionSpecialization] = useState("")
  const [professionSpecializationError, setProfessionSpecializationError] = useState("")
  const [otherSpecializationInput, setOtherSpecializationInput] = useState("") // New state for "Digər" input
  const [workExperience, setWorkExperience] = useState("")
  const [workExperienceError, setWorkExperienceError] = useState("")
  const [activityArea, setActivityArea] = useState("")
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [profileImageSrc, setProfileImageSrc] = useState("/profil.jpg")

  // State for Education and Skills fields and their errors
  const [educationLevel, setEducationLevel] = useState("")
  const [educationLevelError, setEducationLevelError] = useState("")
  const [educationSpecialization, setEducationSpecialization] = useState("")
  const [educationSpecializationError, setEducationSpecializationError] = useState("")
  const [languageSkills, setLanguageSkills] = useState([])
  const [languageSkillsError, setLanguageSkillsError] = useState("")

  const registrationDate = new Date("2025-08-11")
  const formattedRegistrationDate = format(registrationDate, "dd MMMM")

  // Utility function to check for Azerbaijani characters
  const isAzerbaijaniLetter = (char) => {
    return /^[a-zA-ZçÇəƏğĞıİöÖşŞüÜ]+$/.test(char)
  }

  useEffect(() => {
    console.log(professionSpecialization)
  }, [professionSpecialization])

  // Login get Token
  const loginUser = async () => {
    try {
      const response = await axios.post("https://api.peshekar.online/api/v1/login/", {
        mobile_number: "514901950",
        password: "Parol12345@",
      })

      const token = response.data.access || response.data.token
      if (token) {
        localStorage.setItem("token", token)
        console.log("Token alındı:", token)
      } else {
        console.error("Token cavabda tapılmadı:", response.data)
      }
    } catch (error) {
      console.error("Login xətası:", error.response?.data || error.message)
    }
  }

  // Get Profil information
  const getProfile = async () => {
    const token = localStorage.getItem("token")

    try {
      const response = await axios.get("https://api.peshekar.online/api/v1/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("🟢 Profil məlumatı:", response.data)
    } catch (error) {
      console.error("🔴 Profil alınmadı:", error.response?.data || error.message)
    }
  }

  // Uptade Profil Information
  const updateProfile = async () => {
    const token = localStorage.getItem("token")

    const formData = new FormData()

    // Dəyərləri əlavə edirik
    formData.append("first_name", firstName)
    formData.append("last_name", lastName)

    // ✅ Doğru formatda tarix
    const formattedBirthDate = new Date(birthDate).toISOString().split("T")[0]
    formData.append("birth_date", formattedBirthDate)

    // ✅ Gender böyük hərflə
    formData.append("gender", gender.toUpperCase())

    formData.append("mobile_number", mobileNumber)
    formData.append("profession_area", Number(professionArea))

    // Handle "Digər" profession specialization
    if (professionSpecialization === "other") {
      formData.append("profession_speciality_other", otherSpecializationInput)
    } else {
      formData.append("profession_speciality", Number(professionSpecialization))
    }

    formData.append("experience_years", Number(workExperience))
    formData.append("education", educationLevel)
    formData.append("education_speciality", educationSpecialization)
    formData.append("note", note)

    languageSkills.forEach((langId) => formData.append("languages", langId))

    // Append selected cities and districts
    citiesForShow.cities.forEach((city) => formData.append("cities", city.id))
    citiesForShow.distinc.forEach((district) => formData.append("districts", district.id))

    if (selectedImageFile) {
      formData.append("profile_image", selectedImageFile)
    }

    console.log("🟡 Form məlumatları:")
    console.log("first_name:", firstName)
    console.log("last_name:", lastName)
    console.log("birth_date:", formattedBirthDate)
    console.log("gender:", gender.toUpperCase())
    console.log("mobile_number:", mobileNumber)
    console.log(
      "profession_speciality:",
      professionSpecialization === "other" ? otherSpecializationInput : professionSpecialization,
    )
    console.log("experience_years:", workExperience)
    console.log("education:", educationLevel)
    console.log("education_speciality:", educationSpecialization)
    console.log("languages:", languageSkills)
    console.log("profile_image:", selectedImageFile)
    console.log("Note", note)
    console.log(
      "Selected Cities (IDs):",
      citiesForShow.cities.map((c) => c.id),
    )
    console.log(
      "Selected Districts (IDs):",
      citiesForShow.distinc.map((d) => d.id),
    )

    console.log("📦 formData.entries():")
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`)
    }

    try {
      const response = await axios.patch("https://api.peshekar.online/api/v1/profile/update/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("🟢 Profil yeniləndi:", response.data)
    } catch (error) {
      console.error("🔴 Yeniləmə xətası:", error.response?.data || error.message)
    }
  }

  // Delete Account
  const handleDeleteAccountClick = async () => {
    const token = localStorage.getItem("token")
    setShowDeleteConfirmPopup(false)

    try {
      const response = await axios.delete("https://api.peshekar.online/api/v1/profile/delete/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Hesab uğurla silindi:", response.data)

      // Tokeni sil
      localStorage.removeItem("token")
    } catch (error) {
      console.error("Hesab silinərkən xəta:", error.response?.data || error.message)
    }
  }

  const handleShowpopSuccess = () => {
    setShowDeleteConfirmPopup(false)
    handleDeleteAccount()
  }

  // --- Validation Functions ---

  const validateFirstName = (name) => {
    if (!name.trim()) {
      setFirstNameError("Zəhmət olmasa, məlumatları daxil edin.")
      return false
    }

    const azRegex = /^[AaBbCcÇçDdEeƏəFfGgĞğHhXxIıİiJjKkLlMmNnOoÖöPpQqRrSsŞşTtUuÜüVvYyZz\s]+$/

    if (!azRegex.test(name)) {
      setFirstNameError("Yalnız Azərbaycan hərfləri ilə yazılmalıdır.")
      return false
    }

    if (name.length > 20) {
      setFirstNameError("Maksimum 20 simvol.")
      return false
    }

    setFirstNameError("")
    return true
  }

  const validateLastName = (surname) => {
    if (!surname.trim()) {
      setLastNameError("Zəhmət olmasa, məlumatları daxil edin.")
      return false
    }

    const azRegex = /^[AaBbCcÇçDdEeƏəFfGgĞğHhXxIıİiJjKkLlMmNnOoÖöPpQqRrSsŞşTtUuÜüVvYyZz\s]+$/
    if (!azRegex.test(surname)) {
      setLastNameError("Yalnız Azərbaycan hərfləri ilə yazılmalıdır.")
      return false
    }

    if (surname.length > 20) {
      setLastNameError("Maksimum 20 simvol.")
      return false
    }

    setLastNameError("")
    return true
  }

  const validateBirthDate = (dateString) => {
    if (!dateString) {
      setBirthDateError("Zəhmət olmasa, məlumatları daxil edin.")
      return false
    }
    const parsedDate = parse(dateString, "yyyy/MM/dd", new Date())
    if (!isValid(parsedDate)) {
      setBirthDateError("Düzgün tarix formatı daxil edin (İl/ay/gün).")
      return false
    }
    const minDate = subYears(new Date(), 15)
    if (parsedDate > minDate) {
      setBirthDateError("Yaşınız ən az 15 olmalıdır.")
      return false
    }
    setBirthDateError("")
    return true
  }

  const validateMobileNumber = (number) => {
    if (!number.trim()) {
      setMobileNumberError("Zəhmət olmasa, məlumatları daxil edin.")
      return false
    }
    const cleanedNumber = number.replace(/[^0-9]/g, "")
    if (!/^\d{9}$/.test(cleanedNumber)) {
      setMobileNumberError("Mobil nömrə düzgün daxil edilməyib. 50 123 45 67 formatında daxil edin.")
      return false
    }
    setMobileNumberError("")
    return true
  }

  const validatePassword = (pwd) => {
    if (!pwd.trim()) {
      setPasswordError("Zəhmət olmasa, məlumatları daxil edin.")
      return false
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#\-_+])[A-Za-z\d!@#\-_+]{8,15}$/
    if (!passwordRegex.test(pwd)) {
      setPasswordError(
        "Şifrəniz 8-15 simvol aralığından ibarət olmalı, özündə minimum bir böyük hərf, rəqəm və xüsusi simvol (məsələn: !, @, #, -, _) ehtiva etməlidir.",
      )
      return false
    }
    setPasswordError("")
    return true
  }

  const validateGender = (selectedGender) => {
    if (!selectedGender) {
      setGenderError("Zəhmət olmasa, seçim edin.")
      return false
    }
    setGenderError("")
    return true
  }

  const validateProfessionArea = (area) => {
    if (!area) {
      setProfessionAreaError("Zəhmət olmasa, peşə sahəsini seçin.")
      return false
    }
    setProfessionAreaError("")
    return true
  }

  const validateProfessionSpecialization = (specialization) => {
    if (!specialization) {
      setProfessionSpecializationError("Zəhmət olmasa, peşə ixtisasını seçin.")
      return false
    }
    if (specialization === "other" && !otherSpecializationInput.trim()) {
      setProfessionSpecializationError("Zəhmət olmasa, digər peşə ixtisasını daxil edin.")
      return false
    }
    setProfessionSpecializationError("")
    return true
  }

  const validateWorkExperience = (experience) => {
    if (!experience || experience <= 0) {
      setWorkExperienceError("Zəhmət olmasa, iş təcrübəsini daxil edin.")
      return false
    }
    setWorkExperienceError("")
    return true
  }

  const validateActivityArea = (citiesData) => {
    if (citiesData.cities.length === 0 && citiesData.distinc.length === 0) {
      setActivityAreaError("Zəhmət olmasa, fəaliyyət göstərdiyi ərazini seçin.")
      return false
    }
    setActivityAreaError("")
    return true
  }

  const validateEducationLevel = (level) => {
    if (!level) {
      setEducationLevelError("Zəhmət olmasa, təhsil səviyyəsini seçin.")
      return false
    }
    setEducationLevelError("")
    return true
  }

  const validateEducationSpecialization = (specialization) => {
    if (!specialization.trim() && educationLevel !== "Yoxdur") {
      setEducationSpecializationError("Zəhmət olmasa, təhsil ixtisasını daxil edin.")
      return false
    }
    setEducationSpecializationError("")
    return true
  }

  const validateLanguageSkills = (skills) => {
    if (skills.length === 0) {
      setLanguageSkillsError("Zəhmət olmasa, dil biliklərinizi seçin.")
      return false
    }
    setLanguageSkillsError("")
    return true
  }

  // --- Handlers for input changes and blur events ---
  const handleFirstNameChange = (e) => {
    const value = e.target.value
    if (/^[a-zA-ZçÇəƏğĞıİöÖşŞüÜА-Яа-яЁё\s]*$/.test(value)) {
      setFirstName(value)
      setFirstNameError("")
    }
  }

  const handleFirstNameBlur = () => {
    validateFirstName(firstName)
  }

  const handleLastNameChange = (e) => {
    const value = e.target.value
    if (/^[a-zA-ZçÇəƏğĞıİöÖşŞüÜА-Яа-яЁё\s]*$/.test(value)) {
      setLastName(value)
      setLastNameError("")
    }
  }

  const handleLastNameBlur = () => {
    validateLastName(lastName)
  }

  const handleBirthDateChange = (date) => {
    setBirthDate(date)
    validateBirthDate(date ? format(date, "yyyy/MM/dd") : "")
  }

  const handleBirthDateBlur = () => {
    validateBirthDate(birthDate)
  }

  const handleMobileNumberChange = (e) => {
    const value = e.target.value
    if (/^\d*$/.test(value) || value === "") {
      setMobileNumber(value)
      setMobileNumberError("")
    }
  }

  const handleMobileNumberBlur = () => {
    validateMobileNumber(mobileNumber)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setPasswordError("")
  }

  const handlePasswordBlur = () => {
    validatePassword(password)
  }

  const handleGenderChange = (e) => {
    setGender(e.target.value)
    setGenderError("")
  }

  const handleGenderBlur = () => {
    validateGender(gender)
  }

  const handleProfessionAreaBlur = () => {
    validateProfessionArea(professionArea)
  }

  const handleProfessionSpecializationChange = (e) => {
    setProfessionSpecialization(e.target.value)
    setProfessionSpecializationError("")
  }

  const handleProfessionSpecializationBlur = () => {
    validateProfessionSpecialization(professionSpecialization)
  }

  const handleOtherSpecializationInputChange = (e) => {
    setOtherSpecializationInput(e.target.value)
    setProfessionSpecializationError("") // Clear error as user types
  }

  const handleOtherSpecializationInputBlur = () => {
    validateProfessionSpecialization("other") // Re-validate "other" field
  }

  const handleWorkExperienceChange = (e) => {
    setWorkExperience(e.target.value)
    setWorkExperienceError("")
  }

  const handleWorkExperienceBlur = () => {
    validateWorkExperience(workExperience)
  }

  const handleActivityAreaChange = (e) => {
    setActivityArea(e.target.value)
    setActivityAreaError("")
  }
  const selectedService = filteredServices.find((s) => s.id === professionSpecialization)

  const handleProfessionSpecialityOtherChange = (e) => {
    setProfessionArea(e.target.value)
    setProfessionAreaError("")
  }

  const handleProfessionSpecialityOtherBlur = () => {
    validateProfessionArea(professionArea)
  }

  const handleActivityAreaBlur = () => {
    validateActivityArea(citiesForShow) // Validate based on citiesForShow
  }

  const handleEducationLevelChange = (e) => {
    setEducationLevel(e.target.value)
    setEducationLevelError("")
  }

  const handleEducationLevelBlur = () => {
    validateEducationLevel(educationLevel)
  }

  const handleEducationSpecializationChange = (e) => {
    setEducationSpecialization(e.target.value)
    setEducationSpecializationError("")
  }

  const handleEducationSpecializationBlur = () => {
    validateEducationSpecialization(educationSpecialization)
  }

  const handleLanguageSkillChange = (e) => {
    const langId = Number.parseInt(e.target.value)

    if (e.target.checked) {
      setLanguageSkills((prev) => [...prev, langId])
    } else {
      setLanguageSkills((prev) => prev.filter((id) => id !== langId))
    }
  }

  const handleLanguageSkillsBlur = () => {
    validateLanguageSkills(languageSkills)
  }

  //-------------------------Location-----------------------
  async function handleLocation() {
    try {
      const res = await fetch("https://api.peshekar.online/api/v1/cities/")
      const data = await res.json()
      console.log(data)
      setLocation(data)
      console.log(data)
    } catch (error) {
      console.error("Şəhərləri yükləmək mümkün olmadı:", error)
    }
  }
  // Baku Discrict
  useEffect(() => {
    fetch("https://api.peshekar.online//api/v1/districts/")
      .then((res) => res.json())
      .then((data) => {
        const baku = data.find((item) => item.display_name === "Bakı")
        console.log(data)
        if (baku && baku.sub_districts) {
          setBakuDistricts(baku.sub_districts)
        }
        // Bakı-nı siyahıdan çıxarırıq, yalnız digər rayonlar üçün
        const filtered = data.filter((item) => item.display_name !== "Bakı")
        setCities(filtered)
        // setFilteredCities(filtered); // This state is not used, filteredCities is derived from location and searchTerm
      })
  }, [])

  const toggleBaku = () => {
    setIsBakuOpen((prev) => !prev)
  }

  // Categories Side
  async function handleCategories() {
    try {
      const res = await fetch("https://api.peshekar.online/api/v1/services/")
      const data = await res.json()

      const uniqueCategories = Array.from(new Map(data.map((item) => [item.category.id, item.category])).values())

      setCategories(uniqueCategories)
      setAllServices(data)
    } catch (error) {
      console.error("Şəhərləri yükləmək mümkün olmadı:", error)
    }
  }

  const handleProfessionAreaChange = (e) => {
    const selectedCategoryId = Number.parseInt(e.target.value)
    setProfessionArea(selectedCategoryId)

    const filtered = allServices.filter((service) => service.category.id === selectedCategoryId)
    setFilteredServices(filtered)
  }

  // Language Side
  async function handleLanguage() {
    try {
      const res = await fetch("https://api.peshekar.online/api/v1/languages/")
      const data = await res.json()
      setLanguage(data)
      console.log("Fetched languages:", data) // Added console log for fetched languages
    } catch (error) {
      console.error("Dilləri yükləmək mümkün olmadı:", error)
    }
  }

  useEffect(() => {
    handleLocation()
    handleCategories()
    // handleServicies();
    handleLanguage()
  }, [])

  // --- Form submission handler ---
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate all fields and store their validation status
    const isFirstNameValid = validateFirstName(firstName)
    const isLastNameValid = validateLastName(lastName)
    const isBirthDateValid = validateBirthDate(birthDate)
    const isMobileNumberValid = validateMobileNumber(mobileNumber)
    const isPasswordValid = validatePassword(password)
    const isGenderValid = validateGender(gender)
    const isProfessionAreaValid = validateProfessionArea(professionArea)
    const isProfessionSpecializationValid = validateProfessionSpecialization(professionSpecialization)
    const isWorkExperienceValid = validateWorkExperience(workExperience)
    const isActivityAreaValid = validateActivityArea(citiesForShow) // Use citiesForShow for validation
    const isEducationLevelValid = validateEducationLevel(educationLevel)
    const isEducationSpecializationValid = validateEducationSpecialization(educationSpecialization)
    const isLanguageSkillsValid = validateLanguageSkills(languageSkills)

    // If all fields are valid, proceed with form submission logic
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
        professionSpecialization:
          professionSpecialization === "other" ? otherSpecializationInput : professionSpecialization,
        workExperience,
        selectedCities: citiesForShow.cities.map((c) => c.id),
        selectedDistricts: citiesForShow.distinc.map((d) => d.id),
        educationLevel,
        educationSpecialization,
        languageSkills,
      })
      setShowSaveSuccessPopup(true)
      updateProfile() // Call updateProfile here
    } else {
      console.log("Form has errors. Please correct them.")
      // Re-run validations to ensure errors are displayed for empty fields
      validateFirstName(firstName)
      validateLastName(lastName)
      validateBirthDate(birthDate)
      validateMobileNumber(mobileNumber)
      validatePassword(password)
      validateGender(gender)
      validateProfessionArea(professionArea)
      validateProfessionSpecialization(professionSpecialization)
      validateWorkExperience(workExperience)
      validateActivityArea(citiesForShow)
      validateEducationLevel(educationLevel)
      validateEducationSpecialization(educationSpecialization)
      validateLanguageSkills(languageSkills)
    }
  }

  // Existing handlers
  const handleSaveChanges = (e) => {
    e.preventDefault()
    handleSubmit(e) // Call handleSubmit to trigger validation and update
  }

  const handleSaveSuccessOk = () => {
    setShowSaveSuccessPopup(false)
  }

  const handleDeleteAccountCancel = () => {
    setShowDeleteConfirmPopup(false)
  }

  const handleChangeVisible = () => {
    setVisible(!visible)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setUploadedImages((prev) => [...prev, ...files])
  }

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove))
  }

  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false)
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirmPopup(true)
  }

  const handleDeleteAccountConfirm = () => {
    console.log("Account deletion confirmed!")
    // In a real app, perform actual deletion (API call)
    setShowDeleteConfirmPopup(false)
    setShowSuccessPopup(true) // Show success popup after confirming deletion
  }

  const handleSaveProfilePicture = () => {
    if (selectedImageFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        console.log("Simulating save for:", selectedImageFile.name)
        setProfileImageSrc(reader.result)
        handleClosePhotoPopup()
      }
      reader.readAsDataURL(selectedImageFile)
    } else {
      handleClosePhotoPopup()
    }
  }

  // Handler for the profile visibility toggle switch
  const handleToggleProfile = () => {
    setIsProfileVisible(!isProfileVisible)
    // In a real application, you'd send this state change to your backend
    console.log("Profile visibility toggled to:", !isProfileVisible)
  }

  const handleEditProfilePicture = () => {
    setShowPhotoPopup(true)
    // When opening, set the preview to the current profile picture
    setTempImagePreview(profileImageSrc)
    setSelectedFile(null) // Clear any previously selected file
    setZoom(50) // Reset zoom
  }
  const handleClosePhotoPopup = () => {
    setShowPhotoPopup(false)
    setTempImagePreview(null)
    setSelectedFile(null)
  }
  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleChangeImageInPopup = (event) => {
    handleFileChange(event)
  }

  // Handler for "Sil" (Delete) inside the photo popup
  const handleDeleteImageInPopup = () => {
    setTempImagePreview(null)
    setSelectedFile(null)
    // In a real app, you might set a default avatar or mark for deletion on save
  }

  const handleConfirmImage = () => {
    if (tempImagePreview && containerRef.current) {
      const image = new Image()
      image.src = tempImagePreview
      image.crossOrigin = "anonymous" // Set crossOrigin for canvas drawing

      image.onload = () => {
        const canvasSize = 220
        const canvas = document.createElement("canvas")
        canvas.width = canvasSize
        canvas.height = canvasSize
        const ctx = canvas.getContext("2d")

        const scale = 1 + (zoom - 50) / 100

        // Preview konteynerin ölçüsü
        const previewWidth = containerRef.current.offsetWidth
        const previewHeight = containerRef.current.offsetHeight

        // Şəkil orijinal ölçüdə və zoom ilə birlikdə çəkilir
        const scaledWidth = image.width * scale
        const scaledHeight = image.height * scale

        // Drag koordinatlarını scale ilə düzəlt
        const relativeX = dragPosition.x * (image.width / previewWidth)
        const relativeY = dragPosition.y * (image.height / previewHeight)

        const offsetX = (canvasSize - scaledWidth) / 2 + relativeX
        const offsetY = (canvasSize - scaledHeight) / 2 + relativeY

        // Dairəni çək və clip et
        ctx.beginPath()
        ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()

        // Şəkli çək
        ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight)

        const finalImage = canvas.toDataURL("image/png")
        setProfileImageSrc(finalImage)
        handleClosePhotoPopup()
      }
    } else {
      setProfileImageSrc("/profile.png")
      handleClosePhotoPopup()
    }
  }

  const handleZoomChange = (event) => {
    setZoom(Number.parseInt(event.target.value))
  }

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 10, 100))
  }

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 10, 0))
  }

  // Handler for the profile visibility toggle switch
  const handleToggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible)
    // In a real application, you'd send this state change to your backend
    console.log("Profile visibility toggled to:", !isProfileVisible)
  }
  //------------------------Drag------------------------------
  const onDragEnd = (result) => {
    if (!result.destination) return // boş sahəyə buraxılanda çıxır

    const items = Array.from(uploadedImages)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setUploadedImages(items)
  }

  //------------------------------------LOCATION--------------------------------
  const handleActivityAreaClick = () => {
    setOpenPopup(true)
  }

  const handleCloseActivityAreaPopup = () => {
    setOpenPopup(false)
    setCitySearchTerm("") // Clear search term when closing
  }

  const handleCityCheckboxChange = (city) => {
    setSelectedCities((prevSelectedCities) => {
      if (prevSelectedCities.includes(city)) {
        return prevSelectedCities.filter((item) => item !== city)
      } else {
        return [...prevSelectedCities, city]
      }
    })
  }

  const handleRemoveSelectedCity = (cityToRemove) => {
    setSelectedCities((prevSelectedCities) => prevSelectedCities.filter((city) => city !== cityToRemove))
  }
  // Filter Cities
  const handleCitySearchChange = (event) => {
    setCitySearchTerm(event.target.value)
  }

  const handleSelectAllCities = () => {
    // Select all visible cities from the filtered list
    const allVisibleCities = filteredCities.map((city) => city.display_name)
    setSelectedCities(allVisibleCities)
  }

  const handleClearAllCities = () => {
    setSelectedCities([])
  }

  const handleConfirmActivityAreaSelection = () => {
    // Basic validation: ensure at least one city is selected
    if (selectedCities.length === 0) {
      setActivityAreaError(true)
      // You could also show a toast notification or a more prominent message
      return
    }
    setActivityAreaError(false)
    console.log("Confirmed Activity Areas:", selectedCities)
    // In a real application, you would typically send 'selectedCities' to your backend here
    setOpenPopup(false) // Close the popup after confirmation
  }

  // Filter cities based on search term for display in the popup
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

  const filteredCities = location.filter((city) => normalizeAz(city.display_name).includes(normalizeAz(citySearchTerm)))

  // Drag process in Porfile
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startDragOffset, setStartDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    setStartDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - startDragOffset.x,
      y: e.clientY - startDragOffset.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  console.log("uploadedImages:", uploadedImages)
  const [citiesForShow, setCitiesForShow] = useState({
    cities: [],
    distinc: [],
  })
  const handleChildData = (dataFromChild) => {
    console.log("Data from CitySelectionPopup:", dataFromChild)
    // setFormData((prev) => ({ // formData is not defined in this scope
    //   ...prev,
    //   cities: [...dataFromChild.cities, ...dataFromChild.districts],
    // }));

    setCitiesForShow({
      cities: [...dataFromChild.selectedCitiesForShow].map((item) => ({
        id: item.id,
        display_name: item.display_name,
      })),
      distinc: [...dataFromChild.selectedDistrictsForShow].map((item) => ({
        id: item.id,
        display_name: item.display_name,
      })),
    })

    setOpenPopup(false)
    document.body.style.overflowY = "auto"
  }

  console.log("Current openPopup state:", openPopup)

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="w-[63.4rem] bg-[#F9FAFB] flex-grow">
        <div className="w-[66.4rem] m-auto flex justify-between items-start pt-5">
          <div className="flex gap-[1.4rem] items-center">
            <div className="relative">
              <img
                src={profileImageSrc || "/placeholder.svg"}
                alt="profil-image"
                className="w-[120px] h-[120px] object-cover object-[80%_20%] rounded-full"
              />
              <img
                src={addsvg || "/placeholder.svg"}
                alt="add-image"
                className="h-[2rem] w-[2rem] absolute bottom-2 left-[93px] cursor-pointer"
                onClick={handleEditProfilePicture}
              />
            </div>
            <div className="">
              <h1 className="text-[32px] text-[#1A4862] font-bold">Tənzimləmələr</h1>
              <p className="text-[16px] text-[#656F83]">Profil məlumatlarınızı yeniləyin.</p>
              <p className="text-[14px] text-[#1A4862] font-semibold">Qeydiyyat tarixi: {formattedRegistrationDate}</p>
            </div>
          </div>
          <div className="flex gap-[1.4rem] items-center">
            <div>
              <p className="text-[1rem] text-[#1A4862] font-medium">Profilim ana səhifədə görünsün.</p>
            </div>
            <div
              className={`
              relative w-[3rem] h-[1.5rem] cursor-pointer rounded-full flex items-center transition-colors duration-300
              ${isProfileVisible ? "bg-[#CDE4F2] justify-end" : "bg-gray-300 justify-start"}
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

        {/* Personal Information Section */}
        <div className="w-100% bg-white mt-7">
          <div className="w-[66.4rem] m-auto py-5">
            <div className="flex items-center gap-3">
              <img src={logsvg || "/placeholder.svg"} alt="log-image" className="w-[1.3rem] h-[1.3rem]" />
              <p className="text-[#1A4862] text-[1.2rem] font-bold">Şəxsi Məlumatlar</p>
            </div>
            <form action="" className="mt-5 flex justify-between flex-wrap gap-7" onSubmit={handleSubmit}>
              {/* First Name Field */}
              <div>
                <div className="flex gap-[4px]">
                  <img src={usersvg || "/placeholder.svg"} alt="user-image" className="w-[1.2rem] h-[1.2rem]" />
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
                      const isControlKey = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)

                      const isLetter = /^[a-zA-ZəöüçğışƏÖÜÇĞŞİIА-Яа-яЁё]$/.test(e.key)
                      const isValidInput = isLetter || isControlKey

                      if (!isValidInput) {
                        e.preventDefault()
                      }
                    }}
                  />
                  {firstNameError && <p className="text-[#EF4444] text-[.8rem] mt-1">{firstNameError}</p>}
                </div>
              </div>
              {/* Last Name Field */}
              <div>
                <div className="flex gap-[4px]">
                  <img src={usersvg || "/placeholder.svg"} alt="user-image" className="w-[1.2rem] h-[1.2rem]" />
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
                  {lastNameError && <p className="text-[#EF4444] text-[.8rem] mt-1">{lastNameError}</p>}
                </div>
              </div>
              {/* Birth Date Field */}
              <div>
                <div className="flex gap-[4px]">
                  <img src={calendarsvg || "/placeholder.svg"} alt="user-image" className="w-[1.2rem] h-[1.2rem]" />
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
                    maxDate={subYears(new Date(), 15)} // Bu 15 yaşdan cavan tarixləri təqvimdə deaktiv edir
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    calendarStartDay={1}
                    onChangeRaw={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 8)
                      let formatted = ""

                      if (val.length >= 4) {
                        formatted += val.slice(0, 4)
                        if (val.length >= 6) {
                          formatted += "/" + val.slice(4, 6)
                          if (val.length > 6) {
                            formatted += "/" + val.slice(6, 8)
                          }
                        } else if (val.length > 4) {
                          formatted += "/" + val.slice(4)
                        }
                      } else {
                        formatted = val
                      }

                      e.target.value = formatted
                      setBirthDate(formatted)
                      validateBirthDate(formatted) // Validate manual input
                    }}
                    onKeyDown={(e) => {
                      const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"]
                      if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    className={`w-[27.5rem] h-[3rem] border ${
                      birthDateError ? "border-red-500" : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                  />
                  {birthDateError && <p className="text-[#EF4444] text-[.8rem] mt-1">{birthDateError}</p>}
                </div>
              </div>
              {/* Mobile Number Field */}
              <div>
                <div className="flex gap-[4px]">
                  <img src={callsvg || "/placeholder.svg"} alt="user-image" className="w-[1.2rem] h-[1.2rem]" />
                  <p className="text-[#656F83] text-[.8rem]">Mobil nömrə</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>
                <div>
                  <div
                    className={`w-[27.5rem] h-[3rem] border ${
                      mobileNumberError ? "border-red-500" : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                  >
                    <span className=" text-[#1A4862] font-semibold px-3">+994</span>
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
                  {mobileNumberError && <p className="text-[#EF4444] text-[.8rem] mt-1">{mobileNumberError}</p>}
                </div>
              </div>
              {/* Password Field */}
              <div>
                <div className="flex gap-[4px]">
                  <img src={locksvg || "/placeholder.svg"} alt="user-image" className="w-[1.2rem] h-[1.2rem]" />
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
                    <img
                      onClick={handleChangeVisible}
                      src={`${visible ? eyesvg : "/invisible.svg"}`}
                      alt="eye-icon"
                      className="w-6 h-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    />
                  </div>
                  {passwordError && <p className="w-[450px] text-[#EF4444] text-[.8rem] mt-1">{passwordError}</p>}
                </div>
              </div>
              {/* Gender Selection */}
              <div>
                <div className="flex gap-[4px]">
                  <img src={cinssvg || "/placeholder.svg"} alt="user-image" className="w-[1.2rem] h-[1.2rem]" />
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
                {genderError && <p className="text-[#EF4444] text-[.8rem] mt-1">{genderError}</p>}
              </div>
            </form>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="w-100% bg-white mt-7">
          <div className="w-[66.4rem] m-auto py-5">
            <div className="flex items-center gap-3">
              <img src={datasvg || "/placeholder.svg"} alt="log-image" className="w-[1.3rem] h-[1.3rem]" />
              <p className="text-[#1A4862] text-[1.2rem] font-bold">Peşə Məlumatları</p>
            </div>
            <form action="" className="mt-5 flex justify-between flex-wrap gap-7">
              {/* Peşə sahəsi */}
              <div>
                <div className="flex gap-[4px] mb-1">
                  <img src={worksvg || "/placeholder.svg"} alt="work-image" className="w-[1.2rem] h-[1.2rem]" />
                  <p className="text-[#656F83] text-[.8rem]">Peşə sahəsi</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>

                {/* Relative div => custom ox üçün */}
                <div className="relative w-[27.5rem]">
                  <select
                    className={`w-full h-[3rem] border ${professionAreaError ? "border-red-500" : "border-[#C3C8D1]"} 
        rounded-lg outline-none pr-10 pl-3 text-[#1A4862] font-semibold appearance-none`}
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

                  {/* Sağda custom SVG oxu */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-5 h-5 text-[#1A4862]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {professionAreaError && <p className="text-[#EF4444] text-[.8rem] mt-1">{professionAreaError}</p>}
              </div>

              {/* Peşə ixtisası */}
              <div>
                <div className="flex gap-[4px] mb-1">
                  <img src={placesvg || "/placeholder.svg"} alt="place-image" className="w-[1.2rem] h-[1.2rem]" />
                  <p className="text-[#656F83] text-[.8rem]">Peşə ixtisası</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>

                <div className="relative w-[27.5rem]">
                  <select
                    className={`w-full h-[3rem] border ${
                      professionSpecializationError ? "border-red-500" : "border-[#C3C8D1]"
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
                    <option value="other">Digər</option> {/* "Digər" seçimi */}
                  </select>

                  {/* Sağda custom SVG oxu */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-5 h-5 text-[#1A4862]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {professionSpecialization === "other" && (
                  <div className="mt-2">
                    <input
                      type="text"
                      maxLength={50}
                      placeholder="Peşə ixtisasını daxil edin"
                      className={`w-[27.5rem] h-[3rem] border ${
                        professionSpecializationError ? "border-red-500" : "border-[#C3C8D1]"
                      } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                      value={otherSpecializationInput}
                      onChange={handleOtherSpecializationInputChange}
                      onBlur={handleOtherSpecializationInputBlur}
                    />
                  </div>
                )}

                {professionSpecializationError && (
                  <p className="text-[#EF4444] text-[.8rem] mt-1">{professionSpecializationError}</p>
                )}
              </div>

              {/* İş təcrübəsi */}
              <div>
                <div className="flex gap-[4px]">
                  <img src={practicesvg || "/placeholder.svg"} alt="practice-image" className="w-[1.2rem] h-[1.2rem]" />
                  <p className="text-[#656F83] text-[.8rem]">İş təcrübəsi (il)</p>
                  <p className="text-[#EF4444] text-[1rem]">*</p>
                </div>
                <div className="w-[27.4rem] h-[3rem] rounded-lg flex items-center gap-4 text-[#1A4862]">
                  <input
                    type="number"
                    min="0"
                    className={`w-[27.5rem] h-[3rem] border ${
                      workExperienceError ? "border-red-500" : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                    value={workExperience}
                    onChange={handleWorkExperienceChange}
                    onBlur={handleWorkExperienceBlur}
                  />
                </div>
                {workExperienceError && <p className="text-[#EF4444] text-[.8rem] mt-1">{workExperienceError}</p>}
              </div>
              {/* Fəaliyyət göstərdiyi ərazi */}
              <div className="flex gap-[4px]">
                {/* Placeholder for other form fields */}

                {/* --- Fəaliyyət ərazisi (Activity Area) - Custom Select UI --- */}
                <div className="mb-4">
                  <div className="flex gap-[4px]">
                    <img
                      src={locationsvg || "/placeholder.svg"}
                      alt="location-image"
                      className="w-[1.2rem] h-[1.2rem]"
                    />
                    <label htmlFor="activity-area" className="block text-[#656F83] text-[.8rem]">
                      Fəaliyyət göstərdiyi ərazi{" "}
                    </label>
                    <p className="text-[#EF4444] text-[1rem]">*</p>
                  </div>
                  <input
                    type="text"
                    readOnly
                    onClick={() => {
                      console.log("Activity area input clicked, setting openPopup to true")
                      setOpenPopup(true)
                    }}
                    placeholder={
                      citiesForShow.cities.length > 0 || citiesForShow.distinc.length > 0
                        ? [
                            ...citiesForShow.cities.map((item) => item.display_name),
                            ...citiesForShow.distinc.map((item) => item.display_name),
                          ].join(", ") // Join array elements for display
                        : "Ərazi seç"
                    }
                    className={`w-[27.5rem] h-[3rem] border ${
                      activityAreaError ? "border-red-500" : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                    onBlur={handleActivityAreaBlur} // Add onBlur for validation
                  />
                  {activityAreaError && <p className="text-red-500 text-sm mt-1">Fəaliyyət ərazisi seçilməlidir.</p>}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Education and Skills Section */}
        <div className="w-100% bg-white mt-7">
          <div className="w-[66.4rem] m-auto py-5">
            <div className="flex items-center gap-3">
              <img src={teachersvg || "/placeholder.svg"} alt="education-icon" className="w-[1.3rem] h-[1.3rem]" />
              <p className="text-[#1A4862] text-[1.2rem] font-bold">Təhsil və Bacarıqlar</p>
            </div>

            <form action="" className="mt-5 flex justify-between flex-wrap gap-7">
              {/* Təhsil */}
              <div>
                <div className="flex gap-[4px]">
                  <img src={schoolsvg || "/placeholder.svg"} alt="university-icon" className="w-[1.2rem] h-[1.2rem]" />
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
                        value="Tam ali"
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
                      <label htmlFor="ortaIxtisasTehsili">Orta ixtisas təhsili</label>
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
                {educationLevelError && <p className="text-[#EF4444] text-[.8rem] mt-1">{educationLevelError}</p>}
              </div>
              {/* Təhsil ixtisası */}
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
                      educationSpecializationError && educationLevel !== "Yoxdur"
                        ? "border-red-500"
                        : "border-[#C3C8D1]"
                    } rounded-lg outline-none p-2 text-[#1A4862] font-semibold`}
                    value={educationSpecialization}
                    onChange={handleEducationSpecializationChange}
                    onBlur={handleEducationSpecializationBlur}
                    disabled={educationLevel === "Yoxdur"} // Disable if "Yoxdur" is selected
                  />
                  {educationLevel !== "Yoxdur" && educationSpecializationError && (
                    <p className="text-[#EF4444] text-[.8rem] mt-1">{educationSpecializationError}</p>
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
                        checked={languageSkills.includes(lang.id)}
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

        {/* Additional Information Section */}
        <div className="w-100% bg-white mt-7">
          <div className="w-[66.4rem] m-auto py-5">
            <div className="flex items-center gap-3">
              <img src={infosvg || "/placeholder.svg"} alt="log-image" className="w-[1.3rem] h-[1.3rem]" />
              <p className="text-[#1A4862] text-[1.2rem] font-bold">Əlavə məlumatlar</p>
            </div>

            <div className="mt-5">
              <p className="text-[#1A4862] text-[1rem] font-bold">
                Gördüyünüz işlər{" "}
                <span className="text-[#656F83] text-[.9rem] font-semibold">(Max 10 ədəd şəkil yüklənilə bilər.)</span>
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
                  <img src="/src/assets/upload.svg" alt="upload-icon" className="w-6 h-6" />
                  <p className="text-[.8rem] mt-1">JPG/PNG</p>
                </div>
                {/* Dynamically rendered uploaded images */}
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                      <div className="flex gap-2" {...provided.droppableProps} ref={provided.innerRef}>
                        {uploadedImages.map((image, index) => (
                          <Draggable key={index} draggableId={`image-${index}`} index={index}>
                            {(provided, snapshot) => (
                              <div
                                className={`relative w-[7.5rem] h-[7.5rem] rounded-lg overflow-hidden ${
                                  snapshot.isDragging ? "opacity-70" : "opacity-100"
                                }`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <img
                                  src={typeof image === "string" ? image : URL.createObjectURL(image)}
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
              <p className="text-[#656F83] text-[.8rem] mt-2">Şəkillərin sırasını dəyişmək üçün sürükləyin.</p>
            </div>

            <div className="mt-10">
              <p className="text-[#1A4862] text-[1.2rem] font-bold">Sosial şəbəkə linkləri</p>
              <p className="text-[#656F83] text-[.8rem] mt-1">
                Peşənizlə əlaqədar sosial şəbəkə səhifəsinin (olduqda) linkini əlavə edə bilərsiniz.
              </p>

              <div className="flex items-center border border-[#C3C8D1] rounded-lg h-[3rem] mt-3 p-3 gap-3">
                <img src={facebooksvg || "/placeholder.svg"} alt="facebook-icon" className="w-5 h-5" />
                <a
                  href="https://www.facebook.com/creative.elchin"
                  target="_blank"
                  className="w-full outline-none text-[#1A4862] font-semibold"
                  rel="noreferrer"
                >
                  https://www.facebook.com/creative.elchin
                </a>
              </div>
              <div className="flex items-center border border-[#C3C8D1] rounded-lg h-[3rem] mt-3 p-3 gap-3">
                <img src={instagramsvg || "/placeholder.svg"} alt="instagram-icon" className="w-5 h-5" />
                <a
                  href="https://www.instagram.com/elchin.creative/"
                  target="_blank"
                  className="w-full outline-none text-[#1A4862] font-semibold"
                  rel="noreferrer"
                >
                  https://www.instagram.com/elchin.creative/
                </a>
              </div>
              <div className="flex items-center border border-[#C3C8D1] rounded-lg h-[3rem] mt-3 p-3 gap-3">
                <img src={tiktoksvg || "/placeholder.svg"} alt="tiktok-icon" className="w-5 h-5" />
                <a
                  href="https://www.tiktok.com/@uxelchin"
                  target="_blank"
                  className="w-full outline-none text-[#1A4862] font-semibold"
                  rel="noreferrer"
                >
                  https://www.tiktok.com/@uxelchin
                </a>
              </div>
              <div className="flex items-center border border-[#C3C8D1] rounded-lg h-[3rem] mt-3 p-3 gap-3">
                <img src={linkedinsvg || "/placeholder.svg"} alt="linkedin-icon" className="w-5 h-5" />
                <a
                  href="https://www.linkedin.com/in/elchin-design-12345/"
                  target="_blank"
                  className="w-full outline-none text-[#1A4862] font-semibold"
                  rel="noreferrer"
                >
                  https://www.linkedin.com/in/elchin-design-12345/
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* About You and Action Buttons Section */}
        <div className="w-100% bg-white mt-7 mb-7">
          <div className="w-[66.4rem] m-auto py-5">
            <div className="flex items-center gap-3">
              <img src={datasvg || "/placeholder.svg"} alt="log-image" className="w-[1.3rem] h-[1.3rem]" />
              <p className="text-[#1A4862] text-[1.2rem] font-bold">Haqqınızda</p>
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
                <img src={trashsvg || "/placeholder.svg"} alt="trash-icon" className="w-5 h-5" />
                Hesabı sil
              </button>

              <form onSubmit={handleSaveChanges}>
                {/* inputlar */}

                <button
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                  className="cursor-pointer flex items-center gap-2 bg-[#1A4862] text-white text-[.9rem] font-semibold px-4 py-2 rounded-lg hover:bg-[#255C80]"
                >
                  <img src={savesvg || "/placeholder.svg"} alt="trash-icon" className="w-5 h-5" />
                  Dəyişiklikləri yadda saxla
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Photo Upload Popup */}
        {showPhotoPopup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-[25rem]">
              {/* Header with close button */}
              <div className="flex justify-center p-5 items-center mb-4">
                <h2 className="text-xl font-bold text-[#1A4862]">Şəkli dairəyə yerləşdirin.</h2>
                {/* <button onClick={handleClosePhotoPopup} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">
                     &times;
                 </button> */}
              </div>

              {/* Image Cropping Area */}
              <div className="w-[22rem] relative bg-gray-100 rounded-lg overflow-hidden mb-6 flex items-center justify-center h-64">
                {tempImagePreview ? (
                  <>
                    {/* Image container for visual effect (without actual cropping) */}
                    <div className="relative w-[31rem] h-full flex items-center justify-center">
                      {/* Blurred background image for effect */}
                      <img
                        src={tempImagePreview || "/placeholder.svg"}
                        alt="Background Blur"
                        className="w-full h-full object-cover blur-sm opacity-70"
                      />
                      {/* The circular cropping mask and the actual image */}
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
                            transform: `translate(${position.x}px, ${position.y}px) scale(${1 + (zoom - 50) / 100})`,
                            objectPosition: "50% 50%",
                            transition: isDragging ? "none" : "transform 0.1s ease-out",
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
              {/* "Şəkli dəyiş" and "Sil" buttons */}
              <div className="flex flex-col items-center mb-2 justify-center gap-1">
                <label htmlFor="change-photo-input" className="cursor-pointer text-sm font-semibold text-blue-600">
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

              {/* Zoom Slider and Text */}
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-xl text-gray-600 cursor-pointer" onClick={handleZoomOut}>
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
                <span className="text-xl text-gray-600 cursor-pointer" onClick={handleZoomIn}>
                  +
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6 text-center">Böyütmək üçün sürüşdürün.</p>

              {/* Action Buttons */}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Success Popup */}
      {showSaveSuccessPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[25rem] text-center">
            <h2 className="text-xl font-bold text-[#1A4862] mb-2">Məlumatlar yadda saxlanıldı!</h2>
            <p className="text-gray-600 mb-4">Dəyişikliklər uğurla qeydə alındı.</p>
            <button
              className="cursor-pointer px-6 py-2 bg-[#1A4862] text-white rounded-lg hover:bg-[#255C80]"
              onClick={handleSaveSuccessOk}
            >
              Bağla
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirmPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[25rem] text-center">
            <h2 className="text-xl font-bold text-[#EF4444] mb-2">Hesabı silmək</h2>
            <p className="text-gray-600 mb-4">Hesabınızı silmək istədiyinizə əminsiniz?</p>
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
      {/* --- Success Popup --- */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[25rem] text-center">
            <h2 className="text-xl font-bold text-green-600 mb-2">Uğurlu!</h2>
            <p className="text-gray-600 mb-4">Hesabınız uğurla silindi.</p>
            <button
              className="cursor-pointer px-4 py-2 text-white rounded-lg bg-[#1A4862] hover:bg-[#2A5872] transition-colors"
              onClick={handleSuccessPopupClose}
            >
              Ok
            </button>
          </div>
        </div>
      )}
      {/* --showActivityAreaPopup- Activity Area Selection Popup --- */}
      {openPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm  bg-black/50">
          <div className="w-[65%] h-[90%] rounded-2xl bg-image overflow-hidden shadow-lg">
            <CitySelectionPopup onSendData={handleChildData} cities={citiesForShow} />
          </div>
        </div>
      )}
    </div>
  )
}
