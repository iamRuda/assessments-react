import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("general");
  const navigate = useNavigate();

  // Function to handle navigation back to the dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div
          className="col-md-3 bg-light p-4"
          style={{ position: "absolute", top: 0, bottom: 0, left: 0 }}
        >
          <h3>Настройки</h3>
          <ul className="list-group">
            <li
              className={`list-group-item ${activeSection === "general" ? "active" : ""}`}
              onClick={() => setActiveSection("general")}
              style={{ cursor: "pointer" }}
            >
              Общие
            </li>
            <li
              className={`list-group-item ${activeSection === "account" ? "active" : ""}`}
              onClick={() => setActiveSection("account")}
              style={{ cursor: "pointer" }}
            >
              Учётная запись
            </li>
            <li
              className={`list-group-item ${activeSection === "logout" ? "active" : ""}`}
              onClick={() => setActiveSection("logout")}
              style={{ cursor: "pointer" }}
            >
              Выход из учётки
            </li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="col-md-9 offset-md-3 p-4" style={{ marginLeft: "25%" }}>
          <div className="d-flex justify-content-between mb-4">
            <h4>
              {activeSection === "general"
                ? "Общие настройки"
                : activeSection === "account"
                ? "Настройки учётной записи"
                : "Выход из учётки"}
            </h4>
            <button className="btn btn-secondary" onClick={handleBackToDashboard}>
              Вернуться на Dashboard
            </button>
          </div>

          {activeSection === "general" && (
            <div>
              <h5>Общие настройки</h5>
              <p>Настройки для общих параметров вашего профиля.</p>
              <div>
                <label htmlFor="themeToggle" className="form-label">
                  Тёмная тема
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="themeToggle"
                  onChange={(e) => console.log("Dark theme toggled:", e.target.checked)}
                />
              </div>
              <div>
                <label htmlFor="emailNotifications" className="form-label">
                  Уведомления по электронной почте
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="emailNotifications"
                  onChange={(e) => console.log("Email notifications toggled:", e.target.checked)}
                />
              </div>
            </div>
          )}

          {activeSection === "account" && (
            <div>
              <h5>Учётная запись</h5>
              <p>Настройки для изменения данных учётной записи.</p>
              <div>
                <label htmlFor="changePassword" className="form-label">
                  Сменить пароль
                </label>
                <button className="btn btn-warning" id="changePassword">
                  Изменить
                </button>
              </div>
              <div>
                <label htmlFor="deleteAccount" className="form-label">
                  Удалить учётную запись
                </label>
                <button className="btn btn-danger" id="deleteAccount">
                  Удалить
                </button>
              </div>
              <div>
                <label htmlFor="language" className="form-label">
                  Язык интерфейса
                </label>
                <select className="form-select" id="language">
                  <option>Русский</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          )}

          {activeSection === "logout" && (
            <div>
              <h5>Выход из учётной записи</h5>
              <p>Настройки для выхода из учётной записи.</p>
              <button className="btn btn-danger" onClick={() => console.log("Logging out")}>
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
