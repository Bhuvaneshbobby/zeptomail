import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

// Load env variables
dotenv.config();

// Initialize the app first
const app = express();

// Apply middleware after app is initialized
app.use(cors());
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const { email, name } = req.body;

  try {
    await axios.post("https://api.zeptomail.in/v1.1/email", {
      from: {
        address: process.env.ZEPTO_FROM_EMAIL,
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

    res.send("Email sent successfully!");
  } catch (err) {
  console.error("ZeptoMail Error:");
  if (err.response) {
    console.error("Status:", err.response.status);
    console.error("Headers:", err.response.headers);
    console.error("Data:", err.response.data);
  } else {
    console.error("Error Message:", err.message);
  }
  res.status(500).send("Error sending email.");
}
});

app.get("/", (req, res) => {
  res.send("ZeptoMail webhook server is running!");
});

app.listen(3000, () => console.log("Server started on port 3000"));




//Backend works
  
