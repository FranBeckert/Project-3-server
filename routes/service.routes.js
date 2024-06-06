const express = require("express");
const router = express.Router();
const Service = require("../models/Service.model");

// Post - Creates a new service
router.post("/", async (request, response) => {
  try {
    console.log(request.body);
    if (!request.body.providerName) {
      return response.status(400).send({
        message: "providerName is required!",
      });
    }
    if (!request.body.serviceType) {
      return response.status(400).send({
        message: "serviceType is required!",
      });
    }
    if (!request.body.description) {
      return response.status(400).send({
        message: "description is required!",
      });
    }
    if (!request.body.price) {
      return response.status(400).send({
        message: "price is required!",
      });
    }
    if (!request.body.location.address) {
      return response.status(400).send({
        message: "address is required!",
      });
    }
    if (!request.body.location.city) {
      return response.status(400).send({
        message: "city is required!",
      });
    }
    if (!request.body.contact.phone) {
      return response.status(400).send({
        message: "phone is required!",
      });
    }
    if (!request.body.contact.email) {
      return response.status(400).send({
        message: "email is required!",
      });
    }
    if (!request.body.contact.socialMedia) {
      return response.status(400).send({
        message: "socialMedia is required!",
      });
    }
    if (!request.body.likes) {
      return response.status(400).send({
        message: "likes is required!",
      });
    }

    const newService = {
      providerName: request.body.providerName,
      serviceType: request.body.serviceType,
      description: request.body.description,
      price: request.body.price,
      location: {
        address: request.body.location.address,
        city: request.body.location.city,
      },
      contact: {
        phone: request.body.contact.phone,
        email: request.body.contact.email,
        socialMedia: request.body.contact.socialMedia,
      },
      likes: request.body.likes,
    };

    const service = await Service.create(newService);
    console.log(service);

    return response.status(201).send(service);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});



// TODO 

// // Get - Returns all the places
// router.get("/", async (request, response) => {
//   try {
//     const services = await Service.find({});

//     return response.status(200).json({
//       count: services.length,
//       data: services,
//     });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// // Get - Returns the specified service
// router.get("/:id", async (request, response) => {
//   try {
//     const { id } = request.params;
//     const service = await Service.findById(id);

//     return response.status(200).json(service);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// // Put - Edits/Updates the specified service
// router.put("/:id", async (request, response) => {
//   try {
//     if (!request.body.productName) {
//         return response.status(400).send({
//           message: "productName is required!",
//         });
//       }
//       if (!request.body.category) {
//         return response.status(400).send({
//           message: "category is required!",
//         });
//       }
//       if (!request.body.brand) {
//         return response.status(400).send({
//           message: "brand is required!",
//         });
//       }
//       if (!request.body.description) {
//         return response.status(400).send({
//           message: "description is required!",
//         });
//       }
//       if (!request.body.price) {
//         return response.status(400).send({
//           message: "price is required!",
//         });
//       }
//       if (!request.body.location.address) {
//         return response.status(400).send({
//           message: "address is required!",
//         });
//       }
//       if (!request.body.location.city) {
//         return response.status(400).send({
//           message: "website is required!",
//         });
//       }
//       if (!request.body.likes) {
//         return response.status(400).send({
//           message: "likes is required!",
//         });
//       }

//     const { id } = request.params;
//     const result = await Service.findByIdAndUpdate(id, request.body);

//     if (!result) {
//       return response.status(404).json({ message: "service not found" });
//     }

//     return response.status(200).send({ message: "service updated successfully" });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// // Delete - Deletes the specified service
// router.delete("/:id", async (request, response) => {
//   try {
//     const { id } = request.params;

//     const result = await Service.findByIdAndDelete(id);

//     if (!result) {
//       return response.status(404).json({ message: "service not found" });
//     }

//     return response.status(200).send({ message: "service deleted successfully" });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

module.exports = router;
