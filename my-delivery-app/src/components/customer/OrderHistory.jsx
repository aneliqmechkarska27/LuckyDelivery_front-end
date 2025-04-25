import React from 'react';

const OrderHistory = ({ orders }) => {
  const getDisplayedStatus = (status) => {
    if (status === 'IN_TRANSIT') {
      return 'ACCEPTED';
    }
    return status;
  };

  const getStatusColor = (status) => {
    const displayedStatus = getDisplayedStatus(status);
    switch (displayedStatus) {
      case 'PENDING':
        return 'orange';
      case 'ACCEPTED':
        return 'green';
      case 'DELIVERED':
        return 'darkgreen';
      case 'CANCELED':
        return 'red';
      default:
        return '#000';
    }
  };

  const getStatusBackgroundColor = (status) => {
    const displayedStatus = getDisplayedStatus(status);
    switch (displayedStatus) {
      case 'PENDING':
        return 'rgba(255, 165, 0, 0.2)'; // Light orange
      case 'ACCEPTED':
        return 'rgba(0, 128, 0, 0.2)';   // Light green
      case 'DELIVERED':
        return 'rgba(0, 100, 0, 0.2)';   // Darker light green
      case 'CANCELED':
        return 'rgba(255, 0, 0, 0.2)';   // Light red
      default:
        return 'transparent';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>История на поръчките</h2>

      {orders.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#777' }}>Нямате предишни поръчки</p>
      ) : (
        <div style={{ listStyle: 'none', padding: '0' }}>
          {orders.map(order => (
            <div
              key={order.id}
              style={{
                border: '1px solid #ddd',
                marginBottom: '15px',
                padding: '15px',
                borderRadius: '5px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#555', marginBottom: '0' }}>Поръчка #{order.id}</h3>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: getStatusColor(order.status),
                    padding: '5px 10px',
                    borderRadius: '5px',
                    backgroundColor: getStatusBackgroundColor(order.status),
                  }}
                >
                  {getDisplayedStatus(order.status)}
                </span>
              </div>
              <p style={{ color: '#888', fontSize: '0.9em', marginBottom: '5px' }}>
                Дата: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('bg-BG') : 'Няма дата'}
              </p>
              <p style={{ color: '#666', marginBottom: '5px' }}>
                Ресторант: {order.restaurant ? order.restaurant.name : 'Информацията не е налична'}
              </p>
              {/* If you have order items:
              <div style={{ marginTop: '10px', paddingLeft: '15px', borderLeft: '2px solid #eee' }}>
                <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>Продукти:</p>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                  {order.orderItems && order.orderItems.map(item => (
                    <li key={item.id} style={{ color: '#777', marginBottom: '3px' }}>
                      {item.name} ({item.quantity}) - {item.price} лв.
                    </li>
                  ))}
                </ul>
              </div>
              */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;