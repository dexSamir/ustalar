
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  GripVertical,
} from "lucide-react";
import Footer from "../../components/Footer";
import SuccessModal from "../../components/SuccessModal";
import ImageEditor from "../../components/ImageEditor";

function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formDataErrors, setFormDataErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    password2: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    buttonText: "Tamam",
    redirectPath: null,
  });

  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    mobile_number: "",
    password: "",
    password2: "",
    gender: "",
    profession_area: "",
    profession_speciality: "",
    custom_profession: "",
    experience_years: "",
    cities: [],
    education: "",
    education_speciality: "",
    languages: [],
    profile_image: null,
    facebook: "",
    instagram: "",
    tiktok: "",
    linkedin: "",
    work_images: [],
    note: "",
  });

  const educationOptions = [
    { id: 0, label: "Yoxdur" },
    { id: 1, label: "Tam ali" },
    { id: 2, label: "Natamam ali" },
    { id: 3, label: "Orta" },
    { id: 4, label: "Peşə təhsili" },
    { id: 5, label: "Orta ixtisas təhsili" },
  ];

  const languageOptions = [
    { id: 1, label: "Azərbaycan" },
    { id: 2, label: "İngilis" },
    { id: 3, label: "Rus" },
  ];

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);

  const showModal = (
    type,
    title,
    message,
    buttonText = "Tamam",
    redirectPath = null
  ) => {
    setModalConfig({ title, message, buttonText, redirectPath });

    if (type === "success") {
      setShowSuccessModal(true);
    } else if (type === "error") {
      setShowErrorModal(true);
    } else if (type === "info") {
      setShowInfoModal(true);
    }
  };

  const closeAllModals = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setShowInfoModal(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);

        const categoriesResponse = await fetch(
          "https://masters-1.onrender.com/api/v1/categories/"
        );
        const categoriesData = await categoriesResponse.json();
        console.log("Categories data:", categoriesData);
        setCategories(categoriesData.results || categoriesData);

        const servicesResponse = await fetch(
          "https://masters-1.onrender.com/api/v1/services/"
        );
        const servicesData = await servicesResponse.json();
        console.log("Services data:", servicesData);
        setServices(servicesData.results || servicesData);

        const citiesResponse = await fetch(
          "https://masters-1.onrender.com/api/v1/cities/"
        );
        const citiesData = await citiesResponse.json();
        console.log("Cities data:", citiesData);
        setCities(citiesData.results || citiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        showModal(
          "error",
          "Məlumat Yükləmə Xətası",
          "Məlumatlar yüklənərkən xəta baş verdi. Səhifəni yeniləyin.",
          "Yenilə",
          window.location.pathname
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleLanguageChange = (e) => {
    const value = Number.parseInt(e.target.value);
    const isChecked = e.target.checked;

    setFormData((prevData) => {
      let updatedLanguages = [...prevData.languages];

      if (isChecked) {
        if (!updatedLanguages.includes(value)) {
          updatedLanguages.push(value);
        }
      } else {
        updatedLanguages = updatedLanguages.filter((id) => id !== value);
      }

      return { ...prevData, languages: updatedLanguages };
    });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormDataErrors((prev) => ({
          ...prev,
          profile_image: "Şəkil ölçüsü 5MB-dan çox ola bilməz",
        }));
        return;
      }
      setEditingImage(file);
      setShowImageEditor(true);
    }
  };

  const handleImageEditSave = (editedFile) => {
    setFormData((prev) => ({ ...prev, profile_image: editedFile }));
    setFormDataErrors((prev) => ({ ...prev, profile_image: "" }));
    setShowImageEditor(false);
    setEditingImage(null);
  };

  const handleImageEditCancel = () => {
    setShowImageEditor(false);
    setEditingImage(null);
  };

  const handlePortfolioChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (formData.work_images.length + files.length > 10) {
      setFormDataErrors((prev) => ({
        ...prev,
        work_images: "Maksimum 10 şəkil yükləyə bilərsiniz",
      }));
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setFormDataErrors((prev) => ({
        ...prev,
        work_images: "Hər şəkil 5MB-dan çox ola bilməz",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      work_images: [...prev.work_images, ...files],
    }));
    setFormDataErrors((prev) => ({ ...prev, work_images: "" }));
  };

  const removeWorkImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      work_images: prev.work_images.filter((_, i) => i !== index),
    }));
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null) return;

    const newImages = [...formData.work_images];
    const draggedImage = newImages[draggedIndex];

    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    setFormData((prev) => ({ ...prev, work_images: newImages }));
    setDraggedIndex(null);
  };

  const validateForm = () => {
    const errors = {};

    if (step === 1) {
      if (!formData.first_name.trim())
        errors.first_name = "Ad daxil edilməlidir";
      if (!formData.last_name.trim())
        errors.last_name = "Soyad daxil edilməlidir";
      if (!formData.birth_date)
        errors.birth_date = "Doğum tarixi daxil edilməlidir";
      if (!formData.mobile_number.trim())
        errors.mobile_number = "Mobil nömrə daxil edilməlidir";
      if (!formData.password) errors.password = "Şifrə daxil edilməlidir";
      if (!formData.password2)
        errors.password2 = "Şifrə təkrarı daxil edilməlidir";
      if (formData.password !== formData.password2)
        errors.password2 = "Şifrələr uyğun deyil";
      if (!formData.gender) errors.gender = "Cins seçilməlidir";
    }

    if (step === 2) {
      if (!formData.profession_area)
        errors.profession_area = "Peşə sahəsi seçilməlidir";
      if (!formData.profession_speciality)
        errors.profession_speciality = "Peşə ixtisası seçilməlidir";
      if (!formData.experience_years)
        errors.experience_years = "İş təcrübəsi daxil edilməlidir";
      if (formData.cities.length === 0)
        errors.cities = "Ən azı bir şəhər seçilməlidir";
    }

    if (step === 3) {
      if (formData.education === "")
        errors.education = "Təhsil səviyyəsi seçilməlidir";
      if (formData.education !== 0 && !formData.education_speciality.trim()) {
        errors.education_speciality = "Təhsil ixtisası daxil edilməlidir";
      }
      if (formData.languages.length === 0)
        errors.languages = "Ən azı bir dil seçilməlidir";
    }

    setFormDataErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("first_name", formData.first_name.trim());
      formDataToSend.append("last_name", formData.last_name.trim());
      formDataToSend.append("birth_date", formData.birth_date);
      formDataToSend.append("mobile_number", formData.mobile_number.trim());
      formDataToSend.append("password", formData.password);
      formDataToSend.append("password2", formData.password2);
      formDataToSend.append("gender", formData.gender);

      formDataToSend.append(
        "profession_area",
        Number(formData.profession_area)
      );
      formDataToSend.append(
        "profession_speciality",
        Number(formData.profession_speciality)
      );
      formDataToSend.append(
        "experience_years",
        Number(formData.experience_years)
      );

      formDataToSend.append("education", Number(formData.education));
      if (formData.education !== 0) {
        formDataToSend.append(
          "education_speciality",
          formData.education_speciality.trim()
        );
      }

      if (formData.note.trim()) {
        formDataToSend.append("note", formData.note.trim());
      }

      formData.cities.forEach((cityId) => {
        formDataToSend.append("cities", Number(cityId));
      });

      formData.languages.forEach((langId) => {
        formDataToSend.append("languages", Number(langId));
      });

      if (formData.facebook.trim())
        formDataToSend.append("facebook", formData.facebook.trim());
      if (formData.instagram.trim())
        formDataToSend.append("instagram", formData.instagram.trim());
      if (formData.tiktok.trim())
        formDataToSend.append("tiktok", formData.tiktok.trim());
      if (formData.linkedin.trim())
        formDataToSend.append("linkedin", formData.linkedin.trim());

      if (formData.profile_image) {
        formDataToSend.append("profile_image", formData.profile_image);
      }

      formData.work_images.forEach((file) => {
        formDataToSend.append("work_images", file);
      });

      if (formData.custom_profession.trim()) {
        formDataToSend.append(
          "custom_profession",
          formData.custom_profession.trim()
        );
      }

      console.log("Sending data:", Object.fromEntries(formDataToSend));

      const response = await fetch(
        "https://masters-1.onrender.com/api/v1/register/",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (response.ok) {
        showModal(
          "success",
          "Qeydiyyat Tamamlandı!",
          "Profiliniz uğurla yaradıldı. İndi hesabınıza daxil ola bilərsiniz.",
          "Hesabıma keç",
          "/login"
        );
      } else {
        console.error("Server error:", result);
        const errorMessage =
          typeof result === "object"
            ? Object.entries(result)
                .map(
                  ([key, value]) =>
                    `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
                )
                .join("\n")
            : result.message || "Naməlum xəta";

        showModal(
          "error",
          "Qeydiyyat Xətası",
          `Qeydiyyat zamanı xəta baş verdi:\n${errorMessage}`,
          "Yenidən cəhd et"
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      showModal(
        "error",
        "Şəbəkə Xətası",
        "Şəbəkə xətası baş verdi. Zəhmət olmasa yenidən cəhd edin.",
        "Yenidən cəhd et"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, multiple, options } = e.target;

    if (multiple) {
      const values = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => Number.parseInt(opt.value));

      setFormData((prev) => ({
        ...prev,
        [name]: values,
      }));
    } else {
      if (name === "first_name" || name === "last_name") {
        const azOnlyLettersRegex =
          /^[AaBbCcÇçDdEeƏəFfGgĞğHhİiIıJjKkLlMmNnOoÖöPpRrSsŞşTtUuÜüVvYyZz\s]*$/;
        if (value.length > 20) {
          setFormDataErrors((prev) => ({
            ...prev,
            [name]: "Ən çox 20 simvol ola bilər",
          }));
        } else if (value && !azOnlyLettersRegex.test(value)) {
          setFormDataErrors((prev) => ({
            ...prev,
            [name]: "Yalnız Azərbaycan hərfləri ilə yazılmalıdır",
          }));
        } else {
          setFormDataErrors((prev) => ({
            ...prev,
            [name]: "",
          }));
        }
      }

      if (name === "mobile_number") {
        const valueWithoutSpaces = value.replace(/\s/g, "");
        const onlyDigits = /^\d*$/;

        if (!onlyDigits.test(valueWithoutSpaces)) {
          setFormDataErrors((prev) => ({
            ...prev,
            [name]: "Yalnız rəqəmlərdən ibarət olmalıdır",
          }));
        } else if (valueWithoutSpaces.length > 9) {
          setFormDataErrors((prev) => ({
            ...prev,
            [name]: "Maksimum 9 rəqəm ola bilər",
          }));
        } else if (
          valueWithoutSpaces.length > 0 &&
          valueWithoutSpaces.length !== 9
        ) {
          setFormDataErrors((prev) => ({
            ...prev,
            [name]: "Tam 9 rəqəm olmalıdır",
          }));
        } else {
          setFormDataErrors((prev) => ({
            ...prev,
            [name]: "",
          }));
        }
      }

      if (name === "password") {
        const passwordRegex =
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#\-_+])[A-Za-z\d!@#\-_+]{8,15}$/;

        if (value && !passwordRegex.test(value)) {
          setFormDataErrors((prev) => ({
            ...prev,
            [name]: "Şifrə tələblərə uyğun deyil",
          }));
        } else {
          setFormDataErrors((prev) => ({
            ...prev,
            [name]: "",
          }));
        }
      }

      if (name === "password2") {
        if (value !== formData.password) {
          setFormDataErrors((prev) => ({
            ...prev,
            password2: "Şifrələr uyğun deyil",
          }));
        } else {
          setFormDataErrors((prev) => ({
            ...prev,
            password2: "",
          }));
        }
      }

      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number.parseInt(value) || "" : value,
      }));
    }
  };

  const handleClick = () => {
    navigate("/login");
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center mb-6">
      {[1, 2, 3].map((stepNum) => (
        <React.Fragment key={stepNum}>
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
              step >= stepNum
                ? "bg-[#1A4862] text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {stepNum}
          </div>
          {stepNum < 3 && (
            <div
              className={`w-12 h-0.5 mx-2 ${
                step > stepNum ? "bg-[#1A4862]" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A4862] mx-auto mb-4"></div>
          <p className="text-gray-600">Məlumatlar yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#1A4862] px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Paputi</h1>
          <button
            onClick={handleClick}
            className="text-white text-sm hover:underline"
          >
            Hesabınız var? Daxil olun
          </button>
        </div>
      </div>

      <div className="bg-[#E8F4F8] py-12 flex-shrink-0">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A4862] mb-4">
            Peşə Sahibləri Platformasına
            <br />
            Xoş Gəlmisiniz!
          </h1>
          <p className="text-gray-600 text-lg">
            Peşəkar xidmətlərinizi paylaşmaq üçün qeydiyyatdan keçin.
          </p>
        </div>
      </div>

      <div
        className="flex-1 py-12 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/background.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-md mx-auto">
          {step === 1 && (
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
              {renderStepIndicator()}
              <p className="text-center text-sm text-gray-600 mb-6">
                Addım 1/3
              </p>

              <h2 className="text-xl font-semibold text-[#1A4862] mb-6 text-center">
                Şəxsi məlumatlar
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Adınızı daxil edin"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                      formDataErrors.first_name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formDataErrors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Soyadınızı daxil edin"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                      formDataErrors.last_name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formDataErrors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.last_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doğum tarixi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                      formDataErrors.birth_date
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formDataErrors.birth_date && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.birth_date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobil nömrə <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l-lg text-gray-700 text-sm">
                      +994
                    </span>
                    <input
                      type="text"
                      name="mobile_number"
                      value={formData.mobile_number}
                      onChange={handleChange}
                      placeholder="503171409"
                      className={`w-full px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                        formDataErrors.mobile_number
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formDataErrors.mobile_number && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.mobile_number}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şifrə <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPasswords.password ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Şifrənizi daxil edin"
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                      formDataErrors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility("password")}
                  >
                    {showPasswords.password ? (
                      <Eye size={16} />
                    ) : (
                      <EyeOff size={16} />
                    )}{" "}
                  </button>
                  {formDataErrors.password ? (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.password}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Şifrə ən azı 8 simvoldan ibarət olmalı, böyük hərf, rəqəm
                      və xüsusi simvol ehtiva etməlidir
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şifrəni təkrar yazın <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPasswords.password2 ? "text" : "password"}
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    placeholder="Şifrənizi təkrar daxil edin"
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                      formDataErrors.password2
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility("password2")}
                  >
                    {showPasswords.password2 ? (
                      <Eye size={16} />
                    ) : (
                      <EyeOff size={16} />
                    )}{" "}
                  </button>
                  {formDataErrors.password2 && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.password2}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cins <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="MALE"
                        onChange={handleChange}
                        className="w-4 h-4 text-[#1A4862]"
                      />
                      <span className="text-sm">Kişi</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="FEMALE"
                        onChange={handleChange}
                        className="w-4 h-4 text-[#1A4862]"
                      />
                      <span className="text-sm">Qadın</span>
                    </label>
                  </div>
                  {formDataErrors.gender && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.gender}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-[#1A4862] text-white py-3 rounded-lg mt-6 font-medium hover:bg-[#1A4862]/90 transition-colors flex items-center justify-center gap-2"
                onClick={handleNext}
              >
                Növbəti <ArrowRight />
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Hesabınız var?{" "}
                <button
                  onClick={handleClick}
                  className="text-[#3B82F6] hover:underline"
                >
                  Daxil olun
                </button>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
              {renderStepIndicator()}
              <p className="text-center text-sm text-gray-600 mb-6">
                Addım 2/3
              </p>

              <h2 className="text-xl font-semibold text-[#1A4862] mb-6 text-center">
                Peşə məlumatları
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peşə sahəsi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="profession_area"
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                      formDataErrors.profession_area
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    value={formData.profession_area}
                  >
                    <option value="">Peşə sahəsini seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.display_name || category.name}
                      </option>
                    ))}
                  </select>
                  {formDataErrors.profession_area && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.profession_area}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peşə ixtisası <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="profession_speciality"
                    value={formData.profession_speciality}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                      formDataErrors.profession_speciality
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Peşə ixtisasını seçin</option>
                    {services
                      .filter((service) => {
                        if (!formData.profession_area) return true;

                        const selectedCategory = categories.find(
                          (cat) => cat.id == formData.profession_area
                        );
                        if (!selectedCategory) return false;

                        return service.category === selectedCategory.name;
                      })
                      .map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.display_name || service.name}
                        </option>
                      ))}
                  </select>
                  {formDataErrors.profession_speciality && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.profession_speciality}
                    </p>
                  )}
                </div>

                {services
                  .find((s) => s.id == formData.profession_speciality)
                  ?.name?.toLowerCase()
                  .includes("digər") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Xüsusi peşə <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="custom_profession"
                      value={formData.custom_profession}
                      onChange={handleChange}
                      placeholder="Peşənizi daxil edin"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İş təcrübəsi (il) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    placeholder="Məsələn: 4"
                    onChange={handleChange}
                    min="0"
                    max="50"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                      formDataErrors.experience_years
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formDataErrors.experience_years && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.experience_years}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fəaliyyət göstərdiyi ərazi{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="cities"
                    value={formData.cities}
                    multiple
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                      formDataErrors.cities
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    size="4"
                  >
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.display_name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Ctrl/Cmd basaraq bir neçə şəhər seçə bilərsiniz
                  </p>
                  {formDataErrors.cities && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.cities}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-[#1A4862] text-[#1A4862] py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft /> Geri
                </button>
                <button
                  type="button"
                  className="flex-1 bg-[#1A4862] text-white py-3 rounded-lg font-medium hover:bg-[#1A4862]/90 transition-colors flex items-center justify-center gap-2"
                  onClick={handleNext}
                >
                  Növbəti <ArrowRight />
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-4">
                Hesabınız var?{" "}
                <button
                  onClick={handleClick}
                  className="text-[#3B82F6] hover:underline"
                >
                  Daxil olun
                </button>
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
              {renderStepIndicator()}
              <p className="text-center text-sm text-gray-600 mb-6">
                Addım 3/3
              </p>

              <h2 className="text-xl font-semibold text-[#1A4862] mb-6 text-center">
                Əlavə məlumatlar
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Təhsil <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {educationOptions.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="education"
                          value={option.id}
                          checked={formData.education === option.id}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              education: Number.parseInt(e.target.value),
                            }))
                          }
                          className="w-4 h-4 text-[#1A4862]"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {formDataErrors.education && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.education}
                    </p>
                  )}
                </div>

                {formData.education !== 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Təhsil ixtisası <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Təhsil ixtisasını daxil edin"
                      name="education_speciality"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                        formDataErrors.education_speciality
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      value={formData.education_speciality}
                      onChange={handleChange}
                    />
                    {formDataErrors.education_speciality && (
                      <p className="text-red-500 text-xs mt-1">
                        {formDataErrors.education_speciality}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dil bilikləri <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {languageOptions.map((lang) => (
                      <label
                        key={lang.id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="languages"
                          value={lang.id}
                          checked={formData.languages.includes(lang.id)}
                          onChange={handleLanguageChange}
                          className="w-4 h-4 text-[#1A4862] rounded"
                        />
                        <span>{lang.label}</span>
                      </label>
                    ))}
                  </div>
                  {formDataErrors.languages && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.languages}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profil şəkli
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg py-6 text-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-2xl mb-1">📷</div>
                    <span className="text-sm">
                      Şəkil yükləmək üçün klikləyin
                    </span>
                    <span className="text-xs">(maksimum 5MB)</span>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleProfileImageChange}
                      accept="image/*"
                    />
                  </div>
                  {formDataErrors.profile_image && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.profile_image}
                    </p>
                  )}
                  {formData.profile_image && (
                    <div className="mt-3 flex justify-center relative">
                      <img
                        src={
                          URL.createObjectURL(formData.profile_image) ||
                          "/placeholder.svg"
                        }
                        alt="Profil şəkli"
                        className="w-20 h-20 object-cover rounded-full border-2 border-white shadow-md"
                      />
                      <button
                        onClick={() => {
                          setEditingImage(formData.profile_image);
                          setShowImageEditor(true);
                        }}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600"
                      >
                        <Edit />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sosial şəbəkə linkləri
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Peşənizlə əlaqədar sosial şəbəkə səhifəsinin linkini əlavə
                    edə bilərsiniz.
                  </p>
                  <div className="space-y-2">
                    {[
                      { key: "facebook", placeholder: "Facebook profil linki" },
                      {
                        key: "instagram",
                        placeholder: "Instagram profil linki",
                      },
                      { key: "tiktok", placeholder: "TikTok profil linki" },
                      { key: "linkedin", placeholder: "LinkedIn profil linki" },
                    ].map((network) => (
                      <input
                        key={network.key}
                        type="url"
                        name={network.key}
                        placeholder={network.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] text-sm"
                        value={formData[network.key]}
                        onChange={handleChange}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gördüyünüz işlər (Nümunə işlərinizin şəkilləri)
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg py-6 text-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef2.current?.click()}
                  >
                    <div className="text-2xl mb-1">📁</div>
                    <span className="text-sm block">
                      JPG/PNG faylları yükləyin
                    </span>
                    <span className="text-xs">(maksimum 10 fayl)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/png, image/jpeg"
                      className="hidden"
                      ref={fileInputRef2}
                      onChange={handlePortfolioChange}
                    />
                  </div>
                  {formDataErrors.work_images && (
                    <p className="text-red-500 text-xs mt-1">
                      {formDataErrors.work_images}
                    </p>
                  )}
                  {formData.work_images?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {formData.work_images.map((file, index) => (
                        <div
                          key={index}
                          className="relative group"
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <img
                            src={
                              URL.createObjectURL(file) || "/placeholder.svg"
                            }
                            alt={`İş şəkli ${index + 1}`}
                            className="w-full h-16 object-cover rounded border shadow-sm cursor-move"
                          />

                          <div className="absolute top-1 left-1 text-white bg-black bg-opacity-50 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical size={12} />
                          </div>

                          <button
                            onClick={() => removeWorkImage(index)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Trash2 size={8} />
                          </button>

                          <div className="absolute bottom-1 left-1 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Haqqınızda
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Əlavə qeydlərinizi daxil edin"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] text-sm resize-none"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border border-[#1A4862] text-[#1A4862] py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft /> Geri
                </button>
                <button
                  type="button"
                  disabled={loading}
                  className="flex-1 bg-[#1A4862] text-white py-3 rounded-lg font-medium hover:bg-[#1A4862]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  onClick={handleFinalSubmit}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Göndərilir...
                    </>
                  ) : (
                    <>
                      Qeydiyyatı tamamla
                      <ArrowRight />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-4">
                Hesabınız var?{" "}
                <button
                  onClick={handleClick}
                  className="text-[#3B82F6] hover:underline"
                >
                  Daxil olun
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeAllModals}
        type="success"
        title={modalConfig.title}
        message={modalConfig.message}
        buttonText={modalConfig.buttonText}
        redirectPath={modalConfig.redirectPath}
      />

      <SuccessModal
        isOpen={showErrorModal}
        onClose={closeAllModals}
        type="error"
        title={modalConfig.title}
        message={modalConfig.message}
        buttonText={modalConfig.buttonText}
        redirectPath={modalConfig.redirectPath}
      />

      <SuccessModal
        isOpen={showInfoModal}
        onClose={closeAllModals}
        type="info"
        title={modalConfig.title}
        message={modalConfig.message}
        buttonText={modalConfig.buttonText}
        redirectPath={modalConfig.redirectPath}
      />

      <ImageEditor
        image={editingImage}
        onSave={handleImageEditSave}
        onCancel={handleImageEditCancel}
      />

      <Footer />
    </div>
  );
}

export default Register;
