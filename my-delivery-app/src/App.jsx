import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Страници и компоненти
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register'; // нов компонент
import CustomerDashboard from './components/customer/CustomerDashboard';
import RestaurantList from './components/customer/RestaurantList';
import OrderHistory from './components/customer/OrderHistory';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import DeliveryDashboard from './components/delivery/DeliveryDashboard';
import Navbar from './components/Navbar';

function App() {
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (type) => {
    setUserType(type);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserType(null);
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app">
        <Navbar isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
        <div className="content">
          <Routes>
            {/* Начална страница */}
            <Route path="/" element={<Homepage />} />

            {/* Вход */}
            <Route 
              path="/login" 
              element={!isLoggedIn ? <Login onLogin={handleLogin} /> : 
                <Navigate to={
                  userType === 'customer' ? '/customer/dashboard' : 
                  userType === 'employee' ? '/employee' : 
                  userType === 'delivery' ? '/delivery' : '/'
                } />
              } 
            />

            {/* Регистрация */}
            <Route path="/register" element={<Register />} />

            {/* Клиент */}
            <Route 
              path="/customer/dashboard" 
              element={isLoggedIn && userType === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/customer/restaurants" 
              element={isLoggedIn && userType === 'customer' ? <RestaurantList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/customer/orders" 
              element={isLoggedIn && userType === 'customer' ? <OrderHistory /> : <Navigate to="/login" />} 
            />

            {/* Служител */}
            <Route 
              path="/employee" 
              element={isLoggedIn && userType === 'employee' ? <EmployeeDashboard /> : <Navigate to="/login" />} 
            />

            {/* Доставчик */}
            <Route 
              path="/delivery" 
              element={isLoggedIn && userType === 'delivery' ? <DeliveryDashboard /> : <Navigate to="/login" />} 
            />

            {/* Пренасочване при невалиден URL */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
