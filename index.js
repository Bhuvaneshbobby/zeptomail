import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

// Load env variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS setup for your Zoho Sites domain
app.use(cors({
  origin: "https://www.genztechguru.co.in",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// Handle preflight OPTIONS request
app.options("*", cors());

// Parse JSON bodies
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("ZeptoMail webhook server is running!");
});

// Webhook endpoint
app.post("/webhook", async (req, res) => {
  const { email, name } = req.body;

  // Debug logging
  console.log("📩 Incoming request:", req.body);

  try {
    const response = await axios.post("https://api.zeptomail.in/v1.1/email", {
      mailagent_id: process.env.ZEPTO_MAILAGENT_ID, // Make sure this is set in Render
      from: {
        address: process.env.ZEPTO_FROM_EMAIL,       // Also set in .env
        name: "Tribal trials",
      },
      to: [
        {
          email_address: {
            address: email,
            name: name || "User",
          },
        },
      ],
      subject: "Welcome onboard!",
      htmlbody: `<h1>Hi ${name || "there"}!</h1><p>Thanks for signing up.</p>`,
    }, {
      headers: {
        Authorization: `Zoho-enczapikey ${process.env.ZEPTO_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Email sent via ZeptoMail:", response.data);
    res.status(200).send("Email sent successfully!");
  } catch (err) {
    console.error("❌ ZeptoMail Error:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Error Message:", err.message);
    }
    res.status(500).send("Error sending email.");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));

