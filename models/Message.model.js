const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required."],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required."],
    },
    message: {
      type: String,
      trim: true,
      required: [true, "Message is required."],
    },
  },

  {
    timestamps: true,
  }
);

const Message = model("Message", messageSchema);

module.exports = Message;
