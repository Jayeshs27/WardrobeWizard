import React from 'react';
import './styles.css';

function NotLogged() {
  return (
    <div className="container">
      <div className="center-content">
        <img src="/redirect-to-login.svg" alt="Login" className="center-image" />
        <p className="login-text">Enjoy the full experience by logging in!</p>
        <button className="login-button"><a href="/signin">Login</a></button>
      </div>
    </div>
  );
}

export default NotLogged;
