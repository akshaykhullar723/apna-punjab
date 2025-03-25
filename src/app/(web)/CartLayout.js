"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

// Create Context
const CartContext = createContext();

// Cart Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [location, setLocation] = useState(null);

  // Load cart from localStorage on first render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Add item to cart (Update quantity if exists)
  const addToCart = (item, quantity) => {
    console.log(item, "item");
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem._id === item._id && cartItem.option === item.option
      );
      console.log(existingItem, "existingItem");
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id && cartItem.option === item.option
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      return [...prevCart, { ...item, quantity }];
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        location,
        setLocation,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook for using CartContext
export const useCart = () => useContext(CartContext);
