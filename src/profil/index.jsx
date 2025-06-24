import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Calendar,
  MapPin,
  School,
  User,
  Languages,
  Phone,
  GraduationCap,
  Cake,
  UserIcon as GenderMale,
  Hammer,
  Facebook,
  Instagram,
  Linkedin,
  Link,
} from "lucide-react";
import axios from "axios";
import ReviewDisplay from "../components/review";
import Footer from "../components/Footer";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `https://masters-1.onrender.com${path}`;
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    id: 0,
    password: "",
    is_superuser: false,
    first_name: "",
    last_name: "",
    birth_date: "",
    mobile_number: "",
    gender: "",
    experience_years: 0,
    education: "0",
    education_speciality: "",
    profile_image: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    linkedin: "",
    note: "",
    is_active: true,
    is_staff: false,
    created_at: "",
    updated_at: "",
    profession_area: 0,
    profession_speciality: 0,
    cities: [],
    languages: [],
    work_images: [],
  });
  const [socialLinks, setSocialLinks] = useState([]);

  const authToken = localStorage.getItem("authToken");
  console.log("Auth Token:", authToken);

  useEffect(() => {
    const getProfile = () => {
      axios
        .get("https://masters-1.onrender.com/api/v1/profile/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          console.log("API-dən gələn profil məlumatları:", response.data);
          setProfileData(response.data);
          setSocialLinks(
            [
              {
                icon: "fa-brands fa-facebook",
                link: response.data.facebook,
              },
              {
                icon: "fa-brands fa-instagram",
                link: response.data.instagram,
              },
              {
                icon: "fa-brands fa-tiktok",
                link: response.data.tiktok,
              },
              {
                icon: "fa-brands fa-linkedin",
                link: response.data.linkedin,
              },
            ].filter((item) => item.link)
          );
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    };

    if (authToken) {
      getProfile();
    } else {
      console.warn("Auth token tapılmadı. Profil məlumatları yüklənmədi.");
    }
  }, [authToken]);

  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImage = (url) => {
    setSelectedImageUrl(url);
    document.body.style.overflow = "hidden";
    setIsModalOpen(true);
  };

  const handleCloseImage = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const ProfileHeader = ({ profileData }) => (
    <div className="text-center w-max m-auto flex flex-col items-end box-border relative">
      <div className="relative w-[80%] flex flex-end m-auto">
        <img src="/Confirmed.png" alt="" className="absolute right-0 top-0" />
        <img
          src={getImageUrl(profileData?.profile_image) || "/placeholder.svg"}
          alt="Profile"
          onClick={() => handleImage(getImageUrl(profileData.profile_image))}
          className="w-38 h-38 rounded-full mx-auto object-cover"
        />
      </div>
      <div className="text-center w-[100%]">
        <h2 className="text-[35px] font-semibold m-4 text-cyan-900">
          {profileData.first_name} {profileData.last_name}
        </h2>
        <p className="text-sm text-center w-[100%] text-gray-600 m">
          ID: {profileData.id}
        </p>
      </div>

      <div className="flex items-center justify-center rounded-2xl hover:scale-110 p-1 transition-transform duration-300 shadow-md gap-1 mt-4 mx-auto">
        {socialLinks.map((item, index) => {
          let IconComponent;
          let iconColorClass = "";
          if (item.icon.includes("facebook")) {
            IconComponent = Facebook;
            iconColorClass = "text-blue-600";
          } else if (item.icon.includes("instagram")) {
            IconComponent = Instagram;
            iconColorClass = "text-fuchsia-600";
          } else if (item.icon.includes("tiktok")) {
            IconComponent = Link;
            iconColorClass = "text-black drop-shadow-[0_1px_2px_white]";
          } else if (item.icon.includes("linkedin")) {
            IconComponent = Linkedin;
            iconColorClass = "text-blue-500";
          } else {
            IconComponent = Link;
            iconColorClass = "text-gray-500";
          }

          return (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 flex items-center justify-center hover:scale-110`}
            >
              {IconComponent && (
                <IconComponent className={`text-xl ${iconColorClass}`} />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );

  const Gallery = ({ profileData }) => (
    <div className="m-6">
      <h3 className="text-[30px] m-5 font-semibold leading-tight text-cyan-900">
        Gördüyünüz işlər
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 ml-3 gap-6">
        {profileData.work_images.map((imgObj, index) => (
          <div
            key={index}
            className="w-full aspect-square overflow-hidden rounded-2xl"
          >
            <img
              src={getImageUrl(imgObj.image) || "/placeholder.svg"}
              alt={`İş ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const AboutSection = ({ profileData }) => (
    <div className="bg-gray-50 p-4 mt-[50px] rounded-xl shadow-md">
      <h3 className=" flex  text-2xl m-3 font-semibold text-cyan-900">
        <img src="/stickynote.png" alt="" className="text-[25px] mr-2" />
        Haqqınızda
      </h3>
      <p className="bg-white p-3  rounded-xl text-[16px] text-cyan-900 font-sans">
        {profileData.note}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen md:flex-row bg-gray-100">
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
        <main className="flex-1 p-6 space-y-6">
          <ProfileHeader profileData={profileData} />
          <InfoCards profileData={profileData} isUseFor="User Profile" />
          <Gallery profileData={profileData} />
          <AboutSection profileData={profileData} />
        </main>
        {isModalOpen && (
          <div
            onClick={handleCloseImage}
            className="fixed inset-0  flex justify-center  z-50 bg-black/30 backdrop-blur-sm "
          >
            <div
              className={`w-[500px] h-[500px] bg-blue-100 mx-[60px] ml-[300px] my-auto relative p-2 rounded-full shadow-sm transition-colors duration-200 `}
            >
              <div className="mb-2 h-[100%] w-[100%]">
                <img
                  src={selectedImageUrl || "/placeholder.svg"}
                  className="h-[100%] w-[100%] rounded-full"
                  alt=""
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export const InfoCards = ({ profileData, isUseFor }) => {
  const [isMoreLocation, setIsMoreLocation] = useState(false);
  return (
    <div className="grid gap-10 grid-cols-1 p-3 m-6 md:grid-cols-3">
      <div
        className={` p-6 rounded-xl space-y-5 ${
          isUseFor === "User Profile" ? "" : "bg-blue-50 shadow-md"
        }`}
      >
        {isUseFor !== "User Profile" && (
          <h3 className="flex items-center text-lg font-semibold text-cyan-900 mb-4">
            <User className="mr-2 text-4xl" /> Şəxsi Məlumatlar
          </h3>
        )}

        {isUseFor == "User Profile" && (
          <p className="flex gap-2 text-sm">
            <MapPin className="text-cyan-600 text-[25px] mt-1" />
            <span className="flex flex-col">
              <span className="text-gray-500">Fəaliyyət göstərdiyi ərazi:</span>
              {profileData?.cities?.length > 2 && (
                <span className="font-semibold text-cyan-900 text-[16px]">
                  {profileData?.cities?.slice(0, 2).join(", ") + ","}{" "}
                  {!isMoreLocation ? (
                    <span
                      className="text-cyan-400 cursor-pointer"
                      onClick={() => setIsMoreLocation(true)}
                    >
                      daha çox...
                    </span>
                  ) : (
                    profileData?.cities
                      ?.slice(2, profileData.cities.length)
                      .join(", ")
                  )}
                </span>
              )}
              {profileData?.cities?.length <= 2 && (
                <span className="font-semibold text-cyan-900 text-[16px]">
                  {profileData.cities}
                </span>
              )}
            </span>
          </p>
        )}
        <p className="flex gap-2 text-sm">
          <Phone className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">Mobil nömrə:</span>
            <span className="font-semibold text-cyan-900 text-[16px] ">
              {profileData?.mobile_number}
            </span>
          </span>
        </p>
        <p className="flex gap-2 text-sm">
          <Cake className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">Doğum tarixi:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.birth_date}
            </span>
          </span>
        </p>
        {isUseFor !== "User Profile" && (
          <p className="flex gap-2 text-sm">
            <GenderMale className="text-cyan-600 text-[25px] mt-1" />
            <span className="flex flex-col">
              <span className="text-gray-500">Cins:</span>
              <span className="font-semibold text-cyan-900 text-[16px]">
                {profileData?.gender}
              </span>
            </span>
          </p>
        )}
      </div>

      <div
        className={` p-6 rounded-xl space-y-5 ${
          isUseFor === "User Profile" ? "" : "bg-blue-50 shadow-md"
        }`}
      >
        {isUseFor !== "User Profile" && (
          <h3 className="flex items-center text-lg font-semibold text-cyan-900 mb-4">
            <Briefcase className="mr-2 text-4xl" /> Peşə Məlumatları
          </h3>
        )}

        <p className="flex gap-2 text-sm">
          <Briefcase className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">Peşə sahəsi:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.profession_area}
            </span>
          </span>
        </p>
        <p className="flex gap-2 text-sm">
          <Hammer className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">Peşə ixtisası:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.profession_speciality}
            </span>
          </span>
        </p>
        <p className="flex gap-2 text-sm">
          <Calendar className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">İş təcrübəsi:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.experience_years}
            </span>
          </span>
        </p>
        {isUseFor == "User Profile" && (
          <p className="flex gap-2 text-sm">
            <MapPin className="text-cyan-600 text-[25px] mt-1" />
            <span className="flex flex-col">
              <span className="text-gray-500">Fəaliyyət göstərdiyi ərazi:</span>
              {profileData?.cities?.length > 2 && (
                <span className="font-semibold text-cyan-900 text-[16px]">
                  {profileData?.cities?.slice(0, 2).join(", ") + ","}{" "}
                  {!isMoreLocation ? (
                    <span
                      className="text-cyan-400 cursor-pointer"
                      onClick={() => setIsMoreLocation(true)}
                    >
                      daha çox...
                    </span>
                  ) : (
                    profileData?.cities
                      ?.slice(2, profileData.cities.length)
                      .join(", ")
                  )}
                </span>
              )}
              {profileData?.cities?.length <= 2 && (
                <span className="font-semibold text-cyan-900 text-[16px]">
                  {profileData?.cities}
                </span>
              )}
            </span>
          </p>
        )}
      </div>

      <div
        className={` p-6 rounded-xl space-y-5 ${
          isUseFor === "User Profile" ? "" : "bg-blue-50 shadow-md"
        }`}
      >
        {isUseFor !== "User Profile" && (
          <h3 className="flex items-center text-lg font-semibold text-cyan-900 mb-4">
            <School className="mr-2 text-4xl" /> Təhsil və Bacarıqlar
          </h3>
        )}

        <p className="flex gap-2 text-sm">
          <GraduationCap className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">Təhsil:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.education}
            </span>
          </span>
        </p>
        <p className="flex gap-2 text-sm">
          <School className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">Təhsil ixtisası:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.education_speciality}
            </span>
          </span>
        </p>
        <p className="flex gap-2 text-sm">
          <Languages className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500 ">Dil bilikləri:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.languages?.join(", ")}
            </span>
          </span>
        </p>
      </div>
    </div>
  );
};
