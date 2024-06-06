const { Schema, model } = require("mongoose");

const serviceSchema = new Schema(
  {
    providerName: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    serviceType: {
      type: String,
      required: [true, "Service is required."],
      enum: ["Babysitter", "Petsitter", "Salon", "Food", "Other"],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price must be a positive number."],
    },
    location: {
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
    contact: {
      phone: {
        type: String,
        required: [true, "Phone is required."],
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        match: [
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Please fill a valid email address",
        ],
      },
      socialMedia: {
        type: String,
        trim: true,
        match: [
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
          "Please enter a valid URL",
        ],
      },
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },

  {
    timestamps: true,
  }
);

const Service = model("Service", serviceSchema);

module.exports = Service;
