import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Multiplayer from "./components/Multiplayer.tsx";
import VsFriend from "./components/VsFriend.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/multiplayer",
    element: <Multiplayer />,
  },
  {
    path: "/vsFriend",
    element: <VsFriend />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
