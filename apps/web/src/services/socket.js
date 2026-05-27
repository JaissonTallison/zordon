/**
 * ZORDON — WebSocket client (singleton)
 * Conecta ao servidor Socket.io com autenticação por empresa_id.
 */

import { io } from "socket.io-client";

let socket = null;

export function getSocket() {
  if (socket) return socket;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const empresa_id = user.empresa_id;

  socket = io("http://localhost:3333", {
    path:              "/ws",
    autoConnect:       false,
    reconnection:      true,
    reconnectionDelay: 2000,
    auth:              { empresa_id },
    query:             { empresa_id },
  });

  return socket;
}

export function conectarSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}

export function desconectarSocket() {
  if (socket && socket.connected) {
    socket.disconnect();
    socket = null;
  }
}
