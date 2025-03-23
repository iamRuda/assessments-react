import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {logout} from "../../auth/auth";
import {wait} from "@testing-library/user-event/dist/utils"; // Import useNavigate for routing

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
  const [assignedTests, setTests] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate(); // Use the useNavigate hook for routing

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
        console.log("Profile data:", result);
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
    const token = localStorage.getItem("authToken");
    const getAssignedTests = async () => {
      if (!profileData || !profileData.group || !profileData.group.name) {
        return;
      }
      try {
        console.log("getAssignedTests using profile:", profileData);
        const response = await fetch(
            `http://localhost:8080/api/testAssignment/findByGroupName/${profileData.group.name}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
        );
        const tests = await response.json();
        setTests(tests);
        console.log("Tests:", tests);
      } catch (error) {
        console.error("Error fetching test assignments", error);
      }
    };

    getAssignedTests();
  }, [profileData]);

  // Function to redirect to Forms
  const handleTestClick = (testId) => {
    navigate(`/forms/${testId}`); // Redirect to Forms component with the test ID
  };

  // Navigate to the settings page
  const handleSettingsClick = () => {
    navigate("/settings"); // Navigate to settings page
  };

  return (
    <div className="container">
      <header className="d-flex align-items-center justify-content-between my-4">
        <div className="d-flex align-items-center">
        <img
        src={profileData && profileData.imageUrl && profileData.imageUrl.length > 0 && profileData.imageUrl[0].url ? profileData.imageUrl[0].url : "https://via.placeholder.com/100"}
        alt="Avatar"
        className="rounded-circle me-3"
        width="100"
        height="100"
      />
        <div>
        <h2 className="mb-1">{profileData ? `${profileData.lastName} ${profileData.firstName}` : "Guest"}</h2>
        <p className="text-muted mb-0">
          Role: {profileData && profileData.roles ? profileData.roles[0].role : "Not assigned"} / 
          Email: {profileData ? profileData.email : "No email"} / 
          ID: {profileData ? profileData.id : "No ID"}
        </p>
        </div>
        </div>

        <div className="d-flex align-items-center">
          <button className="btn btn-link" title="Notifications"
                  onClick={() => setShowNotifications(!showNotifications)}>
            <FontAwesomeIcon icon={faBell} size="lg"/>
          </button>
          <button className="btn btn-link" title="Settings" onClick={handleSettingsClick}>
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

      {assignedTests ? (
        <div className="row">
          {assignedTests.map((assignedTest) => (
            <div key={assignedTest.id} className="col-md-4 mb-4">
              <div className="card h-100" onClick={() => handleTestClick(assignedTest.test.id)}>
                <div className="card-body">
                  <h5 className="card-title">📚 {assignedTest.test.title}</h5>
                  <p className="card-text">тут должно быть описание</p>
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