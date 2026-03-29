require("dotenv").config();

const express = require('express');
const path = require("path");

//banco de dados
const conexao = require("./database/db");

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//html
app.use(express.static(path.join(__dirname, "template")));

//rotas para o CRUD
const userRoutes = require("./routes/userRoutes");
app.use(userRoutes);


// Inicializa o banco de dados
conexao.connect((err) => {
  if(err) {
    throw new Error(err);
  }
  console.log("Banco de dados rodando");
});

app.get("/", (req, res) => {
  res.send("API on");
});

//iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}. Acesse http://localhost:${PORT}/`);
});

