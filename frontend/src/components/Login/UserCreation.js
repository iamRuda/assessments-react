import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UserCreation = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [groupId, setGroupId] = useState("");
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState("");
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [teacherGroupId, setTeacherGroupId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        const fetchGroups = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/group/findAll", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch groups");
                }

                const groupData = await response.json();
                setGroups(groupData);

                if (groupData.length > 0 && role === "STUDENT") {
                    const filtered = groupData.filter((group) => group.name !== "Teachers");
                    if (filtered.length > 0) {
                        setGroupId(filtered[0].id);
                    } else {
                        setGroupId("");
                    }
                }
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };

        const fetchTeacherGroup = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/group/findByName/Teachers", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch Teachers group");
                }

                const teacherGroup = await response.json();
                setTeacherGroupId(teacherGroup.id);
            } catch (error) {
                console.error("Error fetching teacher group:", error);
            }
        };

        fetchGroups();
        fetchTeacherGroup();
    }, [role]);

    useEffect(() => {
        if (role === "TEACHER" && teacherGroupId) {
            setGroupId(teacherGroupId);
        }
    }, [role, teacherGroupId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        const newUser = {
            firstName,
            lastName,
            email,
            password,
            imageUrl,
            isActive: true,
            roles: [
                {
                    role: role,
                },
            ],
            group: {
                id: groupId,
            },
        };

        try {
            const response = await fetch("http://localhost:8080/api/user/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                navigate("/dashboard");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error creating user");
                setShowErrorPopup(true);
            }
        } catch (error) {
            setError("Could not connect to the API. Please try again later.");
            setShowErrorPopup(true);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
                {showErrorPopup && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setShowErrorPopup(false)} aria-label="Close"></button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 fw-normal text-center">Создать пользователя</h1>

                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" placeholder="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <label>Имя</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" placeholder="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        <label>Фамилия</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <label>Email</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="password" className="form-control" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <label>Пароль</label>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Роль</label>
                        <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="STUDENT">STUDENT</option>
                            <option value="TEACHER">TEACHER</option>
                        </select>
                    </div>

                    {role === "STUDENT" && (
                        <div className="mb-3">
                            <label className="form-label">Группа</label>
                            <select className="form-select" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                                {groups.filter((group) => group.name !== "Teachers").map((group) => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button className="w-100 btn btn-lg btn-primary" type="submit">Создать пользователя</button>
                </form>
            </div>
        </div>
    );
};

export default UserCreation;