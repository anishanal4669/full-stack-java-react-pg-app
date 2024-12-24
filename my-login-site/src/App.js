// App.js
import React from "react";
import "./App.css";

function App() {
  const handleLogin = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    console.log("Username:", username);
    console.log("Password:", password);
    // Add login logic here
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome Back!</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default App;