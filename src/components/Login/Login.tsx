import React, { useState } from "react";
import "./Login.scss";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { toast } from "react-toastify";
import { Password } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value) {
      setEmailError(false);
    }
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value) {
      setPasswordError(false);
    }
    setPassword(event.target.value);
  }

  function handleLogin() {
    if (email && password) {
      console.log(email, password);
      navigate("/home");
    } else if (!email && password) {
      toast.error("E-mail nije dobar");
      setEmailError(true);
    } else if (!password && email) {
      toast.error("Password nije dobar");
      setPasswordError(true);
    } else {
      toast.error("E-mail i password nisu dobri");
      setEmailError(true);
      setPasswordError(true);
    }
  }

  return (
    <>
      <div className="main-container">
        <div className="image-container">
          <img
            className="logo"
            src="src\assets\JPlanner.png"
            alt="JPlanner logo"
          ></img>
        </div>

        <div className="input-container">
          <div className="email-container">
            <div className="user-icon-container">
              <EmailOutlinedIcon />
            </div>
            <input
              value={email}
              onChange={(e) => handleEmailChange(e)}
              type="text"
              className="email"
              id={emailError ? "error" : ""}
              placeholder="email"
            ></input>
          </div>

          <div className="email-container">
            <div className="user-icon-container">
              <KeyOutlinedIcon />
            </div>
            <input
              value={password}
              onChange={(e) => handlePasswordChange(e)}
              type="password"
              className="password"
              id={passwordError ? "error" : ""}
              placeholder="password"
            ></input>
          </div>

          <button onClick={handleLogin} id="button">
            login
          </button>
        </div>
      </div>
    </>
  );
}
