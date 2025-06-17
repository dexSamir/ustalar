import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header";
import HeroSection from "./Components/HeroSection";
import Categories from "./Components/Categories";
import Flags from "./Components/Flags";
import Card from "./Components/Card";
import JoinUsCard from "./Components/JoinUsCard";
import Comments from "./Components/Comments";
import StatsBanner from "./Components/StatsBanner";
import Footer from "./Components/Footer";
import "./all.css";

function Home() {
  return (
    <div className="wrapper">
      <Header />
      <HeroSection />
      <Categories />
      <Flags />
      <Card />
      <StatsBanner />
      <Comments />
      <JoinUsCard />
      <Footer />
      <Outlet />
    </div>
  );
}
export default Home;
