import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, userType, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">LuckyDelivery</Link>
      </div>
      
      <div className="contact-info">
        <a href="tel:+359888123456" className="contact-item">
          <i className="fas fa-phone"></i> +359 888 123 456
        </a>
        <a href="mailto:info@luckydelivery.com" className="contact-item">
          <i className="fas fa-envelope"></i> info@luckydelivery.com
        </a>
      </div>
      
      {isLoggedIn && (
        <div className="nav-links">
      
          <button onClick={onLogout} className="btn-logout">Изход</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;