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

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Çıxmaq istədiyinizə əminsiniz?",
      text: "Hesabınızdan çıxış edəcəksiniz.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bəli, çıxış et",
      cancelButtonText: "İmtina et",
      buttonsStyling: false,
      customClass: {
        actions: "flex gap-4 justify-center",
        confirmButton:
          "bg-cyan-900 hover:bg-cyan-900/90 text-white px-5 py-2 rounded-md",
        cancelButton:
          "bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md",
      },
    });

    if (result.isConfirmed) {
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        await fetch("https://api.peshekar.online/api/v1/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        if (typeof onAfterLogout === "function") {
          onAfterLogout();
        }

        await Swal.fire({
          title: "Çıxış edildi!",
          text: "Uğurla hesabınızdan çıxış etdiniz.",
          icon: "success",
          confirmButtonText: "Davam et",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-cyan-900 hover:bg-cyan-900/90 text-white px-5 py-2 rounded-md",
          },
        });

        navigate(redirectPath);
      } catch (error) {
        console.error("Çıxış zamanı xəta:", error);
        Swal.fire("Xəta", "Çıxış zamanı problem yarandı.", "error");
      }
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
};

export default LogoutButton;
