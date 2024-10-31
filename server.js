// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static("public"));

// Rota para baixar o PDF
app.get("/download", async (req, res) => {
  const { downloadUrl, fileName } = req.query;

  try {
    const response = await axios.get(downloadUrl, { responseType: "stream" });
    const filePath = path.join(__dirname, "public", "saved-books", fileName);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);
    writer.on("finish", () => res.sendStatus(200));
    writer.on("error", () => res.sendStatus(500));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Rota para listar os livros salvos
app.get("/saved-books", (req, res) => {
  const savedBooksDir = path.join(__dirname, "public", "downloads");

  fs.readdir(savedBooksDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar livros salvos" });
    }
    res.json(files);
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
