import React from 'react';

const Cart = ({ items, onRemove, onPlaceOrder, onUpdateQuantity }) => {
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2);
  };

  // Функция за управление на количеството
  const handleQuantityChange = (itemId, newQuantity) => {
    // Минималното количество е 1
    const quantity = Math.max(1, newQuantity);
    onUpdateQuantity(itemId, quantity);
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
                  <div className="quantity-selector">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity || 1}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      className="quantity-input"
                    />
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="item-price">
                  {item.price.toFixed(2)} лв. × {item.quantity || 1} = {(item.price * (item.quantity || 1)).toFixed(2)} лв.
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