import React, { useState, useEffect } from 'react';

const DeliveryDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Симулация на зареждане на данни от API
    const mockOrders = [
      {
        id: 1,
        customerName: 'Иван Иванов',
        address: 'ул. Граф Игнатиев 15, ап. 4, София',
        restaurant: 'Пицария "Италиано"',
        items: ['Пица Маргарита', 'Пица Пеперони'],
        total: 23.98,
        status: 'pending',
        createdAt: '2025-04-03T10:30:00'
      },
      {
        id: 2,
        customerName: 'Мария Петрова',
        address: 'бул. Витоша 122, ет. 5, София',
        restaurant: 'Суши Експрес',
        items: ['Калифорния рол', 'Мисо супа'],
        total: 21.98,
        status: 'active',
        createdAt: '2025-04-03T09:45:00'
      },
      {
        id: 3,
        customerName: 'Георги Димитров',
        address: 'ул. Патриарх Евтимий 8, блок 2, София',
        restaurant: 'Пицария "Италиано"',
        items: ['Лазаня', 'Тирамису'],
        total: 19.98,
        status: 'completed',
        createdAt: '2025-04-02T18:20:00'
      },
      {
        id: 4,
        customerName: 'Петър Стоянов',
        address: 'бул. Черни връх 55, ет. 3, София',
        restaurant: 'Суши Експрес',
        items: ['Сашими сет', 'Мисо супа', 'Едамаме'],
        total: 29.97,
        status: 'pending',
        createdAt: '2025-04-03T11:15:00'
      }
    ];
    
    setOrders(mockOrders);
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'active') return order.status === 'active';
    if (activeTab === 'completed') return order.status === 'completed';
    return true;
  });

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
        {filteredOrders.length === 0 ? (
          <p>Няма {activeTab === 'pending' ? 'чакащи' : activeTab === 'active' ? 'активни' : 'завършени'} доставки</p>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className={`order-card ${order.status}`}>
              <div className="order-header">
                <h3>Поръчка #{order.id}</h3>
                <span className="time">{formatTime(order.createdAt)}</span>
              </div>
              
              <div className="customer-info">
                <p><strong>Клиент:</strong> {order.customerName}</p>
                <p><strong>Адрес:</strong> {order.address}</p>
                <p><strong>Ресторант:</strong> {order.restaurant}</p>
              </div>
              
              <div className="order-items">
                <h4>Поръчани продукти:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="order-footer">
                <p className="total">Обща сума: {order.total.toFixed(2)} лв.</p>
                
                <div className="action-buttons">
                  {order.status === 'pending' && (
                    <button 
                      className="accept-button"
                      onClick={() => updateOrderStatus(order.id, 'active')}
                    >
                      Приеми доставката
                    </button>
                  )}
                  
                  {order.status === 'active' && (
                    <button 
                      className="complete-button"
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                    >
                      Завърши доставката
                    </button>
                  )}
                  
                  {order.status === 'completed' && (
                    <span className="status-badge">Завършена</span>
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