import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]); // для сброса фильтрации
    const [groups, setGroups] = useState([]);
    const [showGroupDropdown, setShowGroupDropdown] = useState(false);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const navigate = useNavigate();

    // Фиксированный список ролей
    const roles = ["STUDENT", "TEACHER", "ADMIN"];

    const token = localStorage.getItem("authToken");

    // Загрузка всех пользователей
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/user/findAll", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            if (!response.ok) throw new Error("Failed to fetch users");
            const usersData = await response.json();
            setUsers(usersData);
            setAllUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Загрузка всех групп
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
            setGroups(groupsData);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    // Фильтрация пользователей по группе
    const filterByGroup = async (groupName) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/user/findByGroup?groupName=${encodeURIComponent(groupName)}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );
            if (!response.ok) throw new Error("Failed to fetch users by group");
            const filteredUsers = await response.json();
            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error filtering users by group:", error);
        }
        setShowGroupDropdown(false);
    };

    // Фильтрация пользователей по роли
    const filterByRole = async (role) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/user/findByRole?role=${encodeURIComponent(role)}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );
            if (!response.ok) throw new Error("Failed to fetch users by role");
            const filteredUsers = await response.json();
            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error filtering users by role:", error);
        }
        setShowRoleDropdown(false);
    };

    // Сброс фильтрации – возвращаем всех пользователей
    const resetFilter = () => {
        setUsers(allUsers);
        setShowGroupDropdown(false);
        setShowRoleDropdown(false);
    };

    useEffect(() => {
        fetchUsers();
        fetchGroups();
    }, []);

    return (
        <div className="mt-4">
            <h3>Пользователи:</h3>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>UID</th>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Электронная почта</th>
                    <th
                        style={{ cursor: "pointer", fontWeight: "bold", position: "relative" }}
                        onClick={() => {
                            setShowGroupDropdown(!showGroupDropdown);
                            setShowRoleDropdown(false);
                        }}
                    >
                        Группа
                        {showGroupDropdown && (
                            <ul
                                className="list-group position-absolute"
                                style={{ zIndex: 1000, width: "150px" }}
                            >
                                {groups.map((group) => (
                                    <li
                                        key={group.id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => filterByGroup(group.name)}
                                    >
                                        {group.name}
                                    </li>
                                ))}
                                <li
                                    className="list-group-item list-group-item-action"
                                    onClick={resetFilter}
                                >
                                    Сбросить фильтр
                                </li>
                            </ul>
                        )}
                    </th>
                    <th
                        style={{ cursor: "pointer", fontWeight: "bold", position: "relative" }}
                        onClick={() => {
                            setShowRoleDropdown(!showRoleDropdown);
                            setShowGroupDropdown(false);
                        }}
                    >
                        Роль
                        {showRoleDropdown && (
                            <ul
                                className="list-group position-absolute"
                                style={{ zIndex: 1000, width: "150px" }}
                            >
                                {roles.map((role) => (
                                    <li
                                        key={role}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => filterByRole(role)}
                                    >
                                        {role}
                                    </li>
                                ))}
                                <li
                                    className="list-group-item list-group-item-action"
                                    onClick={resetFilter}
                                >
                                    Сбросить фильтр
                                </li>
                            </ul>
                        )}
                    </th>
                    <th>Взаимодействие</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => {
                    // Берём часть UID до первого тире
                    const uid = user.id.split("-")[4];
                    // Если у пользователя есть роли, берём первую букву первой роли
                    const roleLetter =
                        user.roles && user.roles.length > 0 ? user.roles[0].role.charAt(0) : "";
                    return (
                        <tr key={user.id}>
                            <td>{uid}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            {/*TODO: Обводка для группы и роли, типо они кликабельны*/}
                            <td>{user.group ? user.group.name : ""}</td>
                            <td>{roleLetter}</td>
                            {/*TODO: Выровнять кнопки*/}
                            <td>
                                <div className="d-flex justify-content-center align-items-center">
                                    <button
                                        className="btn btn-sm btn-outline-success mx-2"
                                        onClick={() => navigate("/admin-login")}
                                    >
                                        ➡️
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger mx-2"
                                        onClick={() => navigate("/admin-delete")}
                                    >
                                        ❌
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
