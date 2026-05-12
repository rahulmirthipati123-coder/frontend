import {
  useState,
} from "react";

import Login
from "./components/Login";

import Register
from "./components/Register";

import Dashboard
from "./components/Dashboard";

import ProtectedRoute
from "./components/ProtectedRoute";

import {
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./index.css";

const App = () => {

  const [page, setPage] =
    useState(() =>
      localStorage.getItem("token")
        ? "dashboard"
        : "login"
    );

  return (
    <>

      <ToastContainer />

      {page === "login" && (
        <Login
          goToRegister={() =>
            setPage("register")
          }
          goToDashboard={() =>
            setPage("dashboard")
          }
        />
      )}

      {page === "register" && (
        <Register
          goToLogin={() =>
            setPage("login")
          }
          goToDashboard={() =>
            setPage("dashboard")
          }
        />
      )}

      {page === "dashboard" && (
        <ProtectedRoute>

          <Dashboard
            goToLogin={() =>
              setPage("login")
            }
          />

        </ProtectedRoute>
      )}

    </>
  );
};

export default App;