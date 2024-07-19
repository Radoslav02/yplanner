import React, { useState } from "react";
import "./Login.scss";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { parseMessage } from "../../services/firestoreMessage";
import logo from '../../assets/JPlanner.png'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const { login } = useAuth();

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

  async function handleLogin() {
    if (!email) {
      toast.error("Unesi email");
      setEmailError(true);
    }

    if (!password) {
      toast.error("Unesi password");
      setPasswordError(true);
    }

    if (email && password) {

      try {
        const response = await login(email, password);
        if (response) {
          toast.success("Dobrodošli");
          navigate("/home");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error.message);
        toast.error(parseMessage(error.message))
        setPassword('')
        setEmail('')
      }
    }
  }

  return (
    <>
      <div className="main-container">
        <div className="image-container">
          <img
            className="logo"
            src={logo}
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
            ></input>
          </div>

          <button onClick={handleLogin} id="button">
            prijavi se
          </button>
        </div>
      </div>
    </>
  );
}
