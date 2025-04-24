import React, { useState, useEffect } from 'react';
import RestaurantManagement from './RestaurantManagement';
import ProductManagement from './ProductManagement';

const EmployeeDashboard = () => {
    const [activeTab, setActiveTab] = useState('restaurants');
    const [restaurants, setRestaurants] = useState([]);
    const [loadingRestaurants, setLoadingRestaurants] = useState(false);
    const [restaurantsError, setRestaurantsError] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productsError, setProductsError] = useState(null);
    const [addingRestaurantLoading, setAddingRestaurantLoading] = useState(false);
    const [addingRestaurantError, setAddingRestaurantError] = useState(null);
    const [updatingRestaurantLoading, setUpdatingRestaurantLoading] = useState(false);
    const [updatingRestaurantError, setUpdatingRestaurantError] = useState(null);
    const [deletingRestaurantLoading, setDeletingRestaurantLoading] = useState(false);
    const [deletingRestaurantError, setDeletingRestaurantError] = useState(null);
    const [addingProductLoading, setAddingProductLoading] = useState(false);
    const [addingProductError, setAddingProductError] = useState(null);
    const [updatingProductLoading, setUpdatingProductLoading] = useState(false);
    const [updatingProductError, setUpdatingProductError] = useState(null);
    const [deletingProductLoading, setDeletingProductLoading] = useState(false);
    const [deletingProductError, setDeletingProductError] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' };
    };

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoadingRestaurants(true);
            setRestaurantsError(null);
            try {
                const response = await fetch('http://localhost:9090/api/admin/restaurants', {
                    headers: getAuthHeaders(), // Headers are part of the configuration object
                });
    
                if (!response.ok) {
                    const message = `HTTP error! status: ${response.status}`;
                    throw new Error(message);
                }
                const data = await response.json();
                setRestaurants(data);
            } catch (error) {
                setRestaurantsError(error.message);
            } finally {
                setLoadingRestaurants(false);
            }
        };
    
        fetchRestaurants();
    }, []);

    const handleAddRestaurant = async (newRestaurant) => {
        setAddingRestaurantLoading(true);
        setAddingRestaurantError(null);
        try {
        const response = await fetch('http://localhost:9090/api/admin/restaurants', {
        method: 'POST',
        headers: getAuthHeaders(), // Use the function to get headers
        body: JSON.stringify({ ...newRestaurant, employee: { id: 1 } }),
        });
            if (response.ok) {
                const data = await response.json();
                setRestaurants([...restaurants, data]);
            } else {
                const errorData = await response.json();
                setAddingRestaurantError(`Грешка при добавяне на ресторант: ${errorData?.message || response.statusText}`);
            }
        } catch (error) {
            setAddingRestaurantError(`Грешка при добавяне на ресторант: ${error.message}`);
        } finally {
            setAddingRestaurantLoading(false);
        }
    };

    const handleUpdateRestaurant = async (updatedRestaurant) => {
        setUpdatingRestaurantLoading(true);
        setUpdatingRestaurantError(null);
        try {
        const response = await fetch(`http://localhost:9090/api/admin/restaurants/${updatedRestaurant.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(), // Use the function to get headers
        body: JSON.stringify(updatedRestaurant),
        });
            if (response.ok) {
                const data = await response.json();
                setRestaurants(restaurants.map(r => (r.id === updatedRestaurant.id ? data : r)));
            } else {
                const errorData = await response.json();
                setUpdatingRestaurantError(`Грешка при обновяване на ресторант: ${errorData?.message || response.statusText}`);
            }
        } catch (error) {
            setUpdatingRestaurantError(`Грешка при обновяване на ресторант: ${error.message}`);
        } finally {
            setUpdatingRestaurantLoading(false);
        }
    };

    const handleDeleteRestaurant = async (restaurantId) => {
        setDeletingRestaurantLoading(true);
        setDeletingRestaurantError(null);
        try {
            const response = await fetch(`http://localhost:9090/api/admin/restaurants/${restaurantId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (response.ok) {
                setRestaurants(restaurants.filter(r => r.id !== restaurantId));
                if (selectedRestaurant?.id === restaurantId) {
                    setSelectedRestaurant(null);
                    setActiveTab('restaurants');
                }
            } else {
                const errorData = await response.json();
                setDeletingRestaurantError(`Грешка при изтриване на ресторант: ${errorData?.message || response.statusText}`);
            }
        } catch (error) {
            setDeletingRestaurantError(`Грешка при изтриване на ресторант: ${error.message}`);
        } finally {
            setDeletingRestaurantLoading(false);
        }
    };

    const handleAddProduct = async (newProduct) => {
      setAddingProductLoading(true);
      setAddingProductError(null);
      try {
          // Assuming you have access to the selected restaurant's ID in a state variable,
          // likely 'selectedRestaurant'
          if (!selectedRestaurant || !selectedRestaurant.id) {
              console.error("Error: No restaurant selected or restaurant ID is missing.");
              setAddingProductError("Моля, изберете ресторант преди да добавите продукт.");
              setAddingProductLoading(false);
              return;
          }
  
          const restaurantId = selectedRestaurant.id; // Get the ID
  
          const response = await fetch(`http://localhost:9090/api/admin/restaurants/${restaurantId}/menu`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(newProduct),
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedRestaurant(prev => ({ ...prev, products: [...(prev.products || []), data] }));
                setRestaurants(restaurants.map(r =>
                    r.id === restaurantId ? { ...r, products: [...(r.products || []), data] } : r
                ));
            } else {
                const errorData = await response.json();
                setAddingProductError(`Грешка при добавяне на продукт: ${errorData?.message || response.statusText}`);
            }
        } catch (error) {
            setAddingProductError(`Грешка при добавяне на продукт: ${error.message}`);
        } finally {
            setAddingProductLoading(false);
        }
    };

    const handleUpdateProduct = async (restaurantId, updatedProduct) => {
        console.log('handleUpdateProduct called with:', restaurantId, updatedProduct); // Add this line
        setUpdatingProductLoading(true);
        setUpdatingProductError(null);
        try {
            const response = await fetch(
                `http://localhost:9090/api/admin/restaurants/${restaurantId}/menu/${updatedProduct.id}`,
                {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(updatedProduct),
                }
            );
            if (response.ok) {
                const data = await response.json();
                setSelectedRestaurant(prev => ({
                    ...prev,
                    products: prev.products.map(p => (p.id === updatedProduct.id ? data : p)),
                }));
                setRestaurants(restaurants.map(r =>
                    r.id === restaurantId ? {
                        ...r,
                        products: (r.products || []).map(p => (p.id === updatedProduct.id ? data : p)),
                    } : r
                ));
            } else {
                const errorData = await response.json();
                setUpdatingProductError(`Грешка при обновяване на продукт: ${errorData?.message || response.statusText}`);
            }
        } catch (error) {
            setUpdatingProductError(`Грешка при обновяване на продукт: ${error.message}`);
        } finally {
            setUpdatingProductLoading(false);
        }
    };

    const handleDeleteProduct = async (restaurantId, productId) => {
        setDeletingProductLoading(true);
        setDeletingProductError(null);
        try {
            const response = await fetch(`http://localhost:9090/api/admin/restaurants/${restaurantId}/menu/${productId}`, { // Changed to /menu
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (response.ok) {
                setSelectedRestaurant(prev => ({
                    ...prev,
                    products: prev.products.filter(p => p.id !== productId),
                }));
                setRestaurants(restaurants.map(r =>
                    r.id === restaurantId ? { ...r, products: (r.products || []).filter(p => p.id !== productId) } : r
                ));
            } else {
                const errorData = await response.json();
                setDeletingProductError(`Грешка при изтриване на продукт: ${errorData?.message || response.statusText}`);
            }
        } catch (error) {
            setDeletingProductError(`Грешка при изтриване на продукт: ${error.message}`);
        } finally {
            setDeletingProductLoading(false);
        }
    };

    const selectRestaurant = async (restaurant) => {
        setSelectedRestaurant(null);
        setLoadingProducts(true);
        setProductsError(null);
        setActiveTab('products');
        try {
            const response = await fetch(`http://localhost:9090/api/admin/restaurants/${restaurant.id}/menu`, {
                headers: getAuthHeaders(), // Headers are part of the configuration object
            });
    
            if (response.ok) {
                const data = await response.json();
                setSelectedRestaurant({ ...restaurant, products: data });
            } else {
                const errorData = await response.json();
                setProductsError(`Грешка при зареждане на продукти: ${errorData?.message || response.statusText}`);
            }
        } catch (error) {
            setProductsError(`Грешка при зареждане на продукти: ${error.message}`);
        } finally {
            setLoadingProducts(false);
        }
    };

    return (
        <div className="employee-dashboard">
            <div className="tabs">
                <button
                    className={activeTab === 'restaurants' ? 'active' : ''}
                    onClick={() => setActiveTab('restaurants')}
                    disabled={loadingRestaurants}
                >
                    Управление на ресторанти
                    {loadingRestaurants && ' (Зареждане...)'}
                    {restaurantsError && ` (Грешка: ${restaurantsError})`}
                </button>
                <button
                    className={activeTab === 'products' ? 'active' : ''}
                    onClick={() => selectedRestaurant && setActiveTab('products')}
                    disabled={!selectedRestaurant || loadingProducts}
                >
                    Управление на продукти
                    {selectedRestaurant && ` - ${selectedRestaurant.name}`}
                    {loadingProducts && ' (Зареждане...)'}
                    {productsError && ` (Грешка: ${productsError})`}
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'restaurants' && (
                    <div>
                        {addingRestaurantError && <p style={{ color: 'red' }}>{addingRestaurantError}</p>}
                        {updatingRestaurantError && <p style={{ color: 'red' }}>{updatingRestaurantError}</p>}
                        {deletingRestaurantError && <p style={{ color: 'red' }}>{deletingRestaurantError}</p>}
                        <RestaurantManagement
                            restaurants={restaurants}
                            onAddRestaurant={handleAddRestaurant}
                            onUpdateRestaurant={handleUpdateRestaurant}
                            onDeleteRestaurant={handleDeleteRestaurant}
                            onSelectRestaurant={selectRestaurant}
                            addingLoading={addingRestaurantLoading}
                            updatingLoading={updatingRestaurantLoading}
                            deletingLoading={deletingRestaurantLoading}
                        />
                    </div>
                )}

                    {activeTab === 'products' && selectedRestaurant && (
                        <div>
                            {addingProductError && <p style={{ color: 'red' }}>{addingProductError}</p>}
                            {updatingProductError && <p style={{ color: 'red' }}>{updatingProductError}</p>}
                            {deletingProductError && <p style={{ color: 'red' }}>{deletingProductError}</p>}
                            <ProductManagement
                                restaurant={selectedRestaurant}
                                onAddProduct={handleAddProduct}
                                onUpdateProduct={handleUpdateProduct}
                                onDeleteProduct={handleDeleteProduct}
                                onBack={() => {
                                    setActiveTab('restaurants');
                                    setSelectedRestaurant(null);
                                }}
                                addingLoading={addingProductLoading}
                                updatingLoading={updatingProductLoading}
                                deletingLoading={deletingProductLoading}
                                loadingProducts={loadingProducts}
                                productsError={productsError} // ADD THIS LINE
                            />
                        </div>
                    )}
            </div>
        </div>
    );
};

export default EmployeeDashboard;