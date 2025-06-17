import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Rey from "../pages/Rey";
import Register from "../pages/register";
import Login from "../pages/login";
import Ecom from "../pages/Ecom";
import Home from "../home/All";
import ReviewPage from "../pages/ReviewPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "rey",
    element: <Rey />,
  },
  {
    path: "ecom",
    element: <Ecom />,
  },
  {
    path: "reviews",
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
]);
