import React, { useState } from "react";
import italianoImg from "../../assets/restaurants/italiano.jpg";
import sushiImg from "../../assets/restaurants/sushi.jpg";
import margaritaImg from "../../assets/restaurants/margarita.jpg";
import calzoneImg from "../../assets/restaurants/calzone.jpg";
import carbonaraImg from "../../assets/restaurants/carbonara.jpg";
import sushiSetImg from "../../assets/restaurants/shikisushi-set.jpg";
import tempuraImg from "../../assets/restaurants/tempura.jpg";
import unagiImg from "../../assets/restaurants/unagi.jpg";

const RestaurantList = ({ onAddToCart }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const restaurants = [
    {
      id: 1,
      name: 'Пицария "Италиано"',
      cuisine: "Италианска",
      image: italianoImg,
      products: [
        {
          id: 1,
          name: "Маргарита",
          description: "Класическа пица с домати и моцарела",
          price: 11.99,
          image: margaritaImg
        },
        {
          id: 2,
          name: "Калцоне",
          description: "Пълнена пица със сирена и шунка",
          price: 12.5,
          image: calzoneImg
        },
        {
          id: 3,
          name: "Паста Карбонара",
          description: "Кремообразна паста със сметана и бекон",
          price: 11.0,
          image: carbonaraImg
        },
      ],
    },
    {
      id: 2,
      name: "Суши Експрес",
      cuisine: "Японска",
      image: sushiImg,
      products: [
        {
          id: 1,
          name: "Суши сет Класик",
          description: "Микс от нигири и маки",
          price: 15.99,
          image: sushiSetImg
        },
        {
          id: 2,
          name: "Темпура рол",
          description: "Хрупкав рол с авокадо и скариди",
          price: 13.49,
          image: tempuraImg
        },
        {
          id: 3,
          name: "Унаги маки",
          description: "Маки рол с пушена змиорка",
          price: 8.99,
          image: unagiImg
        },
      ],
    },
  ];

  return (
    <div className="restaurant-container">
      {!selectedRestaurant ? (
        <>
          <h2>Налични ресторанти</h2>
          <div className="restaurant-list">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="restaurant-card">
                <div className="restaurant-image">
                  <img src={restaurant.image} alt={restaurant.name} />
                </div>
                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  <p>Кухня: {restaurant.cuisine}</p>
                  <p>Брой продукти: {restaurant.products.length}</p>
                  <button
                    className="view-menu-btn"
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    Виж меню
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="restaurant-menu">
          <button
            className="back-button"
            onClick={() => setSelectedRestaurant(null)}
          >
            &larr; Назад към ресторантите
          </button>

          <div className="restaurant-details">
  <img 
    src={selectedRestaurant.image} 
    alt={selectedRestaurant.name} 
    className="restaurant-header-image"
  />
  <h2>{selectedRestaurant.name}</h2>
  <p>Кухня: {selectedRestaurant.cuisine}</p>
</div>
          <div className="products-list">
            {selectedRestaurant.products.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">{product.price.toFixed(2)} лв.</p>
                <button
                  onClick={() =>
                    onAddToCart({
                      ...product,
                      restaurantId: selectedRestaurant.id,
                    })
                  }
                >
                  Добави в кошницата
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;