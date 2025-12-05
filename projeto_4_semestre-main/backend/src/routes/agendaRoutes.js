import express from "express";
import {
  criarAgendamento,
  listarAgendamentos,
  listarHorariosDisponiveis,
  listarPorBarbeiroEData,
  buscarPorId, // Importado para a rota GET /:id
  atualizarAgendamento,
  cancelarAgendamento,
  deletarAgendamento, // Mantido caso uses essa função
} from "../controllers/agendaController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import validate from "../validations/validate.js";
import { agendaSchema } from "../validations/agendaSchema.js";
import { agendaUpdateSchema } from "../validations/agendaUpdateSchema.js";
import { cancelamentoSchema } from "../validations/cancelamentoSchema.js";

const router = express.Router();

/* ================================
  ROTAS PÚBLICAS (cliente) - SEM TOKEN
================================ */

// Criar agendamento (POST /api/agenda)
router.post("/", validate(agendaSchema), criarAgendamento);

// Listar todos os agendamentos (GET /api/agenda)
router.get("/", listarAgendamentos);

// Listar horários disponíveis (GET /api/agenda/horarios)
router.get("/horarios", listarHorariosDisponiveis);

// Listar horários por barbeiro + dia (GET /api/agenda/barbeiro/:barbeiro_id)
router.get("/barbeiro/:barbeiro_id", listarPorBarbeiroEData);

// Buscar agendamento por ID (GET /api/agenda/:id) - CORRIGIDA!
router.get("/:id", buscarPorId);


/* ================================
  ROTAS PROTEGIDAS (barbeiro/admin) - COM TOKEN
================================ */

// Atualizar agendamento (PUT /api/agenda/:id)
router.put(
  "/:id",
  authMiddleware,
  validate(agendaUpdateSchema),
  atualizarAgendamento
);

// Cancelar agendamento (PATCH /api/agenda/:id/cancelar)
router.patch("/:id/cancelar", authMiddleware, validate(cancelamentoSchema), cancelarAgendamento);

// Deletar agendamento (DELETE /api/agenda/:id) - Se existir
router.delete("/:id", authMiddleware, deletarAgendamento); 


export default router;