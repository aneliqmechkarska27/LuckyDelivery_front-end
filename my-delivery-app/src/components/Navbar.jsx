import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, userType, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">LuckyDelivery</Link>
      </div>
      {isLoggedIn && (
        <div className="nav-links">
          {userType === 'customer' && <Link to="/customer">Моите поръчки</Link>}
          {userType === 'employee' && <Link to="/employee">Управление на ресторанти</Link>}
          {userType === 'delivery' && <Link to="/delivery">Активни доставки</Link>}
          <button onClick={onLogout} className="btn-logout">Изход</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;