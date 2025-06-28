// Sidebar.jsx
import React, { useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/logout";


const Sidebar = () => {
  const menu = [
    { label: "Profilim", path: "profil", icon: <GoPerson size={20} /> },
    { label: "Tənzimləmələr", path: "edit",  icon: <IoSettingsOutline size={20} /> },
    { label: "Qiymətləndirmələr", path: "review", icon: <FaRegStar size={20} /> },
    { label: "Çıxış", isLogout: true, icon: <MdLogout size={20} /> },   // <-- flag
  ];

  const navigate = useNavigate();
  const changePath = (path) => navigate(path);

  const [activeMenu, setActiveMenu] = useState("Profilim");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {!isSidebarOpen && (
        <i
          onClick={() => setIsSidebarOpen(true)}
          className="fa-solid fa-bars cursor-pointer text-blue-600"
        />
      )}

      <aside
        className={`w-full md:w-64 text-white p-6 space-y-4 sidebar ${
          isSidebarOpen ? "sidebar-full" : ""
        }`}
        style={{
          background: "linear-gradient(180deg, #1A4862 0%, #3187B8 100%)",
        }}
      >
        <div className="flex w-full justify-between items-center">
          <h1 className="text-2xl font-bold mb-6">PAPUTİ.AZ</h1>
          {isSidebarOpen && (
            <i
              onClick={() => setIsSidebarOpen(false)}
              className="fa-solid fa-xmark text-white cursor-pointer"
            />
          )}
        </div>

        <nav className="space-y-2">
          {menu.map((item, idx) =>
            item.isLogout ? (
              /* ----------- Çıxış üçün LogoutButton ----------- */
              <LogoutButton
                key={idx}
                className="flex items-center gap-3 w-full text-left p-3 rounded-xl transition-colors duration-200 cursor-pointer hover:bg-white/20"
                onAfterLogout={() => setIsSidebarOpen(false)}  // sidebarı bağla
              >
                {item.icon}
                <span>{item.label}</span>
              </LogoutButton>
            ) : (
              /* ----------- Digər menyu düymələri ----------- */
              <button
                key={idx}
                onClick={() => {
                  setActiveMenu(item.label);
                  changePath(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full text-left p-3 rounded-xl transition-colors duration-200 cursor-pointer ${
                  activeMenu === item.label
                    ? "bg-white text-cyan-900"
                    : "hovered-sidebar-link"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
