const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
    },

    dateOfBirth: {
      type: Date,
      default:null,
    },

    neighborhood: {
      type: String,
      default:null,
    },

    interests: [String],

    favoritePlaces: [{ type: Schema.Types.ObjectId, ref: "Place" }],
    favoriteServices: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    favoritesProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
