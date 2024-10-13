import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Подключение стилей Bootstrap

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Для управления показом всплывающего сообщения
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Условие для тестового входа
    if (username === "test" && password === "test") {
      localStorage.setItem("username", username);
      navigate("/dashboard");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        localStorage.setItem("username", username); // Сохранение имени пользователя
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
        setShowErrorPopup(true); // Показать всплывающее сообщение
      }
    } catch (error) {
      setError("Could not connect to the API. Please try again later."); // Обновлено сообщение об ошибке
      setShowErrorPopup(true); // Показать всплывающее сообщение
    }
  };

  // Функция для скрытия всплывающего сообщения
  const handleClosePopup = () => {
    setShowErrorPopup(false);
    setError(""); // Сбросить сообщение об ошибке
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        {showErrorPopup && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={handleClosePopup} aria-label="Close"></button>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <img className="mb-4 mx-auto d-block" src="https://getbootstrap.com/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
          <h1 className="h3 mb-3 fw-normal text-center">Please sign in</h1>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="floatingInput">Username</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>

          <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>

          <p className="mt-5 mb-3 text-muted text-center">&copy;SASDevs</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
