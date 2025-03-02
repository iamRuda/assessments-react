import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import Dashboard from "./components/Dashboard/Dashboard";
import Forms from "./components/Forms/Forms";
import Settings from "./components/Settings/Settings"; // Import Settings component
import PrivateRoute from "./routes/PrivateRoute";
import "./App.css"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
        <Route path="/forms" element={<PrivateRoute element={Forms} />} />
        <Route path="/settings" element={<PrivateRoute element={Settings} />} /> {/* New route for settings */}
      </Routes>
    </Router>
  );
};

export default App;