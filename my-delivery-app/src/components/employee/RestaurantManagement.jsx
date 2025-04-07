import React, { useState } from 'react';

const RestaurantManagement = ({ 
  restaurants, 
  onAddRestaurant, 
  onUpdateRestaurant, 
  onDeleteRestaurant,
  onSelectRestaurant
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState({
    name: '',
    address: '',
    phone: '',
    cuisine: ''
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onUpdateRestaurant(currentRestaurant);
      setIsEditing(false);
    } else {
      onAddRestaurant(currentRestaurant);
      setIsAdding(false);
    }
    setCurrentRestaurant({
      name: '',
      address: '',
      phone: '',
      cuisine: ''
    });
  };

  const startEditing = (restaurant) => {
    setCurrentRestaurant({ ...restaurant });
    setIsEditing(true);
    setIsAdding(false);
  };

  const cancelForm = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentRestaurant({
      name: '',
      address: '',
      phone: '',
      cuisine: ''
    });
  };

  return (
    <div className="restaurant-management">
      <div className="section-header">
        <h2>Управление на ресторанти</h2>
        {!isAdding && !isEditing && (
          <button 
            className="add-button"
            onClick={() => setIsAdding(true)}
          >
            + Добави нов ресторант
          </button>
        )}
      </div>
      
      {(isAdding || isEditing) && (
        <div className="restaurant-form">
          <h3>{isEditing ? 'Редактиране на ресторант' : 'Добавяне на нов ресторант'}</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Име на ресторанта:</label>
              <input 
                type="text" 
                value={currentRestaurant.name} 
                onChange={(e) => setCurrentRestaurant({...currentRestaurant, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Адрес:</label>
              <input 
                type="text" 
                value={currentRestaurant.address} 
                onChange={(e) => setCurrentRestaurant({...currentRestaurant, address: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Телефон:</label>
              <input 
                type="text" 
                value={currentRestaurant.phone} 
                onChange={(e) => setCurrentRestaurant({...currentRestaurant, phone: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Тип кухня:</label>
              <input 
                type="text" 
                value={currentRestaurant.cuisine} 
                onChange={(e) => setCurrentRestaurant({...currentRestaurant, cuisine: e.target.value})}
                required
              />
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="save-button">
                {isEditing ? 'Запази промените' : 'Добави ресторант'}
              </button>
              <button type="button" className="cancel-button" onClick={cancelForm}>
                Отказ
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="restaurants-list">
        {restaurants.length === 0 ? (
          <p>Няма добавени ресторанти</p>
        ) : (
          restaurants.map(restaurant => (
            <div key={restaurant.id} className="restaurant-item">
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p><strong>Адрес:</strong> {restaurant.address}</p>
                <p><strong>Телефон:</strong> {restaurant.phone}</p>
                <p><strong>Кухня:</strong> {restaurant.cuisine}</p>
                <p><strong>Брой продукти:</strong> {restaurant.products.length}</p>
              </div>
              
              <div className="restaurant-actions">
                <button 
                  className="edit-button"
                  onClick={() => startEditing(restaurant)}
                >
                  Редактирай
                </button>
                <button 
                  className="delete-button"
                  onClick={() => onDeleteRestaurant(restaurant.id)}
                >
                  Изтрий
                </button>
                <button 
                  className="products-button"
                  onClick={() => onSelectRestaurant(restaurant)}
                >
                  Управление на продукти
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RestaurantManagement;