import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import React, { useRef, useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { az } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CitySelectionPopup from "../components/CitySelectionPopup";
import axios from "axios";
import { format, parse, subYears, isValid } from "date-fns";
import Swal from "sweetalert2";
import backgroundpng from "../assets/background.png";

const cities = [
  "Ağcabədi",
  "Ağdam",
  "Ağdaş",
  "Ağdərə",
  "Ağstafa",
  "Ağsu",
  "Astara",
  "Babək",
  "Balakən",
  "Bakı",
  "Gədəbəy",
  "Gəncə",
  "Goranboy",
  "Göygöl",
  "Göyçay",
  "Hacıqabul",
  "Xaçmaz",
  "Xankəndi",
  "Xocalı",
  "Xocavənd",
  "Qobustan",
  "Quba",
  "Qubadlı",
  "Qusar",
  "Saatlı",
  "Sabirabad",
  "Salyan",
  "Samux",
  "Sədərək",
  "Siyəzən",
  "Şabran",
  "Şamaxı",
  "Şəki",
  "Şəmkir",
  "Şərur",
  "Şuşa",
  "Tərtər",
  "Tovuz",
  "Ucar",
  "Yevlax",
  "Zaqatala",
  "Zəngilan",
  "Zərdab",
];

function Register() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formDataErrors, setFormDataErrors] = useState({});
  const [catagories, setCatagories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getCatagories = () => {
    axios
      .get("https://masters-1.onrender.com/api/v1/categories/")
      .then((response) => {
        setCatagories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getServices = () => {
    axios
      .get(
        `https://masters-1.onrender.com/api/v1/category/${selectedCategory.id}/services/`
      )
      .then((response) => {
        setServices(
          // response.data.filter((item) => item.category.display_name == selectedCategory.display_name)
          response.data
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

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
    experience_years: "",
    cities: [],
    education: "",
    educationField: "",
    languages: [],
    profile_image: null,
    socialLinks: {
      facebook: "",
      instagram: "",
      tiktok: "",
      linkedin: "",
    },
    work_images: [],
    about: "",
  });

  const educationOptions = [
    { id: 1, label: "Tam ali" },
    { id: 2, label: "Natamam ali" },
    { id: 3, label: "Orta" },
    { id: 4, label: "Peşə təhsili" },
    { id: 5, label: "Orta ixtisas təhsili" },
    { id: 6, label: "Yoxdur" },
  ];

  const [socialMediaLinks, setSocialMediaLinks] = useState({
    Facebook: "",
    Instagram: "",
    TikTok: "",
    LinkedIn: "",
  });

  const handleSocialMediaLinksValue = (e) => {
    const { name, value } = e.target;

    setSocialMediaLinks((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageChange = (e) => {
    const value = parseInt(e.target.value);
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
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const languageOptions = [
    { id: 1, label: "Azərbaycan" },
    { id: 2, label: "İngilis" },
    { id: 3, label: "Rus" },
    { id: 4, label: "Türk" },
  ];

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_image: file }));
    }
  };

  const handlePortfolioChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      work_images: [...formData.work_images, ...files].slice(0, 10),
    }));
  };

  const collectStepErrors = () => {
    const errors = {};

    if (step === 1) {
      if (isEmpty(formData.first_name))
        errors.first_name = "Zəhmət olmasa, məlumatları daxil edin.";
      if (isEmpty(formData.last_name))
        errors.last_name = "Zəhmət olmasa, məlumatları daxil edin.";
      if (isEmpty(formData.birth_date))
        errors.birth_date = "Zəhmət olmasa, məlumatları daxil edin.";
      if (isEmpty(formData.mobile_number))
        errors.mobile_number = "Zəhmət olmasa, məlumatları daxil edin.";
      if (isEmpty(formData.password))
        errors.password = "Zəhmət olmasa, məlumatları daxil edin.";
      if (isEmpty(formData.password2))
        errors.password2 = "Zəhmət olmasa, məlumatları daxil edin.";
      if (
        !isEmpty(formData.password) &&
        !isEmpty(formData.password2) &&
        formData.password !== formData.password2
      )
        errors.password2 = "Zəhmət olmasa, məlumatları daxil edin.";
      if (isEmpty(formData.gender))
        errors.gender = "Zəhmət olmasa, seçim edin.";
    }

    if (step === 2) {
      if (isEmpty(formData.profession_area.trim() == ""))
        errors.profession_area = "Zəhmət olmasa, peşə sahəsi seçin.";
      if (isEmpty(formData.profession_speciality.trim() == ""))
        errors.profession_speciality = "Zəhmət olmasa, peşə ixtisası seçin.";
      if (isEmpty(formData.experience_years))
        errors.experience_years = "Zəhmət olmasa, iş təcrübəsini daxil edin.";
      if (isEmpty(formData.cities.length === 0))
        errors.cities = "Fəaliyyət ərazisi seçilməlidir.";
    }

    if (step === 3) {
      if (isEmpty(formData.education))
        errors.education = "Zəhmət olmasa, təhsil səviyyəsini seçin.";
      if (isEmpty(formData.educationField))
        errors.educationField = "Zəhmət olmasa, təhsil ixtisasını daxil edin.";
      if (isEmpty(formData.about))
        errors.about = "Haqqınızda məlumat daxil edin";
      if (isEmpty(formData.profile_image))
        errors.profile_image = "Profil şəkli əlavə olunmalıdır";
      if (isEmpty(formData.languages.length === 0))
        errors.languages = "Zəhmət olmasa, dil biliklərinizi seçin.";
    }

    console.log(errors);
    setFormDataErrors(errors);

    return Object.keys(errors).length === 0;
  };
  const validateForm = () => {
    const errors = collectStepErrors(step, formData);
    setFormDataErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    const allErrors = collectStepErrors(step, formData);
    setFormDataErrors((prev) => ({
      ...prev,
      [name]: allErrors[name] ?? "",
    }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (step == 1) {
      if (!validateForm()) return;
      if (!formData.mobile_number || formData.mobile_number.length !== 9) {
        Swal.fire({
          icon: "warning",
          title: "Mobil nömrə düzgün deyil",
          text: "Zəhmət olmasa, 9 rəqəmdən ibarət mobil nömrə daxil edin.",
          confirmButtonText: "Başa düşdüm",
          confirmButtonColor: "#1A4862",
        });
        return;
      }
      const fullNumber = `${formData.mobile_number}`;

      try {
        const res = await fetch(
          "https://api.peshekar.online/api/v1/check-phone/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mobile_number: fullNumber }),
          }
        );

        const data = await res.json();
        console.log("Server cavabı:", data);

        if (res.status === 200 && data?.is_mobile_number) {
          setStep(2);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Bu nömrə istifadə olunur.",
            text: data.mobile_number
              ? data.mobile_number[0]
              : "Zəhmət olmasa, başqa nömrə daxil edin.",
            confirmButtonText: "Başa düşdüm",
            confirmButtonColor: "#1A4862",
          });
        }
      } catch (error) {
        console.error("Xəta:", error);
        Swal.fire({
          icon: "error",
          title: "Serverə qoşulmaq mümkün olmadı",
          text: "İnternet bağlantınızı yoxlayın və yenidən cəhd edin.",
          confirmButtonText: "Başa düşdüm",
          confirmButtonColor: "#d33",
        });
      }
    } else {
      if (validateForm()) {
        setStep((prev) => prev + 1);
      }
    }
  };

const handleFinalSubmit = async () => {
  if (!validateForm()) return;
  const formDataToSend = new FormData();
  formDataToSend.append("first_name", formData.first_name);
  formDataToSend.append("last_name", formData.last_name);
  formDataToSend.append("birth_date", formData.birth_date);
  formDataToSend.append("mobile_number", formData.mobile_number);
  formDataToSend.append("password", formData.password);
  formDataToSend.append("password2", formData.password2);
  formDataToSend.append("gender", formData.gender);
  formDataToSend.append("profession_area", formData.profession_area);
  formDataToSend.append("profession_speciality", formData.profession_speciality);
  formDataToSend.append("experience_years", formData.experience_years);

  const selectedCities = Array.isArray(formData.cities)
    ? formData.cities
    : formData.cities
    ? [formData.cities]
    : [];
  selectedCities.forEach((cityId) => formDataToSend.append("cities", cityId));

  formData.languages.forEach((langId) =>
    formDataToSend.append("languages", langId)
  );

  formDataToSend.append("education", formData.education);
  formDataToSend.append("education_speciality", formData.educationField);
  formDataToSend.append("note", formData.about);

  formDataToSend.append("facebook", socialMediaLinks.Facebook);
  formDataToSend.append("instagram", socialMediaLinks.Instagram);
  formDataToSend.append("tiktok", socialMediaLinks.TikTok);
  formDataToSend.append("linkedin", socialMediaLinks.LinkedIn);

  if (formData.profile_image) {
    formDataToSend.append("profile_image", formData.profile_image);
  }

  formData.work_images.forEach((file) =>
    formDataToSend.append("work_images", file)
  );

  try {
    await axios.post(
      "https://api.peshekar.online/api/v1/register/",
      formDataToSend
    );


    Swal.fire({
      title: "Qeydiyyat uğurludur!",
      text: "Davam etmək üçün 'Login' düyməsinə klikləyin.",
      icon: "success",
      confirmButtonText: "Login",
      allowOutsideClick: false,
      buttonsStyling: false,
      customClass: {
        confirmButton: "bg-cyan-600 px-6 py-2 rounded text-white",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");             
      }
    });
  } catch (error) {
    console.error("Error posting data:", error);

    Swal.fire({
      title: "Xəta baş verdi!",
      text:
        error?.response?.data?.detail ||
        "Zəhmət olmasa, yenidən cəhd edin.",
      icon: "error",
      confirmButtonText: "Bağla",
      buttonsStyling: false,
      customClass: {
        confirmButton: "bg-red-600 px-6 py-2 rounded text-white",
      },
    });
  }
};


  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  const handleUploadClick2 = () => {
    fileInputRef2.current.click();
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errorForHandleChange, setErrorForHandleChange] = useState({});
  const containsRussianLetters = (text) => /[А-Яа-яЁё]/.test(text);
  const isEmpty = (v) => !v || v.toString().trim() === "";
  const nameRegex = /^[a-zA-ZəöüçğışƏÖÜÇĞŞİIА-Яа-яЁё\s-]+$/;

  const handleChange = (e) => {
    const { name, value, type, multiple, options } = e.target;

    console.log(name);

    if (type === "password") {
      check_password_strength(value);
    }

    if (multiple) {
      const values = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => parseInt(opt.value));

      setFormData((prev) => ({
        ...prev,
        [name]: values,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "number"
            ? parseInt(value)
            : type === "tel" && /\d/.test(value)
            ? value
            : type !== "tel"
            ? value
            : "",
      }));
    }
    if (name === "first_name" || name === "last_name") {
      if (!regexps(name).test(value) || containsRussianLetters(value)) {
        setFormDataErrors((prev) => ({
          ...prev,
          [name]:
            "Zəhmət olmasa, yalnız Azərbaycan hərflərindən istifadə edin.",
        }));
      } else {
        setFormDataErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }

    if (name === "profession_area") {
      const selected = catagories.find((item) => item.id == value);
      setSelectedCategory(selected || null);
    }

    if (formDataErrors[name]) {
      setFormDataErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const regexps = (name) => {
    if (name === "first_name" || name === "last_name") {
      return /^[AaBbCcÇçDdEeƏəFfGgĞğHhXxIıİiJjKkQqLlMmNnOoÖöPpRrSsŞşTtUuÜüVvYyZz]{3,20}$/;
    } else if (name === "birth_date") {
      return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    } else if (name === "mobile_number") {
      return /^(50|51|55|70|77|99|10|60)\d{7}$/;
    } else if (name === "password") {
      return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#\-_\+])[A-Za-z\d!@#\-_\+]{8,15}$/;
    } else if (name === "profession_speciality_other") {
      return /^[AaBbCcÇçDdEeƏəFfGgĞğHhXxIıİiJjKkQqLlMmNnOoÖöPpRrSsŞşTtUuÜüVvYyZz ]{3,40}$/;
    } else {
      return null;
    }
  };

  const errorMsg = (name, value) => {
    console.log(name, value);
    if (name === "first_name" || name === "last_name") {
      if (value.trim() == "") {
        return "Zəhmət olmasa, ad və soyad daxil edin.";
      } else {
        return "Yalnız Azərbaycan hərfləri ilə yazılmalıdır.";
      }
    } else if (name === "birth_date") {
      if (value.trim() == "") {
        return "Zəhmət olmasa, doğum tarixini daxil edin.";
      } else {
        return "Doğum tarixini düzgün daxil edin.";
      }
    } else if (name === "mobile_number") {
      return "Mobil nömrə düzgün daxil edilməyib.  50 123 45 67 formatında daxil edin.";
    } else if (name === "password") {
      return "Şifrəniz ən azı 8 simvoldan ibarət olmalı, özündə minimum bir böyük hərf, rəqəm və xüsusi simvol (məsələn: !, @, #, -, _, +) ehtiva etməlidir.";
    } else if (name === "password2") {
      return "Şifrələr uyğun deyil.";
    } else if (name === "profession_speciality_other") {
      return "Yalnız Azərbaycan hərfləri ilə qeyd edilməlidir";
    }
  };

  const handleChangeValidation = (e) => {
    const { name } = e.target;

    if (name === "password2") {
      setErrorForHandleChange((prev) => ({
        ...prev,
        password2:
          formData.password.trim() === formData.password2.trim()
            ? ""
            : "Şifrələr uyğun deyil.",
      }));
    } else if (name === "birth_date") {
      const birthDate = new Date(formData.birth_date);
      const minDate = subYears(new Date(), 15);

      console.log(birthDate)


      if(birthDate == 'Invalid Date'){
        setErrorForHandleChange((prev) => ({
          ...prev,
          birth_date: "Zəhmət olmasa, doğum tarixini daxil edin.",
        }));
      }
      else if (!isValid(birthDate)) {
        setErrorForHandleChange((prev) => ({
          ...prev,
          birth_date: "Doğum tarixini düzgün daxil edin.",
        }));
      } else if (birthDate > minDate) {
        setErrorForHandleChange((prev) => ({
          ...prev,
          birth_date: "Qeydiyyatdan keçmək üçün minimum yaş 15 olmalıdır.",
        }));
      } else {
        setErrorForHandleChange((prev) => ({
          ...prev,
          birth_date: "",
        }));
      }
    } else {
      const regexp = regexps(name);
      const msg = errorMsg(name, formData[name]);

      setErrorForHandleChange((prev) => ({
        ...prev,
        [name]: regexp?.test(formData[name]) ? "" : msg,
      }));
    }
  };

  const handleClick = () => {
    navigate("/login");
  };

  const [passwordStrength, setPasswordStrength] = useState({
    isUpperCase: false,
    isLowerCase: false,
    isSymbol: false,
    isNumber: false,
    isLengthEight: false,
  });

  const parentRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      setWidth(parentRef.current.offsetWidth);
    }
    getCatagories();
  }, []);

  useEffect(() => {
    console.log("selectedCategory changed:", selectedCategory);
    if (selectedCategory) {
      getServices();
    }
  }, [selectedCategory]);

  const [spanStyle, setSpanStyle] = useState("w-[0%]");
  let color = [
    "",
    "bg-red-500",
    "bg-yellow-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-green-500",
  ];
  const check_password_strength = (value) => {
    let uppercaseRegexp = /[A-Z]/;
    let lowercaseRegexp = /[a-z]/;
    let symbolRegexp = /[!@#\$%\^\&*\)\(+=._\-{}[\]:;"'<>,?/\\|~`]/;
    let numberRegexp = /\d/;

    if (uppercaseRegexp.test(value)) {
      setPasswordStrength((prev) => ({
        ...prev,
        isUpperCase: true,
      }));
    } else {
      setPasswordStrength((prev) => ({
        ...prev,
        isUpperCase: false,
      }));
    }

    if (lowercaseRegexp.test(value)) {
      setPasswordStrength((prev) => ({
        ...prev,
        isLowerCase: true,
      }));
    } else {
      setPasswordStrength((prev) => ({
        ...prev,
        isLowerCase: false,
      }));
    }

    if (symbolRegexp.test(value)) {
      setPasswordStrength((prev) => ({
        ...prev,
        isSymbol: true,
      }));
    } else {
      setPasswordStrength((prev) => ({
        ...prev,
        isSymbol: false,
      }));
    }

    if (numberRegexp.test(value)) {
      setPasswordStrength((prev) => ({
        ...prev,
        isNumber: true,
      }));
    } else {
      setPasswordStrength((prev) => ({
        ...prev,
        isNumber: false,
      }));
    }

    if (value.length >= 8) {
      setPasswordStrength((prev) => ({
        ...prev,
        isLengthEight: true,
      }));
    } else {
      setPasswordStrength((prev) => ({
        ...prev,
        isLengthEight: false,
      }));
    }

    setSpanStyle(
      "w-[" +
        Object.values(passwordStrength).filter((x) => x == true).length * 20 +
        "%]"
    );
  };

  const handleChildData = (dataFromChild) => {
    console.log(dataFromChild);
    setFormData((prev) => ({
      ...prev,
      cities: [...dataFromChild.cities, ...dataFromChild.districts],
    }));

    setShowPopup(false);
  };

  return (
    <div>
      <div className="bg-[rgba(26,72,98,1)] h-[100px] sticky top-0 left-0 z-50 flex justify-between px-[20px] py-[20px]">
        <h2 className="text-white font-semibold text-[30px]">Paputi</h2>
        <p className="text-white cursor-pointer" onClick={handleClick}>
          Hesabınız var? Daxil olun
        </p>
      </div>

      <div className="gradient-register flex flex-col justify-center items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A4852] mb-2 p-4 text-center">
          Peşə Sahibləri Platformasına <br /> Xoş Gəlmisiniz!
        </h1>
        <p className="text-[#6C757D] p-3">
          Peşəkar xidmətlərinizi paylaşmaq üçün qeydiyyatdan keçin.
        </p>
      </div>

      <div className="relative w-full min-h-screen ">
        <img src={backgroundpng} className="w-full  h-[full] object-cover" />
        <div className="absolute inset-0 flex justify-center items-start pt-[80px] bg-[rgba(0,0,0,0.25)]">
          {step === 1 && (
            <form className="bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <div className="flex justify-evenly ">
                <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(26,72,98,1)] text-white ">
                  1
                </div>
                <div className="w-[40px] h-[2px] bg-[rgba(195,200,209,1)] flex mt-3" />

                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(195,200,209,1)] ">
                  2
                </div>
                <div className="w-[40px] h-[2px] bg-[rgba(195,200,209,1)] flex mt-3" />
                <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(195,200,209,1)] ">
                  3
                </div>
              </div>
              <p className="text-center text-cyan-900 font-semibold pt-4">
                Addım 1/3{" "}
              </p>

              <h2 className="text-cyan-900 font-semibold leading-[1.5] text-[25px] mt-5">
                Şəxsi məlumatlar
              </h2>

              <div className="py-[15px]">
                <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                  Ad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={20}
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  onBlur={handleChangeValidation} 
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
                  placeholder="Adınızı daxil edin"
                  className={`${
                    formDataErrors.first_name
                      ? "border-red-600"
                      : "border-gray-300"
                  } outline-gray-200 w-full mt-1 p-2 text-[16px]  border bg-white rounded-md`}
                />
                {formDataErrors.first_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.first_name}
                  </p>
                )}
                {errorForHandleChange.first_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorForHandleChange.first_name}
                  </p>
                )}
              </div>
              <div className="py-[10px]">
                <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                  Soyad <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  maxLength={20}
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  onBlur={handleChangeValidation}
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
                    if (!isLetter && !isControlKey) e.preventDefault();
                  }}
                  placeholder="Soyadınızı daxil edin"
                  className={`w-full mt-1 p-2 text-[16px] bg-white rounded-md outline-gray-200
      ${
        formDataErrors.last_name ? "border-red-600" : "border-gray-300"
      } border`}
                />

                {formDataErrors.last_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.last_name}
                  </p>
                )}
                {errorForHandleChange.last_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorForHandleChange.last_name}
                  </p>
                )}
              </div>

              <div className="py-[10px]">
                <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                  Doğum tarixi <span className="text-red-500">*</span>
                </label>

                <DatePicker
                  selected={
                    formData.birth_date
                      ? typeof formData.birth_date === "string"
                        ? new Date(formData.birth_date)
                        : formData.birth_date
                      : null
                  }
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      birth_date: date
                        ? date.toISOString().split("T")[0].replaceAll("-", "/")
                        : "",
                    }))
                  }
                  name="birth_date"
                  onBlur={handleChangeValidation}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="İl / ay / gün"
                  locale={az}
                  maxDate={subYears(new Date(), 15)}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  calendarStartDay={1}
                  onChangeRaw={(e) => {
                    let val = "";
                    if (e.type == "click") {
                      val = e.target.ariaLabel.replace("Choose ", "");
                    } else {
                      val = e.target.value.replace(/\D/g, "").slice(0, 8);
                    }
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
                  }}
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      "Backspace",
                      "ArrowLeft",
                      "ArrowRight",
                      "Delete",
                      "Tab",
                    ];
                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className={`${
                    errorForHandleChange.birth_date
                      ? "border-red-600"
                      : "border-gray-300"
                  } outline-gray-200 w-full mt-1 p-2 text-[16px] border bg-white rounded-md text-gray-700`}
                />

                {formDataErrors.birth_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.birth_date}
                  </p>
                )}

                {errorForHandleChange.birth_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorForHandleChange.birth_date}
                  </p>
                )}
              </div>

              <div className="py-[10px]">
                <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                  Mobil nömrə <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <div className="flex">
                    <span className="bg-gray-100 px-4 py-2 border border-gray-300 border-r-0 rounded-l-md">
                      +994
                    </span>
                    <input
                      type="tel"
                      name="mobile_number"
                      value={formData.mobile_number}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 9);
                        setFormData((prev) => ({
                          ...prev,
                          mobile_number: onlyNumbers,
                        }));
                      }}
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                        ];
                        if (
                          !/[0-9]/.test(e.key) &&
                          !allowedKeys.includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={handleChangeValidation}
                      placeholder="501234567"
                      className={`${
                        errorForHandleChange.mobile_number
                          ? "border-red-600"
                          : "border-gray-300"
                      } outline-gray-200 w-full p-2 text-[16px] border bg-white rounded-r-md`}
                    />
                  </div>

                  {formDataErrors.mobile_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {formDataErrors.mobile_number}
                    </p>
                  )}

                  {errorForHandleChange.mobile_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorForHandleChange.mobile_number}
                    </p>
                  )}
                </div>
              </div>
              <div className="py-[10px]">
                <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                  Şifrə <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    maxLength={15}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleChangeValidation}
                    placeholder="Şifrənizi daxil edin"
                    className={`${
                      errorForHandleChange.password
                        ? "border-red-600"
                        : "border-gray-300"
                    } outline-gray-200 w-full mt-1 p-2 text-[16px] border bg-white rounded-md pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="w-full">
                  <div
                    ref={parentRef}
                    className={`block mt-[5px] h-[6px] rounded-2xl ${
                      "passwordStrength-" +
                      Object.values(passwordStrength).filter((x) => x == true)
                        .length *
                        20
                    } ${
                      color[
                        Object.values(passwordStrength).filter((x) => x == true)
                          .length
                      ]
                    }`}
                  ></div>
                </div>

                <p
                  className={`mt-1 text-sm ${
                    formDataErrors.password || errorForHandleChange.password
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  Şifrəniz ən azı 8 simvoldan ibarət olmalı, özündə minimum bir
                  böyük hərf, rəqəm və xüsusi simvol (məsələn: !, @, #, -, _, +)
                  ehtiva etməlidir.
                </p>
              </div>

              <div className="py-[10px]">
                <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                  Şifrəni təkrar yazın <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    name="password2"
                    maxLength={15}
                    value={formData.password2}
                    onChange={handleChange}
                    onBlur={handleChangeValidation}
                    placeholder="Şifrənizi təkrar daxil edin"
                    className={`${
                      errorForHandleChange.password2
                        ? "border-red-600"
                        : "border-gray-300"
                    } outline-gray-200 w-full mt-1 p-2 text-[16px] border bg-white rounded-md pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600"
                  >
                    {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* {formData.password &&
                  formData.password !== formData.password2 && (
                    <p className="text-red-500 text-sm mt-1">
                      {formDataErrors.password2 || "Şifrələr uyğun deyil"}
                    </p>
                  )} */}
                {errorForHandleChange.password2 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorForHandleChange.password2}
                  </p>
                )}
              </div>

              <div className="py-[10px]">
                <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                  Cins <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6 mt-1">
                  <label className="text-cyan-900 leading-[1.5] flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={formData.gender === "MALE"}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    Kişi
                  </label>
                  <label className="text-cyan-900 leading-[1.5] flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={formData.gender === "FEMALE"}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    Qadın
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className=" flex justify-center items-center text-sm bg-cyan-900 text-white py-2 rounded-md mt-4 w-full"
                onClick={handleNext}
              >
                Növbəti{" "}
                <IoIosArrowForward className="w-[20px] h-[20px] pt-[2px]" />
              </button>
              <p className="text-sm mt-6 text-gray-600 flex items-center justify-center gap-[3px]">
                Hesabınız var?{" "}
                <a
                  href="/login"
                  className="text-[rgba(49,135,184,1)] hover:underline"
                >
                  Daxil olun
                </a>
              </p>
            </form>
          )}

          {step === 2 && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg w-[90%] max-w-md ">
              <div className="flex justify-evenly ">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(195,200,209,1)]">
                  1
                </div>
                <div className="w-[40px] h-[2px] bg-[rgba(26,72,98,1)] flex justify-between items-center mt-3" />
                <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(26,72,98,1)]  text-white ">
                  2
                </div>
                <div className="w-[40px] h-[2px] bg-[rgba(195,200,209,1)] flex mt-3" />
                <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(195,200,209,1)] ">
                  3
                </div>
              </div>
              <p className="text-center text-cyan-900 pt-4 pb-5">Addım 2/3 </p>
              <h3 className="text-xl font-bold text-[#1A4852] mb-4 ">
                Peşə məlumatları
              </h3>
              <div className="mb-4">
                <label className="block text-sm text-cyan-900 font-medium mb-1">
                  Peşə sahəsi <span className="text-red-500">*</span>
                </label>
                <select
                  name="profession_area"
                  onChange={handleChange}
                  className={`${
                    errorForHandleChange.profession_area
                      ? "border-red-600"
                      : "border-gray-300"
                  } outline-gray-200 w-full mt-1 p-2 text-[16px] text-cyan-900 border bg-[rgba(195,200,209,1)] rounded-md`}
                  value={formData.profession_area}
                >
                  <option value="">Peşə sahəsini seçin</option>
                  {catagories.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.display_name}
                    </option>
                  ))}
                </select>
                {formDataErrors.profession_area && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.profession_area}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-cyan-900  font-medium mb-1">
                  Peşə ixtisası <span className="text-red-500">*</span>
                </label>
                <select
                  name="profession_speciality"
                  value={formData.profession_speciality}
                  onChange={handleChange}
                  className={`${
                    errorForHandleChange.profession_speciality
                      ? "border-red-600"
                      : "border-gray-300"
                  } outline-gray-200 w-full mt-1 p-2 text-[16px] text-cyan-900 border bg-[rgba(195,200,209,1)] rounded-md`}
                >
                  <option value="">Peşə ixtisasını seçin</option>
                  {services.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.display_name}
                    </option>
                  ))}
                  <option value="other">Digər</option>
                </select>
                {formDataErrors.profession_speciality && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.profession_speciality}
                  </p>
                )}
              </div>

              {formData.profession_speciality === "other" && (
                <div className="mt-3 mb-4">
                  <label className="block text-sm text-cyan-900 font-medium mb-1">
                    İxtisası daxil edin: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    name="profession_speciality_other"
                    value={formData.profession_speciality_other || ""}
                    onChange={handleChange}
                    onBlur={handleChangeValidation}
                    onKeyDown={(e) => {
                      const isControlKey = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                      ].includes(e.key);

                      const isLetter = /^[a-zA-ZəöüçğışƏÖÜÇĞŞİI ]$/.test(e.key);
                      const isValidInput = isLetter || isControlKey;

                      if (!isValidInput) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Daxil edin..."
                    className={`w-full border p-2 rounded-md text-cyan-900 ${
                      formDataErrors.profession_speciality_other ||
                      errorForHandleChange.profession_speciality_other
                        ? "border-red-600"
                        : "border-gray-200"
                    } bg-[rgba(195,200,209,1)] px-4 py-2 cursor-pointer focus:outline-none focus:ring focus:ring-blue-300`}
                  />

                  {formDataErrors.profession_speciality_other && (
                    <p className="text-red-500 text-sm mt-1">
                      {formDataErrors.profession_speciality_other}
                    </p>
                  )}

                  {errorForHandleChange.profession_speciality_other &&
                    !formDataErrors.profession_speciality_other && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorForHandleChange.profession_speciality_other}
                      </p>
                    )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm text-cyan-900 font-medium mb-1">
                  İş təcrübəsi(il) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onBlur={handleChangeValidation}
                  placeholder="Məsələn: 4"
                  onChange={handleChange}
                  onInput={(e) => {
                    if (e.target.value > 90) {
                      e.target.value = 90;
                    }
                  }}
                  max={90}
                  className={`${
                    errorForHandleChange.experience_years
                      ? "border-red-600"
                      : "border-gray-300"
                  } no-spinner outline-gray-200 w-full text-cyan-900 mt-1 p-2 text-[16px] border bg-gray-200 rounded-md`}
                />
                {formDataErrors.experience_years && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.experience_years}
                  </p>
                )}
              </div>

              <div className="mt-3 mb-4">
                <label className="block text-sm text-cyan-900 font-medium mb-1">
                  Fəaliyyət göstərdiyi ərazi :{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  onClick={openPopup}
                  placeholder="Ərazi seç"
                  className="w-full border p-2 rounded-md text-cyan-900 border-gray-200 bg-[rgba(195,200,209,1)] px-4 py-2  cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
                />

                {formDataErrors.cities && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.cities}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-cyan-900 text-cyan-900 py-2 px-4 rounded-md hover:bg-gray-100 w-[48%] flex justify-center items-center"
                >
                  <IoIosArrowBack className="pt-[2px]" /> Geri
                </button>
                <button
                  type="submit"
                  className=" flex justify-center items-center bg-cyan-900 border-cyan-900 text-white py-2 px-6 rounded-md w-[48%] "
                  onClick={handleNext}
                >
                  Növbəti <IoIosArrowForward className="pt-[2px]" />
                </button>
              </div>
              <p className="text-sm mt-4 text-gray-600 flex items-center justify-center gap-[3px]">
                Hesabınız var?
                <a
                  href="/login"
                  className="text-[rgba(49,135,184,1)] hover:underline"
                >
                  Daxil olun
                </a>
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <div className="flex justify-evenly pb-[10px]">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(195,200,209,1)]">
                  1
                </div>
                <div className="w-[40px] h-[2px] bg-[rgba(26,72,98,1)]  flex mt-3" />
                <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(195,200,209,1)]  ">
                  2
                </div>
                <div className="w-[40px] h-[2px] bg-[rgba(26,72,98,1)]    flex mt-3" />
                <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(26,72,98,1)]  text-white ">
                  3
                </div>
              </div>
              <p className="text-center  text-cyan-900 pb-3 pt-4">Addım 3/3 </p>
              <h2 className="text-xl font-bold text-[#1A4852] mb-1 py-2">
                Əlavə məlumatlar
              </h2>

              <div className="mb-4">
                <label className="block text-sm text-cyan-900 font-medium mb-1 py-2">
                  Təhsil <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                  {educationOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-2 text-sm text-cyan-900"
                    >
                      <input
                        type="radio"
                        name="education"
                        value={option.id}
                        className="accent-cyan-700 w-6 h-4 text-cyan-900 border-gray-300"
                        checked={formData.education === option.id}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            education: parseInt(e.target.value),
                          }))
                        }
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                {formDataErrors.education && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.education}
                  </p>
                )}
              </div>

              {/* Təhsil ixtisası (şərtli) */}
              {formData.education !== "" && formData.education !== 6 && (
                <div className="mb-4">
                  <label className="block text-sm text-cyan-900 font-medium mb-1">
                    Təhsil ixtisası <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Təhsil ixtisasını daxil edin"
                    name="educationField"
                    className="w-full border border-gray-300 bg-white p-2 rounded-md text-sm text-gray-600 outline-gray-400"
                    value={formData.educationField}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Dil bilikləri */}
              <div className="mb-4">
                <label className="block text-sm text-cyan-900 font-medium mb-1 py-2">
                  Dil bilikləri <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 ">
                  {languageOptions.map((lang) => (
                    <label
                      key={lang.id}
                      className="flex items-center gap-1 text-sm text-cyan-900 "
                    >
                      <input
                        type="checkbox"
                        name="languages"
                        value={lang.id}
                        checked={formData.languages.includes(lang.id)}
                        onChange={handleLanguageChange}
                        className="accent-cyan-700 w-4 h-4 border-gray-300 "
                      />
                      {lang.label}
                    </label>
                  ))}
                </div>
                {formDataErrors.languages && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.languages}
                  </p>
                )}
              </div>

              {/* Profil şəkli yükləmə sahəsi */}
              <div className="mb-4">
                <label className="block text-sm text-cyan-900 font-medium mb-1">
                  Profil şəkli
                </label>
                <div
                  className="border-2 border-dashed  bg-white border-gray-300 rounded-md py-6 text-center text-gray-500 hover:bg-gray-50 cursor-pointer transition"
                  onClick={handleUploadClick}
                >
                  <span className="text-sm  flex flex-col items-center justify-center pt-2">
                    <img src="../public/gallery.svg" alt="" /> Şəkil yükləmək
                    üçün klikləyin.
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleProfileImageChange}
                  />
                </div>
              </div>

              {formData.profile_image && (
                <img
                  src={URL.createObjectURL(formData.profile_image)}
                  alt="Profil şəkli"
                  className="mt-2 w-32 h-32 object-cover rounded-full mx-auto"
                />
              )}

              <div className="mb-4">
                <label className="block  text-cyan-900 text-sm font-semibold mb-1">
                  Sosial şəbəkə linkləri
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Peşənizlə əlaqədar sosial şəbəkə səhifəsinin (olduqda) linkini
                  əlavə edə bilərsiniz.
                </p>
                {[
                  {
                    icon: "fa-brands fa-facebook",
                    name: "Facebook",
                    placeholder: "Facebook profil linki",
                    color: "#1877F2",
                  },
                  {
                    icon: "fa-brands fa-instagram",
                    name: "Instagram",
                    placeholder: "Instagram profil linki",
                    color: "#C13584",
                  },
                  {
                    icon: "fa-brands fa-tiktok",
                    name: "TikTok",
                    placeholder: "TikTok profil linki",
                    color: "#000000",
                  },
                  {
                    icon: "fa-brands fa-linkedin",
                    name: "LinkedIn",
                    placeholder: "Linkedin profil linki",
                    color: "#0A66C2",
                  },
                ].map((network) => (
                  <div
                    key={network.name}
                    className="flex items-center border border-gray-300 rounded-md mb-2 overflow-hidden bg-white"
                  >
                    <div
                      className="flex items-center justify-center w-12 h-12"
                      style={{ backgroundColor: `${network.color}20` }}
                    >
                      <i
                        className={`${network.icon} text-xl`}
                        style={{ color: network.color }}
                      ></i>
                    </div>
                    <input
                      type="text"
                      placeholder={network.placeholder}
                      name={network.name}
                      className="w-full p-3 outline-none cursor-pointer text-cyan-700"
                      onChange={handleSocialMediaLinksValue}
                      onClick={(e) => {
                        const url = e.target.value;
                        if (url.startsWith("http")) {
                          window.open(url, "_blank");
                        }
                      }}
                    />
                  </div>
                ))}

                <div className="mb-4">
                  <label className="block  text-cyan-900 text-sm font-medium mb-2">
                    Gördüyünüz işlər (Nümunə işlərinizin şəkilləri)
                  </label>
                  <div
                    className="border-2 border-dashed bg-white border-gray-300 rounded-md py-6 px-4 text-center text-gray-500 cursor-pointer "
                    onClick={handleUploadClick2}
                  >
                    <span className="text-sm  mb-1 text-gray-400 text-center flex flex-col items-center justify-center">
                      <img
                        src="../public/cloud-upload.png"
                        className="flex justify-center w-[30px] align-center"
                        alt=""
                      />{" "}
                      JPG/PNG faylları yükləyin (maksimum 10 fayl)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/png, image/jpeg"
                      className="hidden"
                      ref={fileInputRef2}
                      onChange={handlePortfolioChange}
                    />
                  </div>
                  {formData.work_images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 justify-center">
                      {formData.work_images.map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`İş şəkli ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-cyan-900 text-sm font-medium mb-1">
                    Haqqınızda
                  </label>

                  <div className="relative">
                    <textarea
                      name="about"
                      onChange={handleChange}
                      value={formData.about}
                      placeholder="Əlavə qeydlərinizi daxil edin"
                      maxLength={1500}
                      className="w-full border border-gray-300 outline-gray-400 rounded-md p-2 min-h-[100px] resize-none pr-16 text-sm"
                    />

                    <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                      {formData.about.length}/1500
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="border border-[#1A4852] text-[#1A4852] py-2 px-4 rounded-md hover:bg-gray-100 w-[48%] flex justify-center items-center"
                  >
                    <IoIosArrowBack />
                    Geri
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center bg-[rgba(26,72,98,1)] text-white text-sm px-6 py-2 rounded-md hover:bg-[#153b45] w-[48%]"
                    onClick={handleFinalSubmit}
                  >
                    Qeydiyyatı tamamla
                    <IoIosArrowForward />
                  </button>
                </div>
                <p className="text-sm mt-4 text-gray-600 flex items-center justify-center gap-[3px]">
                  Hesabınız var?{" "}
                  <a
                    href="/login"
                    className="text-[rgba(49,135,184,1)] hover:underline"
                  >
                    Daxil olun
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="w-[65%] h-[90%] rounded-2xl bg-image overflow-hidden shadow-lg">
            <CitySelectionPopup onSendData={handleChildData} cities={cities} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
