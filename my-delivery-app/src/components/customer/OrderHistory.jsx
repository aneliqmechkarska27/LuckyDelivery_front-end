import React from 'react';

const OrderHistory = ({ orders }) => {
  return (
    <div className="order-history">
      <h2>История на поръчките</h2>
      
      {orders.length === 0 ? (
        <p>Нямате предишни поръчки</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Поръчка #{order.id}</h3>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p className="order-date">Дата: {order.date}</p>
              <p className="order-restaurant">Ресторант: {order.restaurant}</p>
              <div className="order-items">
                <h4>Поръчани продукти:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;