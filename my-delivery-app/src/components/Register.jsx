import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Тук може да се добави логика за регистрация чрез API
    console.log('Регистрация:', formData);
  };

  return (
    <div className="login-container">
      <h2>Регистрация на потребител</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Потребителско име:</label>
          <input type="text" name="username" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Парола:</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Име:</label>
          <input type="text" name="firstName" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Фамилия:</label>
          <input type="text" name="lastName" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Телефонен номер:</label>
          <input type="tel" name="phone" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Адрес:</label>
          <input type="text" name="address" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn-login">Регистрация</button>
      </form>
    </div>
  );
};

export default Register;
