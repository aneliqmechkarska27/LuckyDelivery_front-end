import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'customer', // Default value
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:9090/api/auth/register', { // Replace with your actual backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          email: formData.email,
          type: formData.type, // Include the selected type
        }),
      });

      const data = await response.text(); // Or response.json() if your backend sends JSON

      if (response.ok) {
        console.log('Registration successful:', data);
        navigate('/login');
      } else {
        console.error('Registration failed:', data);
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error('There was an error during registration:', error);
      // Optionally, display a generic error message
    }
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
          <input
            type="text"
            name="name"
            placeholder="Въведете пълното си име"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Телефонен номер:</label>
          <input type="tel" name="phone" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Адрес:</label>
          <input type="text" name="address" onChange={handleChange} required />
        </div>
        {/* Added user type selection */}
        <div className="form-group">
          <label>Тип потребител:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="customer">Клиент</option>
            <option value="employee">Служител</option>
            <option value="supplier">Доставчик</option>
          </select>
        </div>
        <button type="submit" className="btn-login">Регистрация</button>
      </form>
    </div>
  );
};

export default Register;