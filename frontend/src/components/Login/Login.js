import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // To include cookies in the request
      });
  
      console.log(response);  // Проверка ответа
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);  // Логирование ответа
  
        // Сохраняем токен в localStorage
        localStorage.setItem("authToken", data.token);  // Сохраняем токен в localStorage
  
        navigate("/dashboard"); // Перенаправляем на dashboard
      } else {
        const { message } = await response.json();
        setError(message || "Invalid credentials");
        setShowErrorPopup(true);
      }
    } catch (error) {
      setError("Could not connect to the API. Please try again later.");
      setShowErrorPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowErrorPopup(false);
    setError(""); // Clear the error message
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
          <h1 className="h3 mb-3 fw-normal text-center">Please sign in</h1>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingEmail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingEmail">Email</label>
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

          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
