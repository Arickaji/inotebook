import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [credentials, setCredntials] = useState({ email: "", password: "" });
  let history = useNavigate();
  const onChange = (e) => {
    setCredntials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSumbit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //redirect and save the auth
      localStorage.setItem("token", json.authtoken);
      history.push("/");
      props.showAlert("Logged in Successfully","success")
    } else {
      props.showAlert("Invalid credentials","danger")
    }
  };
  return (
    <div className="container mt-3">
      <h2 className="my-2">Login to continue to inotebook</h2>
      <form onSubmit={handleSumbit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            name="email"
            value={credentials.email}
            onChange={onChange}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={credentials.password}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
