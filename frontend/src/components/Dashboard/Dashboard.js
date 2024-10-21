import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate для навигации

const Dashboard = () => {
  const tests = [
    { id: 1, title: "Math Test", description: "Algebra and Geometry" },
    { id: 2, title: "Science Test", description: "Physics and Chemistry" },
    { id: 3, title: "History Test", description: "World War II" },
    { id: 4, title: "English Test", description: "Grammar and Vocabulary" },
    { id: 5, title: "Geography Test", description: "Maps and Climates" },
    { id: 6, title: "Biology Test", description: "Cell Biology" },
  ];

  const [data, setData] = useState(null);
  const [username, setUsername] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate(); // Используем хук useNavigate для маршрутизации

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    setUsername(savedUsername);

    if (savedUsername === "test") {
      setData({ tests });
    } else {
      const fetchProtectedData = async () => {
        const token = localStorage.getItem("token");

        try {
          const response = await fetch("http://localhost:8080/api/protected", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error("Error fetching protected data", error);
        }
      };

      fetchProtectedData();
    }

    setNotifications([
      "Скоро закончится срок сдачи теста по математике.",
      "У вас появился новый тест по истории.",
      "Пришли результаты тестирования по биологии.",
    ]);
  }, []);

  // Функция для перенаправления на Forms
  const handleTestClick = () => {
    navigate("/forms"); // Перенаправляем на компонент Forms
  };

  return (
    <div className="container">
      <header className="d-flex align-items-center justify-content-between my-4">
        <div className="d-flex align-items-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="rounded-circle me-3"
            width="100"
            height="100"
          />
          <div>
            <h2>{username ? username : "Guest"}</h2>
            <p>Student | Grade 10</p>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <button className="btn btn-link" title="Notifications" onClick={() => setShowNotifications(!showNotifications)}>
            <FontAwesomeIcon icon={faBell} size="lg" />
          </button>
          <button className="btn btn-link" title="Settings">
            <FontAwesomeIcon icon={faCog} size="lg" />
          </button>
        </div>
      </header>

      {showNotifications && (
        <div className="position-relative">
          <div className="position-absolute end-0 me-3" style={{ zIndex: 1000 }}>
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">Уведомления</h5>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <p key={index} className="mb-1">{notification}</p>
                  ))
                ) : (
                  <p className="mb-0">Нет новых уведомлений.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {data ? (
        <div className="row">
          {data.tests.map((test) => (
            <div key={test.id} className="col-md-4 mb-4">
              <div className="card h-100" onClick={handleTestClick}> {/* Добавляем onClick для перехода */}
                <div className="card-body">
                  <h5 className="card-title">📚 {test.title}</h5>
                  <p className="card-text">{test.description}</p>
                  <a href="#" className="btn btn-primary">
                    Start Test
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
