import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars -- falso positivo do eslint 9.39: não rastreia motion.div/motion.img como uso
import { AnimatePresence, motion } from "framer-motion";

const SLIDE_DURATION = 7000; // ms — troca automática

/**
 * Painel esquerdo das telas de autenticação (Login/Register):
 * carrossel de imagens com zoom automático (Ken Burns) + crossfade,
 * cabeçalho/texto sobrepostos que trocam junto com o slide.
 *
 * slides: [{ src, heading, text, features? }]
 */
export default function AuthCarouselPanel({ slides }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(iv);
  }, [slides.length]);

  const current = slides[slide];

  return (
    <div className="hidden md:flex" style={{ width: "46%", position: "relative", overflow: "hidden" }}>
      {/* Carrossel de imagens — cada slide se move sozinho (Ken Burns) e cruza em fade com o próximo */}
      <AnimatePresence>
        <motion.img
          key={current.src}
          src={current.src}
          alt=""
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.08 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.4, ease: "easeInOut" },
            scale:   { duration: SLIDE_DURATION / 1000 + 1.4, ease: "linear" },
          }}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
          }}
        />
      </AnimatePresence>

      {/* Overlay escuro para legibilidade do texto sobre a foto */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.3) 45%, rgba(15,23,42,0.75) 100%)",
      }} />

      {/* Conteúdo sobreposto */}
      <div style={{
        position: "relative", zIndex: 1, width: "100%",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "48px",
      }}>
        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/logo.png" alt="ZORDON" style={{ width: "44px", height: "44px", borderRadius: "12px", objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))" }} />
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.06em" }}>ZORDON</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Intelligence Platform</div>
          </div>
        </div>

        {/* HEADLINE — troca junto com o slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <h2 style={{ fontSize: "clamp(24px,2.8vw,34px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
              {current.heading}
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, maxWidth: "380px" }}>
              {current.text}
            </p>

            {current.features && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                {current.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#38BDFF", boxShadow: "0 0 6px rgba(56,189,255,0.8)", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* INDICADORES DO CARROSSEL */}
        <div style={{ display: "flex", gap: "6px", position: "absolute", bottom: "12px", left: 0 }}>
          {slides.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === slide ? "18px" : "6px", height: "6px", borderRadius: "3px",
                background: i === slide ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                transition: "all 0.5s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
