import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/register";
import Login from "../pages/login";
import Ecom from "../pages/Ecom";
import Home from "../home/All";
import React from "react";
import ReviewPage from "../pages/ReviewPage";
import ProfilePage from "../profil";
import Rey from "../pages/rey";
import Edit from "../components/Edit";
import Review from "../components/review";
import ChangePassword from "../components/ChangePassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "ecom",
    element: <Ecom />,
  },
  {
    path: "/reviews",
    element: <ReviewPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profil/",
    element: <ProfilePage />,
  },
  {
    path: "/rey",
    element: <Rey />,
  },
  {
    path: "/review/:masterId",
    element: <Review />,
  },
  {
    path: "/edit",
    element: <Edit />,
  },

  {
    path: "/reset",
    element: <ChangePassword />,
  },
]);
