import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Multiplayer from "./components/Multiplayer.tsx";
import VsFriend from "./components/VsFriend.tsx";
import Practice from "./components/Practice.tsx";
import LoginForm from "./routes/Login.tsx";
import SignUpForm from "./routes/SignUp.tsx";
import ConfirmEmail from "./routes/ConfirmEmail.tsx";
import ErrorPage from "./components/ErrorPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "practice",
        element: <Practice />,
      },
      {
        path: "multiplayer",
        element: <Multiplayer />,
      },
      {
        path: "multiplayer/vs-friend",
        element: <VsFriend />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignUpForm />,
  },
  {
    path: "signup/confirm-email",
    element: <ConfirmEmail />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
