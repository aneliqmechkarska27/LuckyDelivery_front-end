import React, { useState, useEffect } from 'react';

const DeliveryDashboard = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const backendBaseURL = 'http://localhost:9090/api/supplier';

    // Function to get the authentication headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' };
    };

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');

        if (!token) {
            console.error("No token found. User is not authenticated.");
            setError("Не сте удостоверени. Моля, влезте отново.");
            setLoading(false);
            return;
        }

        let endpoint = '';
        if (activeTab === 'pending') {
            endpoint = `${backendBaseURL}/available`;
        } else if (activeTab === 'active') {
            endpoint = `${backendBaseURL}/collected`; // Supplier ID should be handled by the backend using the token
        } else if (activeTab === 'completed') {
            endpoint = `${backendBaseURL}/completed`; // Supplier ID should be handled by the backend using the token
        }

        if (endpoint) {
            try {
                const response = await fetch(endpoint, {
                    headers: getAuthHeaders(), // Include the token in the headers
                });
                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
                }
                const data = await response.json();
                setOrders(data);
                console.log(`Fetched ${activeTab} orders:`, data);
            } catch (error) {
                console.error(`Failed to fetch ${activeTab} orders:`, error);
                setError(`Грешка при зареждане на ${activeTab} доставки: ${error.message}`);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        } else {
            setOrders([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [activeTab]); // Removed loggedInSupplierId as it should come from the token now

    const claimOrder = async (orderId) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No token found. Cannot claim order.");
            setError("Не сте удостоверени. Моля, влезте отново.");
            return;
        }
        const endpoint = `${backendBaseURL}/claim/${orderId}`; // Supplier ID should be handled by the backend
        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: getAuthHeaders(), // Include the token
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to claim order: ${response.status} - ${errorData}`);
            }
            fetchOrders(); // Refresh orders after claiming
        } catch (error) {
            console.error("Could not claim order:", error);
            setError(`Грешка при приемане на доставка: ${error.message}`);
        }
    };

    const markAsDelivered = async (orderId) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No token found. Cannot mark as delivered.");
            setError("Не сте удостоверени. Моля, влезте отново.");
            return;
        }
        const endpoint = `${backendBaseURL}/deliver/${orderId}`;
        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: getAuthHeaders(), // Include the token
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to mark as delivered: ${response.status} - ${errorData}`);
            }
            fetchOrders(); // Refresh orders after delivery
        } catch (error) {
            console.error("Could not mark as delivered:", error);
            setError(`Грешка при завършване на доставка: ${error.message}`);
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

            {loading && <p>Зареждане на доставки...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="orders-container">
                {!loading && !error && orders.length === 0 ? (
                    <p>Няма {activeTab === 'pending' ? 'чакащи' : activeTab === 'active' ? 'активни' : 'завършени'} доставки</p>
                ) : (
                    !loading && !error && orders.map(order => (
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