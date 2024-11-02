// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para servir arquivos estáticos
app.use(express.static("public"));

// Renderizar os arquivos
// Página inicial
app.get("/", (req, res) => {
  res.render("index");
});

// Meus livros
app.get("/meus-livros", (req, res) => {
  res.render("main");
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
