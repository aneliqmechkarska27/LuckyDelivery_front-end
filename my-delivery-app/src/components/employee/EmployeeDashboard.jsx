import React, { useState, useEffect } from 'react';
import RestaurantManagement from './RestaurantManagement';
import ProductManagement from './ProductManagement';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    // Симулация на зареждане на данни от API
    const mockRestaurants = [
      {
        id: 1,
        name: 'Пицария "Италиано"',
        address: 'ул. Витоша 15, София',
        phone: '02/888-9999',
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
        address: 'бул. България 102, София',
        phone: '02/777-8888',
        cuisine: 'Японска',
        products: [
          { id: 4, name: 'Калифорния рол', price: 15.99, description: '8 хапки' },
          { id: 5, name: 'Сашими сет', price: 18.99, description: 'Асорти от прясна риба' },
          { id: 6, name: 'Мисо супа', price: 5.99, description: 'Традиционна японска супа' }
        ]
      },
    ];
    
    setRestaurants(mockRestaurants);
  }, []);

  const handleAddRestaurant = (newRestaurant) => {
    const restaurantWithId = {
      ...newRestaurant,
      id: restaurants.length + 1,
      products: []
    };
    setRestaurants([...restaurants, restaurantWithId]);
  };

  const handleUpdateRestaurant = (updatedRestaurant) => {
    setRestaurants(
      restaurants.map(r => 
        r.id === updatedRestaurant.id ? updatedRestaurant : r
      )
    );
  };

  const handleDeleteRestaurant = (restaurantId) => {
    setRestaurants(restaurants.filter(r => r.id !== restaurantId));
  };

  const handleAddProduct = (restaurantId, newProduct) => {
    const updatedRestaurants = restaurants.map(restaurant => {
      if (restaurant.id === restaurantId) {
        return {
          ...restaurant,
          products: [
            ...restaurant.products,
            {
              ...newProduct,
              id: Math.max(...restaurant.products.map(p => p.id), 0) + 1
            }
          ]
        };
      }
      return restaurant;
    });
    setRestaurants(updatedRestaurants);
  };

  const handleUpdateProduct = (restaurantId, updatedProduct) => {
    const updatedRestaurants = restaurants.map(restaurant => {
      if (restaurant.id === restaurantId) {
        return {
          ...restaurant,
          products: restaurant.products.map(product => 
            product.id === updatedProduct.id ? updatedProduct : product
          )
        };
      }
      return restaurant;
    });
    setRestaurants(updatedRestaurants);
  };

  const handleDeleteProduct = (restaurantId, productId) => {
    const updatedRestaurants = restaurants.map(restaurant => {
      if (restaurant.id === restaurantId) {
        return {
          ...restaurant,
          products: restaurant.products.filter(product => product.id !== productId)
        };
      }
      return restaurant;
    });
    setRestaurants(updatedRestaurants);
  };

  const selectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setActiveTab('products');
  };

  return (
    <div className="employee-dashboard">
      <div className="tabs">
        <button 
          className={activeTab === 'restaurants' ? 'active' : ''}
          onClick={() => setActiveTab('restaurants')}
        >
          Управление на ресторанти
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => activeTab === 'products' && setActiveTab('products')}
          disabled={!selectedRestaurant}
        >
          Управление на продукти
          {selectedRestaurant && ` - ${selectedRestaurant.name}`}
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'restaurants' && (
          <RestaurantManagement 
            restaurants={restaurants}
            onAddRestaurant={handleAddRestaurant}
            onUpdateRestaurant={handleUpdateRestaurant}
            onDeleteRestaurant={handleDeleteRestaurant}
            onSelectRestaurant={selectRestaurant}
          />
        )}
        
        {activeTab === 'products' && selectedRestaurant && (
          <ProductManagement 
            restaurant={selectedRestaurant}
            onAddProduct={(product) => handleAddProduct(selectedRestaurant.id, product)}
            onUpdateProduct={(product) => handleUpdateProduct(selectedRestaurant.id, product)}
            onDeleteProduct={(productId) => handleDeleteProduct(selectedRestaurant.id, productId)}
            onBack={() => {
              setActiveTab('restaurants');
              setSelectedRestaurant(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;