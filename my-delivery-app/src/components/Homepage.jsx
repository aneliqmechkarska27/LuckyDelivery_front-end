import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import backgroundImage from "../assets/restaurants/str1.jpg";  

const Homepage = () => {
  const navigate = useNavigate();

  const handleWelcomeClick = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div style={{ zIndex: 2, position: 'relative' }}>
        <Navbar />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 'calc(50% + 60px)', // 👈 6 см надолу
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={handleWelcomeClick}
          style={{
            background: 'linear-gradient(90deg, #FF1493 0%, #00BFFF 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '15px 30px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(2px)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Добре дошли в LuckyDelivery
        </button>
      </div>
    </div>
  );
};

export default Homepage;
