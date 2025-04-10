import React, { useState } from "react"; 
import italianoImg from "../../assets/restaurants/italiano.jpg";
import sushiImg from "../../assets/restaurants/sushi.jpg";
import margaritaImg from "../../assets/restaurants/margarita.jpg";
import calzoneImg from "../../assets/restaurants/calzone.jpg";
import carbonaraImg from "../../assets/restaurants/carbonara.jpg";
import sushiSetImg from "../../assets/restaurants/shikisushi-set.jpg";
import tempuraImg from "../../assets/restaurants/tempura.jpg";
import unagiImg from "../../assets/restaurants/unagi.jpg";

const RestaurantList = ({ onAddToCart }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [quantities, setQuantities] = useState({});

  const restaurants = [
    {
      id: 1,
      name: 'Пицария "Италиано"',
      cuisine: "Италианска",
      image: italianoImg,
      products: [
        {
          id: 1,
          name: "Маргарита",
          description: "Класическа пица с домати и моцарела",
          price: 11.99,
          image: margaritaImg
        },
        {
          id: 2,
          name: "Калцоне",
          description: "Пълнена пица със сирена и шунка",
          price: 12.5,
          image: calzoneImg
        },
        {
          id: 3,
          name: "Паста Карбонара",
          description: "Кремообразна паста със сметана и бекон",
          price: 11.0,
          image: carbonaraImg
        },
      ],
    },
    {
      id: 2,
      name: "Суши Експрес",
      cuisine: "Японска",
      image: sushiImg,
      products: [
        {
          id: 1,
          name: "Суши сет Класик",
          description: "Микс от нигири и маки",
          price: 15.99,
          image: sushiSetImg
        },
        {
          id: 2,
          name: "Темпура рол",
          description: "Хрупкав рол с авокадо и скариди",
          price: 13.49,
          image: tempuraImg
        },
        {
          id: 3,
          name: "Унаги маки",
          description: "Маки рол с пушена змиорка",
          price: 8.99,
          image: unagiImg
        },
      ],
    },
  ];

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  const addToCartWithQuantity = (product) => {
    const quantity = quantities[product.id] || 1;
    onAddToCart({
      ...product,
      restaurantId: selectedRestaurant.id,
      quantity
    });
  };

  return (
    <div className="restaurant-container">
      {!selectedRestaurant ? (
        <>
          <h2>Налични ресторанти</h2>
          <div className="restaurant-list" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "20px",
        marginTop: "20px"
      }}>
        {restaurants.map((restaurant) => (
          <div 
            key={restaurant.id} 
            className="restaurant-card" 
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              overflow: "hidden",
              background: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "16px",
              transition: "transform 0.2s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div className="restaurant-image" style={{
              width: "100%",
              height: "200px",  // Задаваме еднаква височина на всички изображения
              position: "relative",
            }}>
              <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                style={{ 
                  width: "100%", 
                  height: "100%",  // Същата височина за всички изображения
                  objectFit: "cover",  // Покрива целия контейнер без да изкривява пропорциите
                  borderRadius: "8px" 
                }} 
              />
            </div>
            <div className="restaurant-info">
              <h3>{restaurant.name}</h3>
              <p>Кухня: {restaurant.cuisine}</p>
              <button
                className="view-menu-btn"
                onClick={() => setSelectedRestaurant(restaurant)}
                style={{ 
                  marginTop: "10px", 
                  padding: "8px 12px", 
                  backgroundColor: "#4CAF50", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "6px" 
                }}
              >
                Виж меню
              </button>
            </div>
          </div>
        ))}
      </div>
        </>
      ) : (
        <div className="restaurant-menu">
          <button
            className="back-button"
            onClick={() => setSelectedRestaurant(null)}
            style={{
              marginBottom: "20px",
              padding: "8px 16px",
              backgroundColor: "transparent",
              border: "none",
              color: "#00c3ff",
              fontSize: "1.2rem",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            &larr; Назад към ресторантите
          </button>

          <div className="restaurant-details">
            <img 
              src={selectedRestaurant.image} 
              alt={selectedRestaurant.name} 
              className="restaurant-header-image" 
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
            <h2>{selectedRestaurant.name}</h2>
            <p>Кухня: {selectedRestaurant.cuisine}</p>
          </div>

          <div className="products-list">
            {selectedRestaurant.products.map((product) => (
              <div key={product.id} className="product-card" style={{
                background: "white",
                padding: "25px",
                borderRadius: "20px",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(0, 195, 255, 0.1)",
                transition: "all 0.4s",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "relative",
                overflow: "hidden"
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">{product.price.toFixed(2)} лв.</p>
                <div className="product-actions">
                  <div className="quantity-selector">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1"
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="quantity-input"
                    />
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCartWithQuantity(product)}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#00c3ff",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      marginTop: "auto",
                      fontWeight: "600"
                    }}
                  >
                    Добави в кошницата
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
