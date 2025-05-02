import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
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
    console.error(err.response?.data || err.message);
    res.status(500).send("Error sending email.");
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));

app.get("/", (req, res) => {
    res.send("ZeptoMail webhook server is running!");
  });
  
