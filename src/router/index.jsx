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
    path: "/reviews/:masterId",
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
    path: "/profil",
    element: <ProfilePage />,
  },
  {
    path: "/masters/:id",
    element: <Rey />,
  },
  {
    path: "/edit",
    element: <Edit />,
  },
]);
