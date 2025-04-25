import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (username && password) {
            try {
                const response = await fetch('http://localhost:9090/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem('authToken', data.token);
                    console.log('New JWT received:', data.token);

                    let decodedToken;
                    let extractedUserType = null;
                    let userId = null;
                    try {
                        decodedToken = jwtDecode(data.token);
                        console.log('Decoded Token:', decodedToken);
                        userId = decodedToken.sub;
                        if (userId) {
                            localStorage.setItem('userId', userId);
                        } else {
                            console.warn('User ID not found in the token.');
                        }

                        if (decodedToken.authorities && Array.isArray(decodedToken.authorities) && decodedToken.authorities.length > 0) {
                            const role = decodedToken.authorities[0];
                            if (role === 'ROLE_CUSTOMER') extractedUserType = 'customer';
                            else if (role === 'ROLE_EMPLOYEE') extractedUserType = 'employee';
                            else if (role === 'ROLE_SUPPLIER') extractedUserType = 'delivery';
                        }
                        

                        if (onLogin && extractedUserType) {
                            onLogin(extractedUserType);
                            navigate(
                                extractedUserType === 'customer' ? '/customer/dashboard' :
                                extractedUserType === 'employee' ? '/employee' :
                                extractedUserType === 'delivery' ? '/delivery' : '/'
                            );
                        } else {
                            console.warn('Could not determine user type or onLogin callback not provided.');
                            navigate('/');
                        }

                    } catch (error) {
                        console.error('Error decoding JWT:', error);
                        setLoginError('Failed to process login.');
                    }

                } else {
                    console.error('Login failed:', data);
                    setLoginError(data?.message || 'Login failed due to an error.');
                }
            } catch (error) {
                console.error('There was an error during login:', error);
                setLoginError('There was a network error during login.');
            }
        } else {
            console.warn('Please enter both username and password.');
            setLoginError('Please enter both username and password.');
        }
    };

    return (
        <div className="login-container">
            <h2>Вход в системата за доставка на храна</h2>
            {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
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
            <button onClick={() => navigate('/register')} className="btn-login" style={{ marginTop: '10px' }}>
                Регистрация
            </button>
        </div>
    );
};

export default Login;