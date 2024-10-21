const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/hello-world", (req, res) => {
  try {
    res.send("Hello World!");
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
