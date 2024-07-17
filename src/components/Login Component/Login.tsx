import React from "react";
import "./Login.scss";
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';


export default function Login() {
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
            <input type="text" id="email" placeholder="email"></input>
            
          </div>
          <div className="email-container">
            <div className="user-icon-container">
                <KeyOutlinedIcon />
            </div>
            <input type="password" id="password" placeholder="password"></input>
          </div>
          <button type="submit" id="button">
            login
          </button>
          
        </div>
      </div>
    </>
  );
}
