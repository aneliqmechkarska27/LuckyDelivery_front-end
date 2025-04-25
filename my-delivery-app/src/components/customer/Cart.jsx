import React, { useState } from 'react';

const Cart = ({ items, onRemove, onPlaceOrder, onUpdateQuantity }) => {
    const [deliveryAddress, setDeliveryAddress] = useState("Временно въведен адрес");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const getAuthHeaders = () => {
       const token = localStorage.getItem('authToken'); // Changed to 'authToken'
       console.log('getAuthHeaders called. Token:', token);
       if (token) {
         return {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`,
         };
       }
       return { 'Content-Type': 'application/json' };
     };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2);
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
      try {
        const response = await fetch(`http://localhost:9090/api/cart/update/${itemId}`, {
          method: 'PUT',
          headers: getAuthHeaders(), // Make sure you are calling this function here
          body: JSON.stringify({ quantity: newQuantity }), // Adjust the body as needed by your backend
        });
  
        if (!response.ok) {
          console.error('Failed to update item quantity on the server');
          const errorData = await response.json();
          console.error('Error:', errorData);
          // Handle error appropriately (e.g., display a message to the user)
        } else {
          console.log('Item quantity updated successfully');
          onQuantityChange(itemId, newQuantity); // Update local state
        }
      } catch (error) {
        console.error('There was an error updating the item:', error);
        // Handle network errors
      }
    };

    const handleRemoveItem = (itemId) => {
        const token = localStorage.getItem('authToken');
        fetch(`http://localhost:9090/api/cart/delete/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    onRemove(itemId);
                } else {
                    console.error('Failed to remove item from cart on the server');
                    return response.text().then(text => console.error('Remove error body:', text));
                }
            })
            .catch(error => {
                console.error('Error removing item from cart:', error);
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
                            <div key={item.id} className="cart-item"> {/* --- HERE IT IS! --- */}
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
                        <div>
                            <label htmlFor="deliveryAddress">Адрес за доставка:</label>
                            <input
                                type="text"
                                id="deliveryAddress"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="paymentMethod">Метод на плащане:</label>
                            <select
                                id="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="cash">Наложен платеж</option>
                                <option value="card">Кредитна/Дебитна карта</option>
                                <option value="paypal">PayPal</option>
                            </select>
                        </div>
                        <button
                            className="order-button"
                            onClick={() => onPlaceOrder(deliveryAddress, paymentMethod, calculateTotal())}
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