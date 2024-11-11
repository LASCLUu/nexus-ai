const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const app = express();
app.use(express.json());
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
  })
);

app.get("/hello-world", (req, res) => {
  try {
    res.send("Hello World!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/api/pergunte-ao-gemini", async (req, res) => {
  try {a
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const { prompt } = req.body;

    console.log(prompt);
    const result = await model.generateContent(prompt);
    res.json({ completion: result.response.text() });
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
