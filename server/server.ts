import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mysql from "mysql2";
import isDev from "./isDev";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_BASE,
});

type Data = {
  id?: string;
  nome: string;
  raca: string;
  peso: string;
  data_nascimento: string;
};

const app = express();
app.use(express.json());
app.use(cors());

if (isDev) {
  app.use(helmet());
  app.use(compression());
}

// Buscar todos os gatos
app.get("/api/gatos", (req, res) => {
  let query = "SELECT * FROM gato";
  db.query(query, (err: Error, result: Data) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    }

    res.status(200).json(result);
  });
});

// Buscar um gato pelo ID
app.get("/api/gatos/:id", (req, res) => {
  const { id } = req.params;

  let query = "SELECT * FROM gato WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    }

    res.status(200).json(result);
  });
});

// Inserir um gato
app.post("/api/gatos", (req, res) => {
  const { nome, raca, peso, data_nascimento } = req.body;

  let query = "INSERT INTO gato (nome, raca, peso, data_nascimento) VALUES (?, ?, ?, ?)";
  db.query(query, [nome, raca, peso, data_nascimento], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    }
    res.status(200).json(result);
  });
});

// Atualizar um gato
app.put("/api/gatos", (req, res) => {
  const { id, nome, raca, peso, data_nascimento } = req.body;

  let query = "UPDATE gato SET nome = ?, raca = ?, peso = ?, data_nascimento = ? WHERE id = ?";
  db.query(query, [id, nome, raca, peso, data_nascimento], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    }
    res.status(200).json(result);
  });
});

// Deletar um gato
app.delete("/api/gatos/:id", (req, res) => {
  const { id } = req.params;

  let query = "DELETE FROM gato WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    }
    res.status(200).json(result);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}!`);
});