/**
 * ZORDON — Hook: useEngineRealtime
 *
 * Escuta eventos WebSocket da engine e expõe:
 *   - connected       : boolean
 *   - lastEvent       : { tipo, payload, ts }
 *   - engineStatus    : { total, impacto_total, criticos, timestamp }
 *   - score           : ScoreData | null
 *   - alertasCriticos : array de alertas recentes
 *   - statusUpdates   : array de { id, status }
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { conectarSocket, desconectarSocket, getSocket } from "../services/socket.js";

const MAX_ALERTAS = 10;

export default function useEngineRealtime() {
  const [connected,      setConnected]      = useState(false);
  const [lastEvent,      setLastEvent]      = useState(null);
  const [engineStatus,   setEngineStatus]   = useState(null);
  const [score,          setScore]          = useState(null);
  const [alertasCriticos, setAlertasCriticos] = useState([]);
  const [statusUpdates,  setStatusUpdates]  = useState([]);

  const registrado = useRef(false);

  const registrarEvento = useCallback((tipo, payload) => {
    setLastEvent({ tipo, payload, ts: Date.now() });
  }, []);

  useEffect(() => {
    if (registrado.current) return;
    registrado.current = true;

    const socket = conectarSocket();

    socket.on("connect", () => {
      setConnected(true);
      console.log("[WS] Conectado ao ZORDON");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("[WS] Desconectado");
    });

    socket.on("engine:executado", (payload) => {
      setEngineStatus(payload);
      registrarEvento("engine:executado", payload);
    });

    socket.on("engine:score", (payload) => {
      setScore(payload);
      registrarEvento("engine:score", payload);
    });

    socket.on("decisao:critica", (payload) => {
      setAlertasCriticos((prev) => [payload, ...prev].slice(0, MAX_ALERTAS));
      registrarEvento("decisao:critica", payload);
    });

    socket.on("status:atualizado", (payload) => {
      setStatusUpdates((prev) => [payload, ...prev].slice(0, 20));
      registrarEvento("status:atualizado", payload);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("engine:executado");
      socket.off("engine:score");
      socket.off("decisao:critica");
      socket.off("status:atualizado");
      registrado.current = false;
    };
  }, [registrarEvento]);

  const limparAlertas = useCallback(() => setAlertasCriticos([]), []);

  return {
    connected,
    lastEvent,
    engineStatus,
    score,
    alertasCriticos,
    statusUpdates,
    limparAlertas,
  };
}
