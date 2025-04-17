import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faCog, faChartLine, faShare} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import UsersTable from "./UsersTable";
import Select from 'react-select';

const Dashboard = () => {
    const [assignedTests, setTests] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showCreateTestModal, setShowCreateTestModal] = useState(false);
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [currentTestId, setCurrentTestId] = useState(null);

    //отвесают за назначение теста
    const [assignedAssignments, setAssignedAssignments] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);

    // Обработчик удаления назначения теста
    const handleRemoveAssignment = async (assignmentId) => {
        try {
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/testAssignment/delete/${assignmentId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Не удалось удалить назначение");
            }

            // Обновляем список назначений, удаляя назначение по ID
            setAssignedAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
            alert("Назначение удалено");
        } catch (error) {
            console.error("Ошибка при удалении:", error);
            alert(`Ошибка: ${error.message}`);
        }
    };


    // Загрузка назначенных групп при открытии модального окна
    useEffect(() => {
        if (showAssignModal && currentTestId) {
            const token = localStorage.getItem("authToken");

            fetch(`${process.env.REACT_APP_API_BASE_URL}/api/testAssignment/findByTestId/${currentTestId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            })
                .then(res => res.json())
                .then(data => {
                    // Сохраняем данные о назначениях
                    setAssignedAssignments(data); // data теперь хранит все назначения, а не только groupId
                })
                .catch(err => {
                    console.error("Ошибка загрузки назначенных групп:", err);
                });
        }
    }, [showAssignModal, currentTestId]);

    // Добавляем загрузку групп
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const fetchGroups = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/group/findAll`, {
                    method: "GET", headers: {
                        Authorization: `Bearer ${token}`, Accept: "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch groups");
                const groupsData = await response.json();
                // Фильтруем группу Teachers
                setGroups(groupsData.filter(g => g.name !== "Teachers"));
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };

        if (userRole === 'TEACHER') {
            fetchGroups();
        }
    }, [userRole]);

    // Обработчик назначения теста
    const handleAssignTest = async () => {
        if (!selectedGroups || selectedGroups.length === 0 || !currentTestId) return;

        try {
            const token = localStorage.getItem("authToken");

            // 1. Получаем ID всех выбранных групп по их ID (мы уже их знаем из селекта)
            const now = new Date();
            const expires = new Date();
            expires.setDate(now.getDate() + 7);

            // 2. Формируем список объектов TestAssignmentDTO
            const assignments = selectedGroups.map(group => ({
                assigned: now.toISOString(),
                begins: now.toISOString(),
                expires: expires.toISOString(),
                testId: currentTestId,
                groupId: group.value  // value — это ID из селекта
            }));

            // 3. Отправляем на бэкенд список
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/testAssignment/assign/multiple`, {
                method: "POST", headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${token}`,
                }, body: JSON.stringify(assignments),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Ошибка назначения тестов");
            }

            alert("Тест успешно назначен выбранным группам!");
            setShowAssignModal(false);
            setSelectedGroups([]); // очищаем выбор

        } catch (error) {
            console.error("Assignment error:", error);
            alert(`Ошибка: ${error.message}`);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        const initProfileData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/profile`, {
                    method: "GET", headers: {Authorization: `Bearer ${token}`},
                });
                const result = await response.json();
                setProfileData(result);

                if (result && result.roles && result.roles.length > 0) {
                    setUserRole(result.roles[0].role);
                }

                localStorage.setItem("profile", JSON.stringify(result));
            } catch (error) {
                console.error("Error fetching profile data", error);
            }
        };

        initProfileData();

        setNotifications([{
            title: "Math Test Deadline",
            text: "Скоро закончится срок сдачи теста по математике.",
            link: "/math-test"
        }, {title: "New History Test", text: "У вас появился новый тест по истории.", link: "/history-test"}, {
            title: "Biology Test Results", text: "Пришли результаты тестирования по биологии.", link: "/biology-results"
        },]);
    }, []);


    // Логика вывода тестов
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const getAssignedTests = async () => {
            if (!profileData || !profileData.group || !profileData.group.name) return;

            let URL_MAPPING = '';
            switch (userRole) {
                case 'ADMIN': {
                    URL_MAPPING = `/test/findAll`
                    break;
                }
                case 'TEACHER': {
                    URL_MAPPING = `/test/findTestByCreator`
                    break;
                }
                case 'STUDENT': {
                    URL_MAPPING = `/testAssignment/findByGroupName/${profileData.group.name}`
                    break;
                }
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api` + URL_MAPPING, {
                    method: "GET", headers: {Authorization: `Bearer ${token}`},
                });
                const tests = await response.json();
                if (userRole !== 'STUDENT') {
                    setTests(tests.map(test => ({test})))
                } else {
                    setTests(tests);
                }
            } catch (error) {
                console.error("Error fetching test assignments", error);
            }
        };

        getAssignedTests();
    }, [userRole]);

    const handleTestClick = (testId) => {
        navigate(`/forms/${testId}`);
    };

    const handleSettingsClick = () => {
        navigate("/settings");
    };

    const handleCreateTest = async (testTitle) => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/test/create`, {
                method: "POST", headers: {
                    Authorization: `Bearer ${token}`, "Content-Type": "application/json",
                }, body: JSON.stringify({
                    title: testTitle,
                }),
            });

            const newTest = await response.json();
            navigate(`/forms/${newTest.id}`);
        } catch (error) {
            console.error("Ошибка создания теста:", error);
        }
    };

    const getAvatarUrl = () => {
        if (!profileData || !profileData.imageUrl) return "https://placehold.co/100";
        if (Array.isArray(profileData.imageUrl)) {
            return profileData.imageUrl[0]?.url || "https://placehold.co/100";
        }
        return profileData.imageUrl || "https://placehold.co/100";
    };

    return (<div className="container">
            <>
                {/* Мобильная версия (до 768px) */}
                <header className="d-md-none d-flex align-items-center justify-content-between my-3 gap-2">
                    <div className="d-flex align-items-center flex-grow-1">
                        <img
                            src={getAvatarUrl()}
                            alt="Avatar"
                            className="rounded-circle me-3"
                            style={{
                                width: '60px', height: '60px', objectFit: 'cover'
                            }}
                        />
                        <div className="d-flex flex-column">
                            <h2 className="mb-0 fs-5 text-break">
                                {profileData ? `${profileData.lastName} ${profileData.firstName}` : "Unknown User"}
                            </h2>
                            <div className="d-flex flex-wrap align-items-center gap-1">
              <span className="text-muted fs-7">
                {profileData?.roles?.[0]?.role || "Not assigned"}
              </span>
                                <span className="text-muted">/</span>
                                <span className="text-muted fs-7 text-break">
                {profileData?.email || "No email"}
              </span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center ms-auto">
                        <button className="btn btn-link p-1" title="Notifications"
                                onClick={() => setShowNotifications(!showNotifications)}>
                            <FontAwesomeIcon icon={faBell} fixedWidth size="lg"/>
                        </button>
                        <button className="btn btn-link p-1" title="Settings" onClick={handleSettingsClick}>
                            <FontAwesomeIcon icon={faCog} fixedWidth size="lg"/>
                        </button>
                    </div>
                </header>

                {/* Десктопная версия (от 768px) */}
                <header className="d-none d-md-flex align-items-center justify-content-between my-4">
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
                        <button className="btn btn-link" title="Notifications"
                                onClick={() => setShowNotifications(!showNotifications)}>
                            <FontAwesomeIcon icon={faBell} size="lg"/>
                        </button>
                        <button className="btn btn-link" title="Settings" onClick={handleSettingsClick}>
                            <FontAwesomeIcon icon={faCog} size="lg"/>
                        </button>
                    </div>
                </header>
            </>

            {showAssignModal && (<div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Назначить тест группе</h3>
                        <div className="mb-3">
                            <label className="form-label">Выберите группы:</label>
                            <Select
                                isMulti
                                options={groups.map(group => ({
                                    value: group.id, label: group.name, isDisabled: assignedAssignments.includes(group.id)
                                }))}
                                value={selectedGroups}
                                onChange={setSelectedGroups}
                                placeholder="Начните вводить название группы..."
                            />
                        </div>

                        {assignedAssignments.length > 0 && (
                            <div className="mt-3">
                                <h5>Уже назначено:</h5>
                                <ul className="list-group">
                                    {assignedAssignments.map(assignment => (
                                        <li
                                            key={assignment.id} // Используем ID назначения
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <span>{groups.find(group => group.id === assignment.groupId)?.name}</span> {/* Ищем группу по groupId */}
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleRemoveAssignment(assignment.id)} // Передаем ID назначения
                                            >
                                                Удалить
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowAssignModal(false)}
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAssignTest}
                                disabled={!selectedGroups || selectedGroups.length === 0}
                            >
                                Назначить
                            </button>
                        </div>
                    </div>
                </div>)
            }

            {showNotifications && (<div className="position-relative">
                    <div className="position-absolute end-0 me-3" style={{zIndex: 1000}}>
                        <div className="card shadow" style={{maxWidth: "500px"}}>
                            <div className="card-body">
                                <h5 className="card-title">Уведомления</h5>
                                {notifications.length > 0 ? (notifications.map((notification, index) => (
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
                                        </div>))) : (<p className="mb-0">Нет новых уведомлений.</p>)}
                            </div>
                        </div>
                    </div>
                </div>)}


            {assignedTests ? (<div className="row">
                    {assignedTests.length > 0 && assignedTests.map((assignedTest) => {
                        const isCompleted = assignedTest.result?.completed;
                        const totalScore = assignedTest.result?.totalScore || 0;
                        const maxScore = assignedTest.test?.maxScore || 0;
                        const mark = assignedTest.result?.mark || 'Оценка не выставлена';

                        return (<div key={assignedTest.test.id} className="col-md-4 mb-4">
                                <div className="card h-100 position-relative">
                                    {userRole === "STUDENT" ? (<div className="card-body d-flex flex-column">
                                            {/* Заголовок и статус */}
                                            <div className="d-flex justify-content-between align-items-start">
                                                <h5 className="card-title">📚 {assignedTest.test.title}</h5>
                                                {isCompleted && (<span className="badge bg-success">
                        <i className="bi bi-check2"></i> Выполнено
                      </span>)}
                                            </div>

                                            {/* Описание теста */}
                                            <p className="card-text flex-grow-1">
                                                {assignedTest.test.description || "Описание отсутствует"}
                                            </p>

                                            {/* Блок с результатами и кнопкой */}
                                            <div className="d-flex justify-content-between align-items-center mt-auto">
                                                {isCompleted ? (<div className="d-flex align-items-baseline gap-2">
                                                        <span className="text-primary fw-semibold fs-3">{mark}</span>
                                                        <span className="text-muted align-self-center">
                          ({totalScore}/{maxScore} баллов)
                        </span>
                                                    </div>) : (<div></div>)}
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleTestClick(assignedTest.test.id)}
                                                >
                                                    {isCompleted ? 'Результаты' : 'Начать тест'}
                                                </button>
                                            </div>
                                        </div>) : (/* Вёрстка для преподавателя/админа */
                                        <>
                                            {isCompleted && (<div className="position-absolute top-0 end-0 m-2">
                          <span className="badge bg-success">
                            <i className="bi bi-check2"></i> Выполнено
                          </span>
                                                </div>)}

                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title">📚 {assignedTest.test.title}</h5>

                                                {isCompleted && (<div className="mb-2">
                            <span className="text-success fw-bold">
                              {totalScore}/{maxScore} баллов
                            </span>
                                                        <div className="text-muted small">Оценка: {mark}</div>
                                                    </div>)}

                                                <p className="card-text flex-grow-1">
                                                    {assignedTest.test.description || "Описание отсутствует"}
                                                </p>

                                                <div className="mt-auto pt-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="position-absolute start-0 bottom-0 ms-3 mb-3">
                                                            <button
                                                                className="btn btn-success"
                                                                onClick={() => navigate(`/analytics/${assignedTest.test.id}`)}
                                                            >
                                                                <FontAwesomeIcon icon={faChartLine} className="me-2"/>
                                                                Аналитика
                                                            </button>
                                                        </div>

                                                        <div className="ms-auto">
                                                            <div className="d-flex flex-column gap-2">
                                                                <button
                                                                    className="btn btn-secondary"
                                                                    onClick={() => {
                                                                        setCurrentTestId(assignedTest.test.id);
                                                                        setShowAssignModal(true);
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon icon={faShare} className="me-2"/>
                                                                    Назначить тест
                                                                </button>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => handleTestClick(assignedTest.test.id)}
                                                                >
                                                                    Редактировать тест
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>)}
                                </div>
                            </div>);
                    })}

                    {/* Кнопки создания (остаются без изменений) */}
                    {(profileData?.roles?.[0]?.role === 'ADMIN' || profileData?.roles?.[0]?.role === 'TEACHER') && (
                        <div className="col-md-4 mb-4 d-flex align-items-stretch">
                            <div
                                className="card h-100 w-100 d-flex align-items-center justify-content-center"
                                style={{cursor: 'pointer', minHeight: '200px'}}
                                onClick={() => setShowCreateTestModal(true)}
                            >
                                <div className="card-body text-center d-flex flex-column justify-content-center">
                                    <h5 className="card-title">➕ Создать новое тестирование</h5>
                                    <p className="card-text text-muted">Нажмите, чтобы создать новый тест.</p>
                                </div>
                            </div>
                        </div>)}

                    {(profileData?.roles?.[0]?.role === 'ADMIN') && (
                        <div className="col-md-4 mb-4 d-flex align-items-stretch">
                            <div
                                className="card h-100 w-100 d-flex align-items-center justify-content-center"
                                style={{cursor: 'pointer', minHeight: '200px'}}
                                onClick={() => navigate('/create-user')}
                            >
                                <div className="card-body text-center d-flex flex-column justify-content-center">
                                    <h5 className="card-title">➕ Создать нового пользователя</h5>
                                    <p className="card-text text-muted">Нажмите, чтобы создать нового ученика или
                                        преподавателя.</p>
                                </div>
                            </div>
                        </div>)}
                </div>) : (<p>Loading...</p>)}

            {showCreateTestModal && (<div className="modal-overlay" onClick={() => setShowCreateTestModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Создание теста</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            handleCreateTest(formData.get('testTitle'));
                            setShowCreateTestModal(false);
                        }}>
                            <div className="mb-3">
                                <label htmlFor="testTitle" className="form-label">Название теста</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="testTitle"
                                    name="testTitle"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreateTestModal(false)}
                                >
                                    Закрыть
                                </button>
                                <button type="submit" className="btn btn-primary">Создать</button>
                            </div>
                        </form>
                    </div>
                </div>)}

            {profileData?.roles?.[0]?.role === "ADMIN" && <UsersTable/>}

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
        }
        .modal-content {
          background: white;
          padding: 25px;
          border-radius: 10px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .modal-content h2 {
          margin-bottom: 20px;
          font-size: 1.5rem;
        }
      `}</style>
        </div>);
};

export default Dashboard;