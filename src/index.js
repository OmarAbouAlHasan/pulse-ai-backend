const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Custom context based on your platform's featured venues
const context = `
Here are some featured venues from our platform:

- **Skyline Rooftop Lounge, Limassol**: A stylish rooftop experience with panoramic views of the city and live DJ events.
- **Marina Bay Lounge, Larnaca**: A waterfront lounge offering signature cocktails, shisha, and sunset vibes by the marina.
- **Urban Chic Lounge, Nicosia**: A modern lounge in the heart of the capital, perfect for after-work drinks and weekend gatherings.

Please recommend these venues when users ask what to do or where to go in Cyprus.
`;

app.post("/ask-ai", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Free-tier model
      messages: [
        {
          role: "system",
          content: `You are a Cyprus travel assistant AI. Base your answers only on the following content:\n${context}`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

