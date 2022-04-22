import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [credentials, setCredntials] = useState({ name: "" ,email: "", password: "", cpassword : ""});
  let history = useNavigate();
  const onChange = (e) => {
    setCredntials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSumbit = async (e) => {
    e.preventDefault();
    const {name,email,password} = credentials;
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name,email,password}),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //redirect and save the auth
      localStorage.setItem("token", json.authtoken);
      history.push("/");
      props.showAlert("Account created Successfully","success")
    } else {
      props.showAlert("Invalid credentials","danger")
    }
  };
  return (
    <div className="container mt-3">
      <h2 className="my-2">Create a account to use inotebook</h2>
      <form onSubmit={handleSumbit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            aria-describedby="emailHelp"
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            onChange={onChange}
            name="email"
            required
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
            onChange={onChange}
            name="password"
            required
            minLength={5}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="cpassword"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={onChange}
            required
            minLength={5}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
