import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
  const [activeSection, setActiveSection] = useState("general");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDarkTheme(savedTheme === "dark");
    document.body.className = `${savedTheme}-theme`;
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkTheme ? "light" : "dark";
    setIsDarkTheme(!isDarkTheme);
    document.body.className = `${newTheme}-theme`;
    localStorage.setItem("theme", newTheme);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    closeMenu();
  };

  const sections = {
    general: {
      title: "Общие настройки",
      content: (
        <>
          <div className="mb-3 d-flex align-items-center justify-content-between">
            <span>Тёмная тема</span>
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                role="switch"
                checked={isDarkTheme}
                onChange={toggleTheme}
                style={{ width: '3em', height: '1.5em' }}
              />
            </div>
          </div>
          <div className="mb-3 d-flex align-items-center justify-content-between">
            <span>Email уведомления</span>
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                role="switch"
                style={{ width: '3em', height: '1.5em' }}
              />
            </div>
          </div>
        </>
      )
    },
    account: {
      title: "Учётная запись",
      content: (
        <>
          <div className="mb-4">
            <button className="btn btn-warning w-100 py-2">
              Сменить пароль
            </button>
          </div>
          <div className="mb-4">
            <button className="btn btn-danger w-100 py-2">
              Удалить аккаунт
            </button>
          </div>
          <select className="form-select py-2">
            <option>Русский</option>
            <option>English</option>
          </select>
        </>
      )
    },
    logout: {
      title: "Выход из системы",
      content: (
        <div className="text-center">
          <p className="mb-4">Вы уверены, что хотите выйти?</p>
          <button 
            className="btn btn-danger px-5 py-2"
            onClick={() => {
              localStorage.removeItem("authToken");
              navigate("/login");
            }}
          >
            Выйти
          </button>
        </div>
      )
    }
  };

  return (
    <div className={`container-fluid ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
      {/* Мобильное меню */}
      <div className="d-md-none fixed-top bg-light p-2 shadow-sm">
        <button 
          className="btn btn-link" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      <div className="row">
        {/* Боковое меню для десктопа */}
        <div className="col-md-3 d-none d-md-block bg-light p-4" 
             style={{ position: "sticky", top: 0, height: "100vh" }}>
          <h3>Настройки</h3>
          <ul className="list-group">
            <li
              className={`list-group-item ${activeSection === "general" ? "active" : ""}`}
              onClick={() => handleSectionChange("general")}
              style={{ cursor: "pointer" }}
            >
              Общие
            </li>
            <li
              className={`list-group-item ${activeSection === "account" ? "active" : ""}`}
              onClick={() => handleSectionChange("account")}
              style={{ cursor: "pointer" }}
            >
              Учётная запись
            </li>
            <li
              className={`list-group-item ${activeSection === "logout" ? "active" : ""}`}
              onClick={() => handleSectionChange("logout")}
              style={{ cursor: "pointer" }}
            >
              Выход
            </li>
          </ul>
        </div>

        {/* Мобильное меню */}
        <div 
          className={`col-md-3 bg-light p-4 mobile-menu ${isMenuOpen ? 'open' : ''}`}
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 1000,
            width: '75%',
            transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease'
          }}
        >
          <h3>Настройки</h3>
          <ul className="list-group">
            <li
              className={`list-group-item ${activeSection === "general" ? "active" : ""}`}
              onClick={() => handleSectionChange("general")}
            >
              Общие
            </li>
            <li
              className={`list-group-item ${activeSection === "account" ? "active" : ""}`}
              onClick={() => handleSectionChange("account")}
            >
              Учётная запись
            </li>
            <li
              className={`list-group-item ${activeSection === "logout" ? "active" : ""}`}
              onClick={() => handleSectionChange("logout")}
            >
              Выход
            </li>
          </ul>
        </div>

        {/* Основной контент */}
        <div className="col-md-9 p-4" style={{ marginLeft: "auto" }}>
          <div className="d-flex justify-content-between mb-4">
            <h5 className="d-md-none">
              {sections[activeSection].title}
            </h5>
            <h3 className="d-none d-md-block">{sections[activeSection].title}</h3>
            <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              <span className="d-none d-md-inline">На главную</span>
              <span className="d-md-none">Назад</span>
            </button>
          </div>

          <div className="card p-4 shadow-sm">
            {sections[activeSection].content}
          </div>
        </div>
      </div>

      {/* Стили для мобильной версии */}
      <style>{`
        @media (max-width: 767px) {
          .mobile-menu {
            overflow-y: auto;
            background: white;
            top: 60px !important; /* Добавляем отступ сверху */
          }
          .col-md-9 {
            margin-left: 0 !important;
            padding-top: 6rem !important; /* Увеличиваем отступ */
          }
          .list-group-item {
            padding: 1rem;
            font-size: 1rem;
          }
          .fixed-top {
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;