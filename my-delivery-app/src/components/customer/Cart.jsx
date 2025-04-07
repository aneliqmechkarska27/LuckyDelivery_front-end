import React from 'react';

const Cart = ({ items, onRemove, onPlaceOrder }) => {
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };

  return (
    <div className="cart">
      <h2>Вашата кошница</h2>
      
      {items.length === 0 ? (
        <p>Кошницата е празна</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="item-price">
                  {item.price.toFixed(2)} лв.
                </div>
                <button 
                  className="remove-button"
                  onClick={() => onRemove(item.id)}
                >
                  Премахни
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="total">
              <span>Общо:</span>
              <span>{calculateTotal()} лв.</span>
            </div>
            <button 
              className="order-button"
              onClick={onPlaceOrder}
            >
              Направи поръчка
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;