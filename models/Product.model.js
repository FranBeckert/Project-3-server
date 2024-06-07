const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Name of the product is required."],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      enum: [
        "Hair Products",
        "Skin Care",
        "Cleaning Supplies",
        "Food",
        "Electronics",
        "Clothing",
        "Other",
      ],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price must be a positive number."],
    },
    location: {
      storeName: {
        type: String,
        required: [true, "Location is required."],
        trim: true,
      },
      address: {
        type: String,
        required: [true, "Location is required."],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required."],
        trim: true,
      },
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },

  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);

module.exports = Product;
