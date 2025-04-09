import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Analytics = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [analyticsData, setAnalyticsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const token = localStorage.getItem("authToken");

    // Загрузка всех групп
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/group/findAll", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch groups");
                const groupsData = await response.json();
                const filteredGroups = groupsData.filter(g => g.name !== "Teachers");
                setGroups([{id: "all", name: "Все"}, ...filteredGroups]);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };
        fetchGroups();
    }, [token]);

    // Фильтр пользователей по ролям
    const filterByRole = (data) => {
        return data.filter(item =>
            !item.user.roles.some(role =>
                ["ADMIN", "TEACHER"].includes(role.role)
            )
        );
    };

    // Загрузка данных аналитики
    const fetchGroupData = async (groupName) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/analytic/findByGroupName/${encodeURIComponent(groupName)}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch analytics");
            const data = await response.json();

            return data
                .filter(item => item.test.id === testId)
                .map(item => ({
                    user: item.user,
                    result: item.result,
                    test: item.test
                }));
        } catch (error) {
            console.error("Analytics error:", error);
            return [];
        }
    };

    // Обработчик выбора группы
    useEffect(() => {
        const loadData = async () => {
            if (!selectedGroup) return;
            setIsLoading(true);

            try {
                let data = [];

                if (selectedGroup === "all") {
                    // Загрузка данных для всех групп
                    const validGroups = groups.filter(g => g.name !== "Все" && g.name !== "Teachers");
                    for (const group of validGroups) {
                        const groupData = await fetchGroupData(group.name);
                        data = [...data, ...groupData];
                    }
                } else {
                    data = await fetchGroupData(selectedGroup);
                }

                // Фильтрация по ролям
                const filteredData = filterByRole(data);
                setAnalyticsData(filteredData);

            } catch (error) {
                alert(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [selectedGroup, testId, token]);

    return (
        <div className="container my-4">
            <button
                className="btn btn-outline-secondary mb-4"
                onClick={() => navigate(-1)}
            >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Назад
            </button>

            <h2 className="mb-4">Аналитика теста</h2>

            <div className="mb-4">
                <select
                    className="form-select"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">Выберите группу</option>
                    {groups.map(group => (
                        <option key={group.id} value={group.name}>
                            {group.name}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            ) : (
                analyticsData.length > 0 ? (
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                        <tr>
                            <th>Имя</th>
                            <th>Фамилия</th>
                            <th>Почта</th>
                            <th>Группа</th>
                            <th>Оценка</th>
                            <th>Баллы</th>
                        </tr>
                        </thead>
                        <tbody>
                        {analyticsData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.user.firstName}</td>
                                <td>{item.user.lastName}</td>
                                <td>{item.user.email}</td>
                                <td>{item.user.group?.name || "-"}</td>
                                <td>{item.result.mark || "Не оценено"}</td>
                                <td>
                                    {item.result.totalScore}/{item.test.maxScore}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    selectedGroup && <div className="alert alert-info">Нет данных для выбранной группы</div>
                )
            )}
        </div>
    );
};

export default Analytics;