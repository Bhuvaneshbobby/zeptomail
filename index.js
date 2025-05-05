import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://www.genztechguru.co.in",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.options("*", cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZeptoMail webhook server is running!");
});

app.post("/webhook", async (req, res) => {
  const { email, name } = req.body;
  console.log("📩 Incoming request:", req.body);

  try {
    const response = await axios.post("https://api.zeptomail.in/v1.1/email", {
#      mailagent_id: process.env.ZEPTO_MAILAGENT_ID,
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

    console.log("✅ Email sent:", response.data);
    res.status(200).send("Email sent successfully!");
  } catch (err) {
    console.error("❌ ZeptoMail Error:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
      res.status(500).send(JSON.stringify(err.response.data));
    } else {
      console.error("Error Message:", err.message);
      res.status(500).send("Internal Server Error");
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


