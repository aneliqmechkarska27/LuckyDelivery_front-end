import React, { useState, useEffect } from "react"; 
import italianoImg from "../../assets/restaurants/italiano.jpg"; // Hardcoded image for all restaurants

const RestaurantList = ({ onAddToCart }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);  // Holds the menu for the selected restaurant
  const [quantities, setQuantities] = useState({});

  // 🔥 Fetch data from API
  useEffect(() => {
    fetch("http://localhost:9090/api/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error("Error fetching restaurants:", err));
  }, []);

  // Handle quantity changes
  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  // Add to cart with quantity
  const addToCartWithQuantity = (product) => {
    const quantity = quantities[product.id] || 1;
    onAddToCart({
      ...product,
      restaurantId: selectedRestaurant.id,
      quantity
    });
  };

  // Fetch the menu for the selected restaurant
  const fetchMenu = (restaurantId) => {
    fetch(`http://localhost:9090/api/restaurants/${restaurantId}/menu`)
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch((err) => console.error("Error fetching menu:", err));
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
              <div key={restaurant.id} className="restaurant-card" style={{ 
                border: "1px solid #ddd", 
                borderRadius: "12px", 
                overflow: "hidden", 
                background: "white", 
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)", 
                padding: "16px", 
                transition: "transform 0.2s ease", 
                cursor: "pointer", 
                position: "relative"
              }}>
                <div className="restaurant-image" style={{ height: "200px" }}>
                  <img 
                    src={italianoImg} 
                    alt={restaurant.name} 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover", 
                      borderRadius: "8px" 
                    }} 
                  />
                </div>
                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  <p>Кухня: {restaurant.cuisine}</p>
                  <button
                    className="view-menu-btn"
                    onClick={() => {
                      setSelectedRestaurant(restaurant);
                      fetchMenu(restaurant.id);  // Fetch the menu for the selected restaurant
                    }}
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
              src={italianoImg}  // Hardcoded image
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
            {menu.length > 0 ? (
              menu.map((product) => (
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
                    src={product.image}  // Assuming product has an image field
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
              ))
            ) : (
              <p>Менюто не е налично.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
