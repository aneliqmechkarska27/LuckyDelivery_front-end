import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('customer');

  const handleSubmit = (e) => {
    e.preventDefault();
    // В реалния проект тук би имало проверка за автентикация
    if (username && password) {
      onLogin(loginType);
    }
  };

  return (
    <div className="login-container">
      <h2>Вход в системата за доставка на храна</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Потребителско име:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Парола:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Вход като:</label>
          <select value={loginType} onChange={(e) => setLoginType(e.target.value)}>
            <option value="customer">Клиент</option>
            <option value="employee">Служител</option>
            <option value="delivery">Доставчик</option>
          </select>
        </div>
        <button type="submit" className="btn-login">Вход</button>
      </form>
    </div>
  );
};

export default Login;