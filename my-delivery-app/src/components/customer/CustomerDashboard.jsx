import React, { useState, useEffect } from 'react';
import RestaurantList from './RestaurantList';
import Cart from './Cart';
import OrderHistory from './OrderHistory';

const CustomerDashboard = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [cart, setCart] = useState([]);
    const [activeTab, setActiveTab] = useState('restaurants');
    const [orders, setOrders] = useState([]);
    const [loadingRestaurants, setLoadingRestaurants] = useState(true);
    const [restaurantsError, setRestaurantsError] = useState(null);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' };
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoadingOrders(true);
            setOrdersError(null);
            const token = localStorage.getItem('authToken');

            if (!token) {
                console.error("No token found.");
                setLoadingOrders(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:9090/api/orders/user`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    console.error("Error fetching orders:", `HTTP error! status: ${response.status}`, errorData);
                    setOrdersError(`Грешка при зареждане на поръчки: HTTP status ${response.status}`);
                } else {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrdersError("Грешка при зареждане на поръчки.");
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, []); // Removed userId from the dependency array

    useEffect(() => {
        // Fetch restaurants from API
        setLoadingRestaurants(true);
        fetch("http://localhost:9090/api/restaurants", {
            headers: getAuthHeaders(), // Include authorization header (though not strictly needed for public restaurants)
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

    // REMOVE THIS ENTIRE useEffect BLOCK (lines 63-93)
    // useEffect(() => {
    //     // Fetch order history from API (requires user authentication)
    //     if (userId) {
    //         setLoadingOrders(true);
    //         fetch(`http://localhost:9090/api/orders/user/${userId}`, {
    //             headers: getAuthHeaders(), // Include authorization header
    //         })
    //             .then((res) => {
    //                 if (!res.ok) {
    //                     throw new Error(`HTTP error! status: ${res.status}`);
    //                 }
    //                 return res.json();
    //             })
    //             .then((data) => {
    //                 setOrders(data);
    //                 setLoadingOrders(false);
    //             })
    //             .catch((err) => {
    //                 console.error("Error fetching orders:", err);
    //                 setOrdersError("Грешка при зареждане на поръчки.");
    //                 setLoadingOrders(false);
    //             });
    //     }
    // }, [userId]); // Re-fetch orders if userId changes

    const addToCart = (productToAdd) => {
        const existingItem = cart.find(item => item.id === productToAdd.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === productToAdd.id ? { ...item, quantity: (item.quantity || 1) + (productToAdd.quantity || 1) } : item
            ));
        } else {
            setCart([...cart, { ...productToAdd, quantity: productToAdd.quantity || 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const updateCartItemQuantity = (itemId, newQuantity) => {
        setCart(cart.map(item =>
            item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
        ));
    };

    const placeOrder = async () => {
        if (cart.length === 0) {
            alert('Кошницата е празна. Моля, добавете артикули преди да направите поръчка.');
            return;
        }

        try {
            const orderItems = cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                restaurantId: item.restaurantId, // Ensure restaurantId is included
                name: item.name, // Include other necessary details
                price: item.price,
                // Add other relevant product details for the order
            }));

            const response = await fetch("http://localhost:9090/api/orders", {
                method: 'POST',
                headers: getAuthHeaders(), // Include authentication headers
                body: JSON.stringify({
                    // We no longer explicitly send the userId here, the backend will determine it from the authentication context
                    restaurant: { id: cart.length > 0 ? cart[0].restaurantId : null }, // Include restaurant ID
                    totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2), // Calculate total price
                    paymentMethod: "CASH", // Set a default payment method
                    deliveryAddress: "Временно въведен адрес", // Temporary delivery address
                    orderItems: orderItems, // Send order items
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Грешка при създаване на поръчка: ${errorData.message || response.statusText}`);
            }

            const newOrder = await response.json();
            setOrders([...orders, newOrder]);
            setCart([]);
            setActiveTab('orders');
            alert('Поръчката е създадена успешно!');

        } catch (error) {
            console.error("Грешка при създаване на поръчка:", error);
            alert(`Грешка при създаване на поръчка: ${error.message}`);
        }
    };

    return (
        <div className="customer-dashboard">
            <div className="tabs">
                <button
                    className={activeTab === 'restaurants' ? 'active' : ''}
                    onClick={() => setActiveTab('restaurants')}
                >
                    Ресторанти
                </button>
                <button
                    className={activeTab === 'cart' ? 'active' : ''}
                    onClick={() => setActiveTab('cart')}
                >
                    Кошница ({cart.reduce((sum, item) => sum + (item.quantity || 0), 0)})
                </button>
                <button
                    className={activeTab === 'orders' ? 'active' : ''}
                    onClick={() => setActiveTab('orders')}
                >
                    Моите поръчки
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'restaurants' && (
                    <>
                        {loadingRestaurants && <p>Зареждане на ресторанти...</p>}
                        {restaurantsError && <p style={{ color: 'red' }}>{restaurantsError}</p>}
                        {!loadingRestaurants && !restaurantsError && (
                            <RestaurantList
                                restaurants={restaurants}
                                onAddToCart={addToCart}
                            />
                        )}
                    </>
                )}

                {activeTab === 'cart' && (
                    <Cart
                        items={cart}
                        onRemove={removeFromCart}
                        onPlaceOrder={placeOrder}
                        onUpdateQuantity={updateCartItemQuantity}
                    />
                )}

                {activeTab === 'orders' && (
                    <>
                        {loadingOrders && <p>Зареждане на поръчки...</p>}
                        {ordersError && <p style={{ color: 'red' }}>{ordersError}</p>}
                        {!loadingOrders && !ordersError && (
                            <OrderHistory orders={orders} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;