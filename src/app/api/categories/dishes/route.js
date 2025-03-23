import { NextResponse } from "next/server";
import dbConnect from "src/app/config/db";
import Category from "src/models/category";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, description, priceOptions, isActive, categoryId } = body;
    console.log(priceOptions, "priceOptions");
    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }
    if (
      !name ||
      !priceOptions ||
      !Array.isArray(priceOptions) ||
      priceOptions.length === 0
    ) {
      return NextResponse.json(
        { message: "Dish name and valid price options are required" },
        { status: 400 }
      );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Validate price options structure
    for (const option of priceOptions) {
      if (!option.price ) {
        return NextResponse.json(
          {
            message: "Each price option must have quantity, price, and pricev2",
          },
          { status: 400 }
        );
      }
    }

    const newDish = { name, description, isActive, priceOptions };
    console.log(newDish, "newDish");
    category.dishes.push(newDish); // Add dish to the category
    await category.save();

    return NextResponse.json(
      { message: "Dish added successfully", category },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding dish", error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const categories = await Category.find({}).populate("dishes");
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching categories", error: error.message },
      { status: 500 }
    );
  }
}
