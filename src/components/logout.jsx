// src/components/LogoutButton.jsx
import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({
  redirectPath = "/login",
  className = "",
  children = "Çıxış et",
  onAfterLogout,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Çıxmaq istədiyinizə əminsiniz?",
      text: "Hesabınızdan çıxış edəcəksiniz.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bəli, çıxış et",
      cancelButtonText: "İmtina et",

      /* —— Tailwind ilə tam vizual nəzarət —— */
      buttonsStyling: false,
      customClass: {
        /* Düymələr konteyneri: araya boşluq veririk */
        actions: "flex gap-4 justify-center",

        confirmButton:
          "bg-cyan-900 hover:bg-cyan-900/90 text-white px-5 py-2 rounded-md",
        cancelButton:
          "bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        /* 1) Lokal məlumatları sil */
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        /* 2) İstəyə bağlı əlavə əməliyyat */
        if (typeof onAfterLogout === "function") onAfterLogout();

        /* 3) Uğurlu mesaj göstər */
        Swal.fire({
          title: "Çıxış edildi!",
          text: "Uğurla hesabınızdan çıxış etdiniz.",
          icon: "success",
          confirmButtonText: "Davam et",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-cyan-900 hover:bg-cyan-900/90 text-white px-5 py-2 rounded-md",
          },
        }).then(() => {
          navigate(redirectPath); // və ya window.location.href = redirectPath
        });
      }
    });
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
};

export default LogoutButton;
