import React, { useState } from 'react';

const Cart = ({ items, onRemove, onPlaceOrder, onUpdateQuantity }) => {
  const [deliveryAddress, setDeliveryAddress] = useState("Временно въведен адрес"); // Temporary state

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(1, newQuantity);
    onUpdateQuantity(itemId, quantity);

    fetch(`http://localhost:9090/api/cart/update/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Include authentication headers if needed
      },
      body: JSON.stringify({ quantity }),
    })
      .then(response => {
        if (!response.ok) {
          console.error('Failed to update item quantity on the server');
        }
      })
      .catch(error => {
        console.error('Error updating item quantity:', error);
      });
  };

  const handleRemoveItem = (itemId) => {
    fetch(`http://localhost:9090/api/cart/delete/${itemId}`, {
      method: 'DELETE',
      // Include authentication headers if needed
    })
      .then(response => {
        if (response.ok) {
          onRemove(itemId); // Update the frontend state
        } else {
          console.error('Failed to remove item from cart on the server');
          return response.text().then(text => console.error('Remove error body:', text));
        }
      })
      .catch(error => {
        console.error('Error removing item from cart:', error);
      });
  };

  const handlePlaceOrder = () => {
    // TEMPORARY BYPASS FOR USER ID - REPLACE WITH ACTUAL USER RETRIEVAL LATER 
    const userId = 1; // Replace with the actual logged-in user ID when available 
    const restaurantId = items.length > 0 ? items[0].restaurantId : null; 
    const totalPrice = parseFloat(calculateTotal()); 
    const paymentMethod = "COD"; // Default payment method 
    if (!userId || !restaurantId || items.length === 0 || !deliveryAddress) 
      { alert("Моля, уверете се, че сте въвели адрес за доставка и има артикули в кошницата."); return; }
  
    fetch('http://localhost:9090/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include authentication headers if needed later
      },
      body: JSON.stringify({
        user: { id: userId },
        restaurant: { id: restaurantId },
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
        deliveryAddress: deliveryAddress,
        // We are NOT including orderItems in the Order object now
      }),
    })
    .then(response => {
      if (response.ok) {
        onPlaceOrder(); // Notify parent to clear cart
        alert('Поръчката е създадена успешно!');
      } else {
        console.error('Failed to place order on the server');
        return response.text().then(text => console.error('Order placement error body:', text));
      }
    })
    .catch(error => {
      console.error('Error placing order:', error);
    });
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
                  {item.price && item.quantity && `${item.price.toFixed(2)} лв. × ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} лв.`}
                </div>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveItem(item.id)}
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
            {/* Temporary input for delivery address */}
            <div>
              <label htmlFor="deliveryAddress">Адрес за доставка:</label>
              <input
                type="text"
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
            <button
              className="order-button"
              onClick={handlePlaceOrder}
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