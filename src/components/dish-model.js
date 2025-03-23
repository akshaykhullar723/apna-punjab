"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

const AddDish = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dish, setDish] = useState({
    name: "",
    description: "",
    price: "",
    pricev2: "",
    isActive: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDish((prevDish) => ({
      ...prevDish,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...dish, categoryId: selectedCategory };

    try {
      const response = await fetch("/api/categories/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Dish added:", data);
    } catch (error) {
      console.error("Error adding dish:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        console.log(data, "data");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Dish</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle>Add New Dish</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              value={dish.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={dish.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              name="price"
              value={dish.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Price (v2)</Label>
            <Input
              type="number"
              name="pricev2"
              value={dish.pricev2}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDish;
