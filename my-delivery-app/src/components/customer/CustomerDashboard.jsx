import React, { useState, useEffect } from 'react';
import RestaurantList from './RestaurantList';
import Cart from './Cart';
import OrderHistory from './OrderHistory';

const CustomerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('restaurants');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Симулация на зареждане на данни от API
    // В реален проект тук ще има заявка към сървъра
    const mockRestaurants = [
      {
        id: 1,
        name: 'Пицария "Италиано"',
        cuisine: 'Италианска',
        products: [
          { id: 1, name: 'Пица Маргарита', price: 10.99, description: 'Домати, моцарела, босилек' },
          { id: 2, name: 'Пица Пеперони', price: 12.99, description: 'Пеперони, сирене, доматен сос' },
          { id: 3, name: 'Лазаня', price: 14.99, description: 'Класическа италианска лазаня' }
        ]
      },
      {
        id: 2,
        name: 'Суши Експрес',
        cuisine: 'Японска',
        products: [
          { id: 4, name: 'Калифорния рол', price: 15.99, description: '8 хапки' },
          { id: 5, name: 'Сашими сет', price: 18.99, description: 'Асорти от прясна риба' },
          { id: 6, name: 'Мисо супа', price: 5.99, description: 'Традиционна японска супа' }
        ]
      },
    ];
    
    setRestaurants(mockRestaurants);
    
    // Примерни предишни поръчки
    setOrders([
      { id: 1, restaurant: 'Пицария "Италиано"', items: ['Пица Маргарита', 'Пица Пеперони'], status: 'Доставена', date: '22.03.2025' },
      { id: 2, restaurant: 'Суши Експрес', items: ['Калифорния рол', 'Мисо супа'], status: 'В процес', date: '02.04.2025' }
    ]);
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: orders.length + 1,
      restaurant: restaurants.find(r => r.id === cart[0].restaurantId)?.name || 'Ресторант',
      items: cart.map(item => item.name),
      status: 'Нова',
      date: new Date().toLocaleDateString('bg-BG')
    };
    
    setOrders([...orders, newOrder]);
    setCart([]);
    setActiveTab('orders');
    alert('Поръчката е създадена успешно!');
  };

  return (
    <div className="customer-dashboard">
      <div className="tabs">
        <button 
          className={activeTab === 'restaurants' ? 'active' : ''}
          onClick={() => setActiveTab('restaurants')}
        >
          Ресторанти
        </button>
        <button 
          className={activeTab === 'cart' ? 'active' : ''}
          onClick={() => setActiveTab('cart')}
        >
          Кошница ({cart.length})
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Моите поръчки
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'restaurants' && (
          <RestaurantList 
            restaurants={restaurants} 
            onAddToCart={addToCart} 
          />
        )}
        
        {activeTab === 'cart' && (
          <Cart 
            items={cart} 
            onRemove={removeFromCart} 
            onPlaceOrder={placeOrder} 
          />
        )}
        
        {activeTab === 'orders' && (
          <OrderHistory orders={orders} />
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;