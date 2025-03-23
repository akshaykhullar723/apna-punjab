import Category from "@models/category";
import { NextResponse } from "next/server";
import dbConnect from "src/app/config/db";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, description, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }

    const newCategory = new Category({ name, description, isActive });
    await newCategory.save();

    return NextResponse.json(
      { message: "Category added successfully", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating category", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({});
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching categories", error: error.message },
      { status: 500 }
    );
  }
}
