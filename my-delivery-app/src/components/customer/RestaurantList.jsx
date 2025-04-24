import React, { useState, useEffect } from "react";
import italianoImg from "../../assets/restaurants/italiano.jpg"; // Hardcoded image for all restaurants

const RestaurantList = ({ onAddToCart }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);   // Holds the menu for the selected restaurant
    const [quantities, setQuantities] = useState({});
    const [loadingRestaurants, setLoadingRestaurants] = useState(true);
    const [restaurantsError, setRestaurantsError] = useState(null);
    const [loadingMenu, setLoadingMenu] = useState(false);
    const [menuError, setMenuError] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' };
    };

    // 🔥 Fetch data from API
    useEffect(() => {
        setLoadingRestaurants(true);
        fetch("http://localhost:9090/api/restaurants", {
            headers: getAuthHeaders(), // Include authorization header
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setRestaurants(data);
                setLoadingRestaurants(false);
            })
            .catch((err) => {
                console.error("Error fetching restaurants:", err);
                setRestaurantsError("Грешка при зареждане на ресторанти.");
                setLoadingRestaurants(false);
            });
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
        if (!selectedRestaurant) {
            alert("Моля, изберете ресторант преди да добавите продукт в кошницата.");
            return;
        }
        const quantity = quantities[product.id] || 1;
        onAddToCart({
            ...product,
            restaurantId: selectedRestaurant.id,
            quantity
        });
    };

    // Fetch the menu for the selected restaurant
    const fetchMenu = (restaurantId) => {
        setLoadingMenu(true);
        setMenuError(null);
        fetch(`http://localhost:9090/api/restaurants/${restaurantId}/menu`, {
            headers: getAuthHeaders(), // Include authorization header
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setMenu(data);
                setLoadingMenu(false);
            })
            .catch((err) => {
                console.error("Error fetching menu:", err);
                setMenuError("Грешка при зареждане на менюто.");
                setLoadingMenu(false);
            });
    };

    return (
        <div className="restaurant-container">
            {loadingRestaurants && <p>Зареждане на ресторанти...</p>}
            {restaurantsError && <p style={{ color: 'red' }}>{restaurantsError}</p>}

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
                                            fetchMenu(restaurant.id);   // Fetch the menu for the selected restaurant
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
                            src={italianoImg}   // Hardcoded image
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

                    {loadingMenu && <p>Зареждане на меню...</p>}
                    {menuError && <p style={{ color: 'red' }}>{menuError}</p>}

                    <div className="products-list">
                        {!loadingMenu && !menuError && menu.length > 0 ? (
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
                                    {/* You can add a hardcoded image for products here if needed */}
                                    {/* <img
                                        src={'hardcoded-product-image.jpg'}
                                        alt={product.name}
                                        className="product-image"
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                            objectFit: "cover",
                                            borderRadius: "8px"
                                        }}
                                    /> */}
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