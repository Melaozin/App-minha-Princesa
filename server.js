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

// Torna o diretório 'meus-livros' acessível para acessar arquivos PDF diretamente
app.use("/meus-livros", express.static(path.join(__dirname, "meus-livros")));

// Verifica se o diretório 'meus-livros' existe e cria se não existir
const livrosDir = path.join(__dirname, "meus-livros");
if (!fs.existsSync(livrosDir)) {
  fs.mkdirSync(livrosDir);
}

// Renderizar os arquivos
// Página inicial
app.get("/", (req, res) => {
  res.render("index");
});

// Meus livros
app.get("/meus-livros", (req, res) => {
  res.render("main");
});

// Rota para baixar o PDF
app.get("/download", async (req, res) => {
  const { downloadUrl, fileName } = req.query;
  const pdfFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;

  try {
    const response = await axios.get(downloadUrl, { responseType: "stream" });
    const filePath = path.join(livrosDir, pdfFileName);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);
    writer.on("finish", () => {
      res.download(filePath, pdfFileName, (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo:", err);
          res.sendStatus(500);
        }
      });
    });
    writer.on("error", (err) => {
      console.error("Erro ao salvar o arquivo:", err);
      res.sendStatus(500);
    });
  } catch (error) {
    console.error("Erro ao baixar o PDF:", error);
    res.sendStatus(500);
  }
});

// Rota para listar os livros salvos com URL de acesso
app.get("/saved-books", (req, res) => {
  const savedBooksDir = path.join(__dirname, "meus-livros");

  fs.readdir(savedBooksDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar livros salvos" });
    }

    const filesInfo = files.map((file) => ({
      fileName: file,
      downloadUrl: `/meus-livros/${file}`,
    }));

    res.json(filesInfo);
  });
});

// Outras rotas do servidor, por exemplo:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/meus-livros", (req, res) => {
  res.render("main");
});

app.get("/ler-livro", (req, res) => {
  const { fileName } = req.query;
  const filePath = path.join(__dirname, "meus-livros", fileName);

  // Verifica se o arquivo existe antes de enviá-lo
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("Arquivo não encontrado");
    }

    // Define o tipo de conteúdo como PDF para visualização no navegador
    res.contentType("application/pdf");
    res.sendFile(filePath);
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
