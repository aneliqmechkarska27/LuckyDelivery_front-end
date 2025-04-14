import React from 'react';

const OrderHistory = ({ orders }) => {
  console.log("Orders received in OrderHistory:", orders);

  return (
    <div className="order-history">
      <h2>Моите поръчки</h2>
      {orders.length === 0 ? (
        <p>Няма предишни поръчки.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id} className="order-item">
              <h3>Поръчка #{order.id}</h3>
              {/* We'll try to display the restaurant name here */}
              {order.restaurant && <p>Ресторант: {order.restaurant.name}</p>}
              {!order.restaurant && <p>Ресторант: Информацията не е налична</p>}
              <ul>
                {/* Assuming order.items is an array of item names */}
                {order.items && order.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p>Статус: {order.status}</p>
              {order.createdAt && <p>Дата: {new Date(order.createdAt).toLocaleDateString('bg-BG')}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;