import React, { useEffect, useState } from "react";

const UsersTable = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/user/findAll", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }

                const usersData = await response.json();
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
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
                    <th>Группа</th>
                    <th>Роль</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => {
                    // Берём часть UID до первого тире
                    const uid = user.id.split("-")[4];
                    // Если у пользователя есть роли, берём первую букву первой роли
                    const role = user.roles && user.roles.length > 0 ? user.roles[0].role.charAt(0) : "";
                    return (
                        <tr key={user.id}>
                            <td>{uid}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.group ? user.group.name : ""}</td>
                            <td>{role}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
