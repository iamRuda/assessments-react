import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [assignedTests, setTests] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const initProfileData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        setProfileData(result);
        localStorage.setItem("profile", JSON.stringify(result));
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    initProfileData();

    setNotifications([
      { title: "Math Test Deadline", text: "Скоро закончится срок сдачи теста по математике.", link: "/math-test" },
      { title: "New History Test", text: "У вас появился новый тест по истории.", link: "/history-test" },
      { title: "Biology Test Results", text: "Пришли результаты тестирования по биологии.", link: "/biology-results" },
    ]);
  }, []);

  useEffect(() => {
    if (profileData && profileData.roles && profileData.roles.length > 0) {
        setUserRole(profileData.roles[0].role);
    }
  }, [profileData]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const getAssignedTests = async () => {
      if (!profileData || !profileData.group || !profileData.group.name) return;

      try {
        const response = await fetch(
          `http://localhost:8080/api/testAssignment/findByGroupName/${profileData.group.name}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const tests = await response.json();
        setTests(tests);
      } catch (error) {
        console.error("Error fetching test assignments", error);
      }
    };

    getAssignedTests();
  }, [profileData]);

  const handleTestClick = (testId) => {
    navigate(`/forms/${testId}`);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  // Функция для получения URL аватара
  const getAvatarUrl = () => {
    if (!profileData || !profileData.imageUrl) return "https://placehold.co/100";
    if (Array.isArray(profileData.imageUrl)) {
      return profileData.imageUrl[0]?.url || "https://placehold.co/100";
    }
    return profileData.imageUrl || "https://placehold.co/100";
  };

  return (
    <div className="container">
      <header className="d-flex align-items-center justify-content-between my-4">
        <div className="d-flex align-items-center">
          <img
            src={getAvatarUrl()}
            alt="Avatar"
            className="rounded-circle me-3"
            width="100"
            height="100"
          />
          <div>
            <h2 className="mb-1">
              {profileData ? `${profileData.lastName} ${profileData.firstName}` : "Unknown User"}
            </h2>
            <p className="text-muted mb-0">
              Role: {profileData?.roles?.[0]?.role || "Not assigned"} /
              Email: {profileData?.email || "No email"} /
              ID: {profileData?.id || "No ID"}
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <button
            className="btn btn-link"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FontAwesomeIcon icon={faBell} size="lg"/>
          </button>
          <button
            className="btn btn-link"
            title="Settings"
            onClick={handleSettingsClick}
          >
            <FontAwesomeIcon icon={faCog} size="lg"/>
          </button>
        </div>
      </header>

      {showNotifications && (
        <div className="position-relative">
          <div className="position-absolute end-0 me-3" style={{ zIndex: 1000 }}>
            <div className="card shadow" style={{ maxWidth: "500px" }}>
              <div className="card-body">
                <h5 className="card-title">Уведомления</h5>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div key={index} className="mb-3">
                      <div className="notification-card card">
                        <div className="card-body">
                          <h6 className="card-title">{notification.title}</h6>
                          <p className="card-text">{notification.text}</p>
                          <a href={notification.link} className="btn btn-primary">
                            Подробнее
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="mb-0">Нет новых уведомлений.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {assignedTests ? (
        <div className="row">
          {assignedTests.map((assignedTest) => (
            <div key={assignedTest.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">📚 {assignedTest.test.title}</h5>
                  <p className="card-text flex-grow-1">
                    {assignedTest.test.description || "Описание отсутствует"}
                  </p>
                  <div className="d-flex justify-content-end mt-auto">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleTestClick(assignedTest.test.id)}
                    >
                      {(userRole === 'TEACHER' || userRole === 'ADMIN') ? 'Редактировать тест' : 'Начать тест'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(profileData?.roles?.[0]?.role === 'ADMIN' || profileData?.roles?.[0]?.role === 'TEACHER') && (
            <div className="col-md-4 mb-4 d-flex align-items-stretch">
              <div
                className="card h-100 w-100 d-flex align-items-center justify-content-center"
                style={{ cursor: 'pointer', minHeight: '200px' }}
                onClick={() => navigate('/create-test')}
              >
                <div className="card-body text-center d-flex flex-column justify-content-center">
                  <h5 className="card-title">➕ Создать новое тестирование</h5>
                  <p className="card-text text-muted">Нажмите чтобы создать новый тест</p>
                </div>
              </div>
            </div>
          )}
          {(profileData?.roles?.[0]?.role === 'ADMIN') && (
              <div className="col-md-4 mb-4 d-flex align-items-stretch">
                <div
                    className="card h-100 w-100 d-flex align-items-center justify-content-center"
                    style={{ cursor: 'pointer', minHeight: '200px' }}
                    onClick={() => navigate('/create-user')}
                >
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <h5 className="card-title">➕ Создать нового пользователя</h5>
                    <p className="card-text text-muted">Нажмите, чтобы создать нового ученика или преподавателя.</p>
                  </div>
                </div>
              </div>

          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;