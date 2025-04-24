import React, { useState } from 'react';
<<<<<<< Updated upstream
=======
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure this works
>>>>>>> Stashed changes

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< Updated upstream
  const [loginType, setLoginType] = useState('customer');
=======
  const navigate = useNavigate();
>>>>>>> Stashed changes

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< Updated upstream
    // В реалния проект тук би имало проверка за автентикация
=======

>>>>>>> Stashed changes
    if (username && password) {
      try {
        const response = await fetch('http://localhost:9090/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
          localStorage.setItem('authToken', data.token);

          let decodedToken;
          let extractedUserType = null;
          try {
            decodedToken = jwtDecode(data.token);
            console.log('Decoded Token:', decodedToken);

            // *** ADJUST THIS BASED ON YOUR JWT PAYLOAD ***
            if (decodedToken.authorities && Array.isArray(decodedToken.authorities) && decodedToken.authorities.length > 0) {
              const role = decodedToken.authorities[0]; // Directly get the role string
              if (role === 'ROLE_CUSTOMER') extractedUserType = 'customer';
              else if (role === 'ROLE_EMPLOYEE') extractedUserType = 'employee';
              else if (role === 'ROLE_SUPPLIER') extractedUserType = 'delivery';
            }
            console.log('Extracted User Type:', extractedUserType);

            if (onLogin && extractedUserType) {
              onLogin(extractedUserType);
            } else {
              console.warn('Could not determine user type or onLogin callback not provided.');
              navigate('/');
            }

          } catch (error) {
            console.error('Error decoding JWT:', error);
          }

        } else {
          console.error('Login failed:', data);
        }
      } catch (error) {
        console.error('There was an error during login:', error);
      }
    } else {
      console.warn('Please enter both username and password.');
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
        <button type="submit" className="btn-login">Вход</button>
      </form>
    </div>
  );
};

export default Login;