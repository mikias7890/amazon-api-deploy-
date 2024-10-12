// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_KEY);
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Basic logger using console.log
app.get("/", (req, res) => {
  console.log("GET / endpoint hit");
  res.status(200).json({
    message: "success!",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = Number(req.query.total); // Parse total as a number

  if (total > 0) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total, // The amount is in the smallest currency unit (e.g., cents for USD)
        currency: "usd",
      });

      // Return the created payment intent's client secret
      res.status(202).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      // Log the error and send a 500 response
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Payment creation failed", error });
    }
  } else {
    res.status(403).json({ message: "Total must be greater than 0" });
  }
});

// Start the server on port 4000
app.listen(5000, (err) => {
  if (err) throw err;
  console.log("Server is running on http://localhost:5000");
});
