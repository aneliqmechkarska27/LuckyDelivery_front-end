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
  const userId = 1; // TEMPORARY - Replace with actual user ID retrieval

  useEffect(() => {
    // Fetch restaurants from API
    setLoadingRestaurants(true);
    fetch("http://localhost:9090/api/restaurants")
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

    // Fetch order history from API (requires user authentication)
    setLoadingOrders(true);
    fetch(`http://localhost:9090/api/orders/user/${userId}`) // ADDED: Fetch orders for the specific user
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoadingOrders(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setOrdersError("Грешка при зареждане на поръчки.");
        setLoadingOrders(false);
      });
  }, [userId]); // ADDED: Re-fetch orders if userId changes

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
        headers: {
          'Content-Type': 'application/json',
          // Include authentication headers
        },
        body: JSON.stringify({
          user: { id: userId }, // ADDED: Include user ID in the order
          restaurant: { id: cart.length > 0 ? cart[0].restaurantId : null }, // ADDED: Include restaurant ID
          totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2), // ADDED: Calculate total price
          paymentMethod: "CASH", // ADDED: Set a default payment method
          deliveryAddress: "Временно въведен адрес", // ADDED: Temporary delivery address
          // items: orderItems, // REMOVED: We are sending the order details directly now
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