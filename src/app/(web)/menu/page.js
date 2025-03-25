"use client";
import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { useCart } from "../CartLayout";
import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";
import { set } from "mongoose";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";

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
    <div className="w-full bg-white  p-6">
      <h1 className="text-4xl font-bold text-black mb-4 text-center">Menu</h1>
      {location === null ? (
        <div className="flex flex-col items-center justify-center h-screen gap-5 ">
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
        <div className="px-20">
          {dishes.map((category) => (
            <Category key={category._id} category={category} />
          ))}
          <Button
            onClick={() => router.push("/cart")}
            className="fixed bottom-5 right-5"
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;

const Category = ({ category }) => {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-semibold text-black">{category.name}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mt-4">
        {category.dishes.map((dish) => (
          <Dish key={dish._id} dish={dish} />
        ))}
      </div>
    </div>
  );
};

const Dish = ({ dish }) => {
  const [quantity, setQuantity] = useState(0);
  const { addToCart, location, cart } = useCart(); // Use only one useCart()
  const [selectedOption, setSelectedOption] = useState(null);
  const [price, setPrice] = useState(null);
  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0)); // Fix decrement logic

  const handleAddToCart = () => {
    console.log(dish, "dish");
    addToCart(
      {
        _id: dish._id,
        name: dish.name,
        option: selectedOption,
        // price: selectedOption.split(" - ").pop().replace("$", ""),
        price,
      },
      quantity
    );
    toast.success("Item added to cart");
  };

  return (
    <div className="p-4 border rounded-lg bg-white text-black w-64">
      <h2 className="text-lg font-semibold">{dish.name}</h2>
      <p className="text-sm text-gray-700">{dish.description}</p>

      <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
        {dish?.priceOptions.map((option) => (
          <div
            key={option._id}
            className="flex items-center space-x-2"
            onClick={() =>
              setPrice(
                location === "Carte - La Courneuve"
                  ? option.price
                  : option.pricev2
              )
            }
          >
            <RadioGroupItem
              value={`${option.quantity}pc - $${
                location === "Carte - La Courneuve"
                  ? option.price
                  : option.pricev2
              }`}
              id={`${option.quantity}-{location === "Carte - La Courneuve"
                ? option.price
                : option.pricev2}`}
            />
            <Label htmlFor={`radio-${option._id}`}>
              {option.quantity} pcs - $
              {location === "Carte - La Courneuve"
                ? option.price
                : option.pricev2}
            </Label>
          </div>
        ))}
      </RadioGroup>

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

// const Dish = ({ dish }) => {
//   const [quantity, setQuantity] = useState(0);
//   const { addToCart, location } = useCart();

//   const { cart } = useCart();

//   const increment = () => setQuantity((prev) => prev + 1);
//   const decrement = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 1));

//   const handleAddToCart = () => {
//     console.log(dish, "dish");
//     addToCart(dish, quantity);
//   };

//   return (
//     <div className="p-4 border rounded-lg bg-white text-black w-48">
//       <h3 className="text-lg font-semibold">{dish.name}</h3>
//       <p className="text-sm text-gray-700">{dish.description}</p>
//       {dish?.priceOptions.map((option) => {
//         return (
//           <p key={option._id} className="text-md font-bold mt-2">
//             {option.quantity} pcs - $
//             {location === "Carte - La Courneuve"
//               ? option.price
//               : option.pricev2}
//           </p>
//         );
//       })}
//       <RadioGroup defaultValue="comfortable">
//         {dish?.priceOptions.map((option) => {
//           return (
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="default" id="r1" />
//               <Label htmlFor="r1">
//                 {option.quantity} pcs - ${" "}
//                 {location === "Carte - La Courneuve"
//                   ? option.price
//                   : option.pricev2}
//               </Label>
//             </div>
//           );
//         })}
//       </RadioGroup>
//       <div className="flex items-center gap-2 mt-3">
//         <Button onClick={decrement} disabled={quantity === 0}>
//           -
//         </Button>
//         <span className="px-3">{quantity}</span>
//         <Button onClick={increment}>+</Button>
//       </div>
//       <Button
//         onClick={handleAddToCart}
//         className="mt-3 w-full"
//         disabled={!dish.isActive}
//       >
//         Add to Cart
//       </Button>
//     </div>
//   );
// };
