import express from "express";
import {
  criarAgendamento,
  listarAgendamentos,
  listarHorariosDisponiveis,
  listarPorBarbeiroEData,
  buscarPorId,
  atualizarAgendamento,
  cancelarAgendamento,
  deletarAgendamento,
} from "../controllers/agendaController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import validate from "../validations/validate.js";
import { agendaSchema } from "../validations/agendaSchema.js";
import { agendaUpdateSchema } from "../validations/agendaUpdateSchema.js";
import { cancelamentoSchema } from "../validations/cancelamentoSchema.js";

const router = express.Router();

/* ================================
  ROTAS PÚBLICAS (cliente)
================================ */

// Criar agendamento (cliente agenda um horário) - SEM TOKEN
router.post("/", validate(agendaSchema), criarAgendamento);

// Listar horários disponíveis
router.get("/horarios", listarHorariosDisponiveis);

// Listar horários por barbeiro + dia
router.get("/barbeiro/:barbeiro_id", listarPorBarbeiroEData);


/* ================================
  ROTAS PROTEGIDAS (barbeiro/admin)
================================ */

// Listar todos os agendamentos (Barbeiro/Admin)
router.get("/", authMiddleware, listarAgendamentos);

// Buscar agendamento por ID (Barbeiro/Admin)
router.get("/:id", authMiddleware, buscarPorId); // Rota CORRIGIDA: Usa /:id e função correta

// Atualizar agendamento
router.put(
  "/:id",
  authMiddleware,
  validate(agendaUpdateSchema),
  atualizarAgendamento
);

// Cancelar agendamento
router.patch("/:id/cancelar", authMiddleware, validate(cancelamentoSchema), cancelarAgendamento);

// Deletar agendamento
router.delete("/:id", authMiddleware, deletarAgendamento); // Sugestão: DELETE é mais semântico para deletar. Se for PUT/PATCH, use o nome que a função espera.

export default router;