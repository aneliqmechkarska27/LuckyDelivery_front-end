import React, { useState } from 'react';

const RestaurantManagement = ({
    restaurants,
    onAddRestaurant,
    onUpdateRestaurant,
    onDeleteRestaurant,
    onSelectRestaurant,
    addingLoading,
    updatingLoading,
    deletingLoading
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
        setCurrentRestaurant({ name: '', address: '', phone: '', cuisine: '' });
    };

    const startEditing = (restaurant) => {
        setCurrentRestaurant({ ...restaurant });
        setIsEditing(true);
        setIsAdding(false);
    };

    const cancelForm = () => {
        setIsAdding(false);
        setIsEditing(false);
        setCurrentRestaurant({ name: '', address: '', phone: '', cuisine: '' });
    };

    return (
        <div className="restaurant-management" style={{
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            display: 'flex', // Enable flexbox for centering the form
            flexDirection: 'column', // Keep content stacked
            alignItems: 'center' // Center items horizontally
        }}>
            <div className="section-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                borderBottom: '1px solid #eee',
                paddingBottom: '15px',
                width: '100%', // Ensure it takes full width to space items
                maxWidth: '800px' // Optional: Limit the maximum width of the header
            }}>
                <h2 style={{ color: '#333' }}>Управление на ресторанти</h2>
                {!isAdding && !isEditing && (
                    <button
                        className="add-button"
                        onClick={() => setIsAdding(true)}
                        style={{
                            padding: '12px 20px',
                            backgroundColor: '#5cb85c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#4cae4c')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#5cb85c')}
                    >
                        + Добави нов ресторант
                    </button>
                )}
            </div>

            {(isAdding || isEditing) && (
                <div className="restaurant-form" style={{
                    marginBottom: '30px',
                    border: '1px solid #ddd',
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                    maxWidth: '600px', // Limit the width of the form
                    width: '80%', // Take up a percentage of the container
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center' // Center form elements horizontally
                }}>
                    <h3 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>
                        {isEditing ? 'Редактиране на ресторант' : 'Добавяне на нов ресторант'}
                    </h3>
                    <form onSubmit={handleFormSubmit} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxWidth: '400px' // Limit the width of the form elements
                    }}>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold', fontSize: '0.9em' }}>Име на ресторанта:</label>
                            <input type="text" value={currentRestaurant.name} onChange={(e) => setCurrentRestaurant({ ...currentRestaurant, name: e.target.value })} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em' }} />
                        </div>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold', fontSize: '0.9em' }}>Адрес:</label>
                            <input type="text" value={currentRestaurant.address} onChange={(e) => setCurrentRestaurant({ ...currentRestaurant, address: e.target.value })} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em' }} />
                        </div>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold', fontSize: '0.9em' }}>Телефон:</label>
                            <input type="text" value={currentRestaurant.phone} onChange={(e) => setCurrentRestaurant({ ...currentRestaurant, phone: e.target.value })} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em' }} />
                        </div>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold', fontSize: '0.9em' }}>Тип кухня:</label>
                            <input type="text" value={currentRestaurant.cuisine} onChange={(e) => setCurrentRestaurant({ ...currentRestaurant, cuisine: e.target.value })} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em' }} />
                        </div>
                        <div className="form-buttons" style={{ display: 'flex', gap: '15px', marginTop: '20px', justifyContent: 'center' }}>
                            <button type="submit" className="save-button" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1em', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')} onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}>
                                {isEditing ? 'Запази' : 'Добави'}
                            </button>
                            <button type="button" className="cancel-button" onClick={cancelForm} style={{ padding: '10px 15px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1em', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => (e.target.style.backgroundColor = '#c9302c')} onMouseOut={(e) => (e.target.style.backgroundColor = '#d9534f')}>
                                Отказ
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="restaurants-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, auto))', gap: '20px', maxWidth: '800px', width: '100%' }}>
                {restaurants && Array.isArray(restaurants) && restaurants.length === 0 ? (
                    <p style={{ fontSize: '1em', color: '#777', textAlign: 'center' }}>Няма добавени ресторанти</p>
                ) : (
                    restaurants && Array.isArray(restaurants) && restaurants.map(restaurant => (
                        <div key={restaurant.id} className="restaurant-item" style={{
                            border: '1px solid #eee',
                            padding: '15px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                            backgroundColor: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '200px'
                        }}>
                            <div className="restaurant-info" style={{ marginBottom: '15px' }}>
                                <h3 style={{ color: '#333', marginBottom: '8px', fontSize: '1.2em' }}>{restaurant.name}</h3>
                                <p style={{ color: '#555', marginBottom: '4px', fontSize: '0.9em' }}><strong>Адрес:</strong> {restaurant.address}</p>
                                <p style={{ color: '#555', marginBottom: '4px', fontSize: '0.9em' }}><strong>Телефон:</strong> {restaurant.phone}</p>
                                <p style={{ color: '#555', marginBottom: '4px', fontSize: '0.9em' }}><strong>Кухня:</strong> {restaurant.cuisine}</p>
                            </div>

                            <div className="restaurant-actions" style={{
                                display: 'flex',
                                gap: '8px',
                                marginTop: 'auto',
                            }}>
                                <button
                                    className="edit-button"
                                    onClick={() => startEditing(restaurant)}
                                    style={{ padding: '8px 12px', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em', transition: 'background-color 0.3s ease' }}
                                    onMouseOver={(e) => (e.target.style.backgroundColor = '#eea236')}
                                    onMouseOut={(e) => (e.target.style.backgroundColor = '#f0ad4e')}
                                    disabled={updatingLoading || deletingLoading}
                                >
                                    Редактирай
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => onDeleteRestaurant(restaurant.id)}
                                    style={{ padding: '8px 12px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em', transition: 'background-color 0.3s ease' }}
                                    onMouseOver={(e) => (e.target.style.backgroundColor = '#c9302c')}
                                    onMouseOut={(e) => (e.target.style.backgroundColor = '#d9534f')}
                                    disabled={updatingLoading || deletingLoading}
                                >
                                    Изтрий
                                </button>
                                <button
                                    className="products-button"
                                    onClick={() => onSelectRestaurant(restaurant)}
                                    style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em', transition: 'background-color 0.3s ease' }}
                                    onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                                    onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                                >
                                    Управление
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