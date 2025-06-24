import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../profil-navbar";
import MainProfil from "../main-profil";

export default function MainPage() {
  return (
    <div className="">
      <Navbar />
      <MainProfil />
    </div>
  );
}
