import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  // Статические тестовые данные
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

  useEffect(() => {
    // Получаем имя пользователя из localStorage
    const savedUsername = localStorage.getItem("username");
    setUsername(savedUsername);

    // Устанавливаем данные для тестового пользователя
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
  }, []);

  return (
    <div className="container">
      {/* Header с профилем */}
      <header className="d-flex align-items-center justify-content-between my-4">
        <div className="d-flex align-items-center">
          <img
            src="https://via.placeholder.com/100" // Заменить на актуальный путь к фотографии
            alt="Profile"
            className="rounded-circle me-3"
            width="100"
            height="100"
          />
          <div>
            <h2>{username ? username : "Guest"}</h2> {/* Имя пользователя */}
            <p>Student | Grade 10</p> {/* Описание профиля */}
          </div>
        </div>

        {/* Иконки уведомления и настроек */}
        <div className="d-flex align-items-center">
          <button className="btn btn-link" title="Notifications">
            <FontAwesomeIcon icon={faBell} size="lg" />
          </button>
          <button className="btn btn-link" title="Settings">
            <FontAwesomeIcon icon={faCog} size="lg" />
          </button>
        </div>
      </header>

      {/* Проверка, если данные загружены */}
      {data ? (
        <div className="row">
          {/* Маппим полученные данные и выводим карточки */}
          {data.tests.map((test) => (
            <div key={test.id} className="col-md-4 mb-4">
              <div className="card h-100">
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
