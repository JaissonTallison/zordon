/**
 * ZORDON — Socket.io Service
 * WebSocket com rooms isoladas por tenant (empresa_id).
 *
 * Eventos emitidos:
 *   engine:executado   — após engine rodar com sucesso
 *   engine:score       — novo score operacional calculado
 *   decisao:critica    — alerta de decisão com prioridade CRITICA
 *   status:atualizado  — quando status de decisão muda
 */

import { Server } from "socket.io";

let io = null;

// ─────────────────────────────────────────────────────────
// INICIALIZAR Socket.io com servidor HTTP
// ─────────────────────────────────────────────────────────
export function inicializarSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    path: "/ws",
  });

  io.on("connection", (socket) => {
    const empresaId = socket.handshake.auth?.empresa_id
      || socket.handshake.query?.empresa_id;

    if (!empresaId) {
      console.warn("[Socket] Conexão sem empresa_id rejeitada");
      socket.disconnect(true);
      return;
    }

    const room = `empresa:${empresaId}`;
    socket.join(room);

    console.log(`[Socket] ✓ Cliente conectado — empresa ${empresaId} (${socket.id})`);

    socket.on("disconnect", () => {
      console.log(`[Socket] Cliente desconectado — ${socket.id}`);
    });

    // Ping/pong para keepalive
    socket.on("ping", () => socket.emit("pong", { ts: Date.now() }));
  });

  console.log("[Socket] Servidor WebSocket iniciado em /ws");
  return io;
}

// ─────────────────────────────────────────────────────────
// EMITIR para todos os clientes de uma empresa
// ─────────────────────────────────────────────────────────
export function emitirParaEmpresa(empresaId, evento, payload) {
  if (!io) return;
  io.to(`empresa:${empresaId}`).emit(evento, payload);
}

// ─────────────────────────────────────────────────────────
// EVENTOS ESPECÍFICOS
// ─────────────────────────────────────────────────────────

/**
 * Notifica após engine rodar
 */
export function emitirEngineExecutado(empresaId, { total, impacto_total, criticos }) {
  emitirParaEmpresa(empresaId, "engine:executado", {
    total,
    impacto_total,
    criticos,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Notifica novo score operacional
 */
export function emitirScore(empresaId, scoreData) {
  emitirParaEmpresa(empresaId, "engine:score", {
    ...scoreData,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Alerta crítico para decisão de prioridade CRITICA
 */
export function emitirAlertaCritico(empresaId, decisao) {
  emitirParaEmpresa(empresaId, "decisao:critica", {
    id:           decisao.id,
    codigo:       decisao.codigo,
    produto_nome: decisao.produto_nome,
    impacto_valor: decisao.impacto_valor,
    descricao:    decisao.descricao,
    timestamp:    new Date().toISOString(),
  });
}

/**
 * Notifica mudança de status de uma decisão
 */
export function emitirStatusAtualizado(empresaId, { id, status }) {
  emitirParaEmpresa(empresaId, "status:atualizado", {
    id,
    status,
    timestamp: new Date().toISOString(),
  });
}

export function getIO() {
  return io;
}
