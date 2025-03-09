import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user profile");

        const userProfileData = await response.json();
        setUserProfile(userProfileData);

        // После загрузки профиля загружаем тесты по userId
        fetchTests(userProfileData.id);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchTests = async (userId) => {
      try {
        const response = await fetch(`http://localhost:8080/api/test/findAllByUser/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch tests");

        const testData = await response.json();
        setTests(testData);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchUserProfile();

    setNotifications([
      { title: "Math Test Deadline", text: "Скоро закончится срок сдачи теста по математике.", link: "/math-test" },
      { title: "New History Test", text: "У вас появился новый тест по истории.", link: "/history-test" },
      { title: "Biology Test Results", text: "Пришли результаты тестирования по биологии.", link: "/biology-results" },
    ]);
  }, []);

  return (
      <div className="container">
        <header className="d-flex align-items-center justify-content-between my-4">
          <div className="d-flex align-items-center">
            <img
                src={userProfile?.imageUrl || "https://placehold.co/100"}
                alt="Profile"
                className="rounded-circle me-3"
                width="100"
                height="100"
            />
            <div>
              <h2>{userProfile?.firstName && userProfile?.lastName ? `${userProfile.firstName} ${userProfile.lastName}` : "Guest"}</h2>
              <p>{userProfile?.email ? `${userProfile.email} / ${userProfile.roles?.[0]?.role || "User"}` : "Student | User"}</p>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <button className="btn btn-link" title="Notifications" onClick={() => setShowNotifications(!showNotifications)}>
              <FontAwesomeIcon icon={faBell} size="lg" />
            </button>
            <button className="btn btn-link" title="Settings" onClick={() => navigate("/settings")}>
              <FontAwesomeIcon icon={faCog} size="lg" />
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
                                  <a href={notification.link} className="btn btn-primary">Подробнее</a>
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

        <h3>Available Tests</h3>
        {tests.length > 0 ? (
            <div className="row">
              {tests.map((test) => (
                  <div key={test.id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">📚 {test.title}</h5>
                        <p className="card-text">Passing Score: {test.passingScore}</p>
                        <button className="btn btn-primary">Start Test</button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        ) : (
            <p>Loading tests...</p>
        )}
      </div>
  );
};

export default Dashboard;
