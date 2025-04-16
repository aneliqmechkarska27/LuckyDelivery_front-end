import React, { useState, useEffect } from 'react';

const DeliveryDashboard = () => {
  const [activeTab, setActiveTab] = useState('active'); // Set default tab to 'active'
  const [orders, setOrders] = useState([]);
  const backendBaseURL = 'http://localhost:9090/api/supplier';
  const loggedInSupplierId = 3; // Hardcoded placeholder for now

  const fetchOrders = async () => {
    if (!loggedInSupplierId) {
      return;
    }

    let endpoint = '';
    if (activeTab === 'pending') {
      endpoint = `${backendBaseURL}/available`;
    } else if (activeTab === 'active') {
      endpoint = `${backendBaseURL}/collected?supplierId=${loggedInSupplierId}`;
    } else if (activeTab === 'completed') {
      endpoint = `${backendBaseURL}/completed?supplierId=${loggedInSupplierId}`;
    }

    if (endpoint) {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
        console.log(`Fetched ${activeTab} orders:`, data); // More specific debugging log
      } catch (error) {
        console.error(`Failed to fetch ${activeTab} orders:`, error);
        setOrders([]);
      }
    } else {
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab, loggedInSupplierId]);

  const claimOrder = async (orderId) => {
    if (!loggedInSupplierId) {
      console.error("Supplier ID not available to claim order.");
      return;
    }
    const endpoint = `${backendBaseURL}/claim/${orderId}?supplierId=${loggedInSupplierId}`;
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to claim order: ${response.status} - ${errorData}`);
      }
      fetchOrders(); // Refresh orders after claiming
    } catch (error) {
      console.error("Could not claim order:", error);
      // Optionally display an error message to the user
    }
  };

  const markAsDelivered = async (orderId) => {
    const endpoint = `${backendBaseURL}/deliver/${orderId}`;
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to mark as delivered: ${response.status} - ${errorData}`);
      }
      fetchOrders(); // Refresh orders after delivery
    } catch (error) {
      console.error("Could not mark as delivered:", error);
      // Optionally display an error message to the user
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="delivery-dashboard">
      <h2>Управление на доставки</h2>

      <div className="tabs">
        <button
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Чакащи доставки
        </button>
        <button
          className={activeTab === 'active' ? 'active' : ''}
          onClick={() => setActiveTab('active')}
        >
          Активни доставки
        </button>
        <button
          className={activeTab === 'completed' ? 'active' : ''}
          onClick={() => setActiveTab('completed')}
        >
          Завършени доставки
        </button>
      </div>

      <div className="orders-container">
        {orders.length === 0 ? ( // Use 'orders' directly as it's already filtered by the backend
          <p>Няма {activeTab === 'pending' ? 'чакащи' : activeTab === 'active' ? 'активни' : 'завършени'} доставки</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className={`order-card ${order.status}`}>
              <div className="order-header">
                <h3>Поръчка #{order.id}</h3>
                {order.createdAt && <span className="time">{formatTime(order.createdAt)}</span>}
              </div>

              <div className="customer-info">
                {order.user?.name && <p><strong>Клиент:</strong> {order.user.name}</p>}
                {order.deliveryAddress && <p><strong>Адрес:</strong> {order.deliveryAddress}</p>}
                {order.restaurant?.name && <p><strong>Ресторант:</strong> {order.restaurant.name}</p>}
              </div>

              {order.items && order.items.length > 0 && (
                <div className="order-items">
                  <h4>Поръчани продукти:</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="order-footer">
                {order.totalPrice !== undefined && <p className="total">Обща сума: {order.totalPrice.toFixed(2)} лв.</p>}

                <div className="action-buttons">
                  {activeTab === 'pending' && (
                    <button
                      className="accept-button"
                      onClick={() => claimOrder(order.id)}
                    >
                      Приеми доставката
                    </button>
                  )}

                  {activeTab === 'active' && (
                    <button
                      className="complete-button"
                      onClick={() => markAsDelivered(order.id)}
                    >
                      Завърши доставката
                    </button>
                  )}

                  {order.status === 'DELIVERED' && (
                    <span className="status-badge">Завършена</span>
                  )}
                  {order.status === 'IN_TRANSIT' && activeTab === 'active' && (
                    <span className="status-badge">Активна</span>
                  )}
                  {order.status === 'PENDING' && activeTab === 'pending' && (
                    <span className="status-badge">Чакаща</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;