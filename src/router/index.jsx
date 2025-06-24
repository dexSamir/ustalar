import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/register";
import Login from "../pages/login";
import Ecom from "../pages/Ecom";
import Home from "../home/All";
import ReviewPage from "../pages/ReviewPage";
import ProfilePage from "../profil";
import Navbar from "../profil-navbar";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      //   {
      //     path: "profil",
      //     element: <ProfilePage />,
      //   },
      {
        path: "user/profil",
        element: <Navbar />,
      },
    ],
  },
  {
    path: "/ecom",
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
]);
