import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import Dashboard from "./components/Dashboard/Dashboard";
import Forms from "./components/Forms/Forms";
import Settings from "./components/Settings/Settings";
import PrivateRoute from "./routes/PrivateRoute";
import "./App.css";
import "./dark.css";
import UserCreation from "./components/Login/UserCreation";

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Функция для чтения cookie по имени
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      const isDark = savedTheme === "dark";
      setIsDarkTheme(isDark);
      document.body.classList.toggle("dark-theme", isDark);
    } else {
      // Если нет темы в localStorage, проверяем куки
      const userSettingsCookie = getCookie("userSettings");
      if (userSettingsCookie) {
        try {
          const userSettings = JSON.parse(userSettingsCookie);
          const isDark = userSettings.theme === "dark";
          setIsDarkTheme(isDark);
          document.body.classList.toggle("dark-theme", isDark);

          // Сохраняем тему в localStorage, если ее не было
          localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch (error) {
          console.error("Ошибка парсинга userSettings cookie:", error);
        }
      }
    }

    // Очистка темной темы перед переключением
    return () => {
      document.body.classList.remove("dark-theme");
    };
  }, [isDarkTheme]);

  return (
    <div className={isDarkTheme ? "dark-theme" : ""}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
          <Route path="/forms/:id" element={<PrivateRoute element={Forms} />} />
          <Route path="/settings" element={<PrivateRoute element={Settings} />} />
          <Route path="/create-user" element={<PrivateRoute element={UserCreation} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;