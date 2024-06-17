const express = require("express");
const router = express.Router();
const Message = require("../models/Message.model.js");

// Post - Creates a new message
router.post("/", async (request, response) => {
  try {
    console.log(request.body);

    if (!request.body.receiver) {
      return response.status(400).send({
        message: "Receiver is required!",
      });
    }
    if (!request.body.message) {
      return response.status(400).send({
        message: "Message is required!",
      });
    }

    const newMessage = {
      sender: request.payload._id,
      receiver: request.body.receiver,
      message: request.body.message,
    };

    const message = await Message.create(newMessage);

    return response.status(201).send(message);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get - Return all the messages
router.get("/", async (request, response) => {
  try {
    const userId = request.payload._id;
    console.log (userId)
    // show only message which are either received or sent by the current login user
    const messages = await Message.find({
      $or: [{sender: userId}, {receiver: userId}]
    });

    return response.status(200).json({
      data: messages,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});



// // Put - Edits/Updates an specific message
// router.put("/:id", async (request, response) => {
//   try {
//     if (!request.body.sender) {
//       return response.status(400).send({
//         message: "Sender is required!",
//       });
//     }
//     if (!request.body.receiver) {
//       return response.status(400).send({
//         message: "Receiver is required!",
//       });
//     }
//     if (!request.body.message) {
//       return response.status(400).send({
//         message: "Message is required!",
//       });
//     }

//     const { id } = request.params;
//     const result = await Message.findByIdAndUpdate(id, request.body);

//     if (!result) {
//       return response.status(404).json({ message: "Message not found" });
//     }

//     return response
//       .status(200)
//       .send({ message: "Message updated successfully" });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// // Delete - Deletes an specific message
// router.delete("/:id", async (request, response) => {
//   try {
//     const { id } = request.params;

//     const result = await Message.findByIdAndDelete(id);

//     if (!result) {
//       return response.status(404).json({ message: "Message not found" });
//     }

//     return response
//       .status(200)
//       .send({ message: "Message deleted successfully" });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });







// Get messages between two users
router.get('/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
