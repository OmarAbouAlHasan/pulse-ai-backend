
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/ask-ai", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful Cyprus travel guide AI. Suggest things to do, events, and venues based on user requests. Your replies should be short and easy to understand.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const aiReply = completion.data.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Error from OpenAI:", error.response?.data || error.message);
    res.status(500).json({ reply: "Sorry, I couldn't process that right now." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("AI backend is running on port", PORT);
});
