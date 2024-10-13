import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
      </Routes>
    </Router>
  );
};

export default App;
