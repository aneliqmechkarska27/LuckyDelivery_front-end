import React, { useState } from 'react';

const ProductManagement = ({ 
  restaurant, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onBack
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    price: '',
    description: ''
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...currentProduct,
      price: parseFloat(currentProduct.price)
    };
    
    if (isEditing) {
      onUpdateProduct(productData);
      setIsEditing(false);
    } else {
      onAddProduct(productData);
      setIsAdding(false);
    }
    
    setCurrentProduct({
      name: '',
      price: '',
      description: ''
    });
  };

  const startEditing = (product) => {
    setCurrentProduct({ ...product });
    setIsEditing(true);
    setIsAdding(false);
  };

  const cancelForm = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentProduct({
      name: '',
      price: '',
      description: ''
    });
  };

  return (
    <div className="product-management">
      <button className="back-button" onClick={onBack}>
        &larr; Назад към ресторантите
      </button>
      
      <div className="section-header">
        <h2>Продукти за ресторант: {restaurant.name}</h2>
        {!isAdding && !isEditing && (
          <button 
            className="add-button"
            onClick={() => setIsAdding(true)}
          >
            + Добави нов продукт
          </button>
        )}
      </div>
      
      {(isAdding || isEditing) && (
        <div className="product-form">
          <h3>{isEditing ? 'Редактиране на продукт' : 'Добавяне на нов продукт'}</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Име на продукта:</label>
              <input 
                type="text" 
                value={currentProduct.name} 
                onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Цена (лв.):</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                value={currentProduct.price} 
                onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Описание:</label>
              <textarea 
                value={currentProduct.description} 
                onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                required
              />
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="save-button">
                {isEditing ? 'Запази промените' : 'Добави продукт'}
              </button>
              <button type="button" className="cancel-button" onClick={cancelForm}>
                Отказ
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="products-list">
        {restaurant.products.length === 0 ? (
          <p>Няма добавени продукти</p>
        ) : (
          restaurant.products.map(product => (
            <div key={product.id} className="product-item">
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">{product.price.toFixed(2)} лв.</p>
                <p className="description">{product.description}</p>
              </div>
              
              <div className="product-actions">
                <button 
                  className="edit-button"
                  onClick={() => startEditing(product)}
                >
                  Редактирай
                </button>
                <button 
                  className="delete-button"
                  onClick={() => onDeleteProduct(product.id)}
                >
                  Изтрий
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductManagement;