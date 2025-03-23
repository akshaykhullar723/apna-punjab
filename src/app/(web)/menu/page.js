"use client";
import React, { useEffect, useState } from "react";

import { useCart } from "../CartLayout";
import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";
import { set } from "mongoose";

const Page = () => {
  const [dishes, setDishes] = useState([]);

  const { location, setLocation } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch("/api/categories/dishes");
        const data = await response.json();
        setDishes(data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    fetchDishes();
  }, []);

  return (
    <div className="w-full bg-black/80  p-4">
      {location === null ? (
        <div className="flex flex-col items-center justify-center h-screen gap-5">
          <h1 className="text-2xl font-bold text-white mb-4">
            Please select a location
          </h1>
          <Button onClick={() => setLocation("Carte - La Courneuve")}>
            Carte - La Courneuve
          </Button>
          <Button onClick={() => setLocation("Carte - PARIS 13")}>
            Carte - PARIS 13
          </Button>
        </div>
      ) : (
        <>
          {dishes.map((category) => (
            <Category key={category._id} category={category} />
          ))}
          <button onClick={() => router.push("/cart")}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default Page;

const Category = ({ category }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-white">{category.name}</h2>
      <div className="grid grid-cols-3 gap-4">
        {category.dishes.map((dish) => (
          <Dish key={dish._id} dish={dish} />
        ))}
      </div>
    </div>
  );
};

const Dish = ({ dish }) => {
  const [quantity, setQuantity] = useState(0);
  const { addToCart, location } = useCart();
  const { cart } = useCart();

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 1));

  const handleAddToCart = () => {
    console.log(dish, "dish");
    addToCart(dish, quantity);
  };

  return (
    <div className="p-4 border rounded-lg bg-white text-black">
      <h3 className="text-lg font-semibold">{dish.name}</h3>
      <p className="text-sm text-gray-700">{dish.description}</p>
      {dish?.priceOptions.map((option) => (
        <p key={option._id} className="text-md font-bold mt-2">
          {option.quantity} pcs - $
          {location === "Carte - La Courneuve" ? option.price : option.pricev2}
        </p>
      ))}

      <div className="flex items-center gap-2 mt-3">
        <Button onClick={decrement} disabled={quantity === 0}>
          -
        </Button>
        <span className="px-3">{quantity}</span>
        <Button onClick={increment}>+</Button>
      </div>
      <Button
        onClick={handleAddToCart}
        className="mt-3 w-full"
        disabled={!dish.isActive}
      >
        Add to Cart
      </Button>
    </div>
  );
};
