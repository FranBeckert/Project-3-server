const { Schema, model } = require("mongoose");

const placeSchema = new Schema(
  {
    placeName: {
      type: String,
      required: [true, "Name of the place is required."],
      trim: true,
    },
    placeType: {
      type: String,
      required: [true, "Type of place is required."],
      enum: ["Restaurant", "Supermarket", "Doctor", "Veterinarian", "Dentist", "Other"],
    },
    speciality: {
      type: String,
      required: function () {
        return this.placeType === "Doctor" || this.placeType === "Veterinarian" || this.placeType === "Dentist";
      },
      trim: true,
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
      website: {
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

const Place = model("Place", placeSchema);

module.exports = Place;
