import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
        credentials: "include", // To include cookies in the request
      });
      console.log("Response status:", response.status); // Логируем статус
      if (response.ok) {
        navigate("/login"); // Redirect to login after successful registration
      } else {
        const { message } = await response.json();
        console.log("Error message from API:", message); // Логируем сообщение об ошибке
        setError(message || "Registration failed");
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error("API error:", error); // Логируем ошибку при запросе
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

        <form onSubmit={handleRegister}>
          <h1 className="h3 mb-3 fw-normal text-center">Register</h1>

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

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingFirstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="floatingFirstName">First Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingLastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor="floatingLastName">Last Name</label>
          </div>

          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
