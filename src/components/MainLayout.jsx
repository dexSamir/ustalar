import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6 w-[100%] h-[100vh] overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
}
