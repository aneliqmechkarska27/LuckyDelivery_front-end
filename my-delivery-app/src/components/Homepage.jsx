import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import backgroundImage from "../assets/restaurants/str3.jpg";

const Homepage = () => {
  const navigate = useNavigate();

  const handleWelcomeClick = () => {
    navigate('/login');
  };

  return (
    <>
      {/* Навбар компонент */}
      <Navbar />
      
      {/* Контейнер за фоновото изображение */}
      <div
        style={{
          position: 'absolute',
          top: '60px', // Височината на навбара - променете според вашия навбар
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden'
        }}
      >
        {/* Бутон за добре дошли */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
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
           Гладен си? Влез тук 🍔
          </button>
        </div>
      </div>
    </>
  );
};

export default Homepage;