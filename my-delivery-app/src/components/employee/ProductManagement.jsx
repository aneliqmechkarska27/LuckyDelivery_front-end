import React, { useState } from 'react';

const ProductManagement = ({
    restaurant,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onBack,
    addingLoading,
    updatingLoading,
    deletingLoading,
    addProductError,
    updateProductError,
    deleteProductError,
    loadingProducts,
    productsError
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        id: null, // Add ID for editing
        name: '',
        price: '',
        description: ''
    });
    const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...currentProduct,
            price: parseFloat(currentProduct.price)
        };
        console.log('Submitting product data:', productData); // Add this line
    
        if (isEditing) {
            onUpdateProduct(restaurant.id, productData); // Ensure you are passing restaurant.id
            setIsEditing(false);
        } else {
            onAddProduct(restaurant.id, productData); // Ensure you are passing restaurant.id
            setIsAdding(false);
        }
    
        setCurrentProduct({ id: null, name: '', price: '', description: '' });
    };

    const startEditing = (product) => {
        setCurrentProduct({ ...product });
        setIsEditing(true);
        setIsAdding(false);
    };

    const cancelForm = () => {
        setIsAdding(false);
        setIsEditing(false);
        setCurrentProduct({ id: null, name: '', price: '', description: '' });
    };

    const confirmDelete = (productId) => {
        onDeleteProduct(restaurant.id, productId);
        setDeleteConfirmationId(productId);
    };

    const handleConfirmDelete = (productId) => {
        onDeleteProduct(productId);
        setDeleteConfirmationId(null);
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationId(null);
    };

    return (
      <div className="product-management" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <button className="back-button" onClick={onBack} style={{ padding: '10px 15px', marginBottom: '20px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
          &larr; Назад към ресторантите
      </button>

      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          <h2 style={{ color: '#333' }}>Продукти за ресторант: {restaurant.name}</h2>
          {!isAdding && !isEditing && (
              <button
              className="add-button"
              onClick={() => setIsAdding(true)}
              style={{ padding: '10px 15px', backgroundColor: '#5cb85c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}
              disabled={addingLoading || updatingLoading || deletingLoading || loadingProducts} // Corrected line: no self-closing tag
              >
              + Добави нов продукт
            </button>
          )}
      </div>

            {(isAdding || isEditing) && (
                <div className="product-form" style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ color: '#333', marginBottom: '15px' }}>{isEditing ? 'Редактиране на продукт' : 'Добавяне на нов продукт'}</h3>
                    {addProductError && <p style={{ color: 'red' }}>{addProductError}</p>}
                    {isEditing && updateProductError && <p style={{ color: 'red' }}>{updateProductError}</p>}
                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
                        <div className="form-group" style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9em' }}>Име на продукта:</label>
                            <input
                                type="text"
                                value={currentProduct.name}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '3px', border: '1px solid #ccc', fontSize: '1em' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9em' }}>Цена (лв.):</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={currentProduct.price}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '3px', border: '1px solid #ccc', fontSize: '1em' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9em' }}>Описание:</label>
                            <textarea
                                value={currentProduct.description}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '3px', border: '1px solid #ccc', fontSize: '1em', minHeight: '80px' }}
                            />
                        </div>
                        <div className="form-buttons" style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'flex-end' }}>
                            <button type="submit" className="save-button" disabled={addingLoading || updatingLoading} style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
                                {isEditing ? (updatingLoading ? 'Запазване...' : 'Запази') : (addingLoading ? 'Добавяне...' : 'Добави')}
                            </button>
                            <button type="button" className="cancel-button" onClick={cancelForm} style={{ padding: '8px 12px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
                                Отказ
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loadingProducts && <p>Зареждане на продукти...</p>}
            {productsError && <p style={{ color: 'red' }}>Грешка при зареждане на продукти: {productsError}</p>}

            {!loadingProducts && !productsError && (
            <div className="products-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, auto))', gap: '15px' }}>
                {restaurant.products && restaurant.products.length === 0 ? (
                    <p style={{ fontSize: '1em', color: '#777' }}>Няма добавени продукти</p>
                ) : (
                    restaurant.products && restaurant.products.map(product => (
                        <div key={product.id} className="product-item" style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '150px' }}>
                            <div className="product-info" style={{ marginBottom: '10px' }}>
                                <h3 style={{ color: '#333', fontSize: '1.1em', marginBottom: '5px' }}>{product.name}</h3>
                                <p className="price" style={{ color: '#008000', fontWeight: 'bold', fontSize: '0.9em', marginBottom: '3px' }}>{product.price.toFixed(2)} лв.</p>
                                <p className="description" style={{ color: '#555', fontSize: '0.85em' }}>{product.description}</p>
                            </div>
                            

                            <div className="product-actions" style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                <button
                                    className="edit-button"
                                    onClick={() => startEditing(product)}
                                    style={{ padding: '8px 12px', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em' }}
                                    disabled={addingLoading || updatingLoading || deletingLoading}
                                >
                                    Редактирай
                                </button>
                                {deleteConfirmationId === product.id ? (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <button onClick={() => handleConfirmDelete(product.id)} style={{ padding: '8px 12px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em' }}>Потвърди</button>
                                        <button onClick={handleCancelDelete} style={{ padding: '8px 12px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em' }}>Отказ</button>
                                    </div>
                                ) : (
                                    <button
                                        className="delete-button"
                                        onClick={() => confirmDelete(product.id)}
                                        style={{ padding: '8px 12px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em' }}
                                        disabled={addingLoading || updatingLoading || deletingLoading}
                                    >
                                        Изтрий
                                    </button>
                                )}
                            </div>
                            {deleteProductError && deleteConfirmationId === product.id && <p style={{ color: 'red', marginTop: '5px' }}>{deleteProductError}</p>}
                        </div>
                        
                    ))
                )}
            </div>
            )}
        </div>
    );
};

export default ProductManagement;