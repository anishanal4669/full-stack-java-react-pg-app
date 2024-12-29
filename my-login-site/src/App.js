import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AuthPage = () => {
  const [view, setView] = useState("login"); // Tracks which form to display
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const switchView = (newView) => {
    setView(newView);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/auth/register", {
        username,
        email,
        password,
      });
      alert("User registered successfully!");
      switchView("login");
    } catch (err) {
      alert(`Registration failed: ${err.response?.data || err.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });
      alert(`Login successful! Token: ${data.token}`);
    } catch (err) {
      alert(`Login failed: ${err.response?.data || err.message}`);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/auth/reset-password", {
        email,
      });
      alert("Password reset link sent to your email!");
      switchView("login");
    } catch (err) {
      alert(`Password reset failed: ${err.response?.data || err.message}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">
          {view === "login" && "Login"}
          {view === "register" && "Register"}
          {view === "reset" && "Reset Password"}
        </h3>

        {view === "login" && (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => switchView("register")}
              >
                Register
              </button>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => switchView("reset")}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        )}

        {view === "register" && (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => switchView("login")}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {view === "reset" && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Reset Password
            </button>
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => switchView("login")}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
