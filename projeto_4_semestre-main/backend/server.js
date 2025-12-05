import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import { connectDB } from "./src/config/db.js";
import logger from "./src/config/logger.js";
import agendaRoutes from "./src/routes/agendaRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import jwt from "jsonwebtoken";
import Agenda from "./src/models/Agenda.js"; // <-- ADICIONADO AQUI

// ==================================================
// 1) Carregar variáveis de ambiente
// ==================================================
dotenv.config();

console.log("### DEBUG JWT_SECRET =", JSON.stringify(process.env.JWT_SECRET));

// ==================================================
// 2) Conectar ao MongoDB (só uma vez!)
// ==================================================
connectDB();

// ==================================================
// 3) Iniciar app
// ==================================================
const app = express();
app.use(express.json());

// ==================================================
// 4) Segurança — CORS + Helmet
// ==================================================
app.use(cors({ origin: "*" }));
app.use(helmet());

// ==================================================
// 5) Rota para testar variáveis de ambiente
// ==================================================
app.get("/test-env", (req, res) => {
  res.json({ JWT_SECRET: process.env.JWT_SECRET });
});

// ==================================================
// NOVA ROTA: Gerar token sem login (para teste)
// ==================================================
app.get("/get-token", (req, res) => {
  try {
    const token = jwt.sign(
      { teste: "ok" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      mensagem: "Token gerado com sucesso!",
      token,
    });
  } catch (err) {
    res.status(500).json({ erro: "Falha ao gerar token", detalhes: err.message });
  }
});

// ==================================================
// NOVA ROTA: LISTAR AGENDAMENTOS DIRETO NO NAVEGADOR
// ==================================================
app.get("/agendamentos", async (req, res) => {
  try {
    const lista = await Agenda.find().sort({ data: 1, hora: 1 });

    const html = `
      <h1>Lista de Agendamentos</h1>
      <ul>
        ${lista.map(a => `
          <li>
            <strong>${a.data} ${a.hora}</strong> — 
            ${a.nome} — ${a.servico}
          </li>
        `).join("")}
      </ul>
    `;

    res.send(html);

  } catch (err) {
    res.status(500).send("Erro ao carregar agenda: " + err.message);
  }
});

// ==================================================
// 6) Rotas públicas
// ==================================================
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

app.get("/status", (req, res) => {
  res.json({
    api: "Calendário / Barbearia",
    versao: "1.0.0",
    ambiente: process.env.NODE_ENV || "development",
  });
});

// Login e Registro
app.use("/api/auth", authRoutes);

// Rotas protegidas
app.use("/api/agenda", agendaRoutes);

// Página inicial
app.get("/", (req, res) => {
  res.send("API Calendário/Barbearia rodando!");
});

// ==================================================
// Middleware Global de Erros
// ==================================================
app.use(errorHandler);

// ==================================================
// 7) Iniciar Servidor
// ==================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
  console.log(`Servidor rodando na porta ${PORT}`);
});
