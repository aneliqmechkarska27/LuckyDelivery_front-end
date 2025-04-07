import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CustomerDashboard from './components/customer/CustomerDashboard';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import DeliveryDashboard from './components/delivery/DeliveryDashboard';
import Navbar from './components/Navbar';
import './App.css';

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
            <Route 
              path="/" 
              element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to={`/${userType}`} />} 
            />
            <Route 
              path="/customer" 
              element={isLoggedIn && userType === 'customer' ? <CustomerDashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/employee" 
              element={isLoggedIn && userType === 'employee' ? <EmployeeDashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/delivery" 
              element={isLoggedIn && userType === 'delivery' ? <DeliveryDashboard /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
  
}


export default App;