import { useRef, useState, useEffect } from "react"
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion"
import { Stethoscope, HeartPulse, Cross, ShieldPlus, Activity, Mail } from "lucide-react"
import { guests } from "./data/guests"

// ─── Helpers ────────────────────────────────────────────────────────────────

const normalize = (v = "") =>
  v.toLowerCase()
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "")
   .replace(/\s+/g, " ")
   .trim()

const findGuest = (input) => {
  const q = normalize(input)
  if (!q) return null

  return guests.find((g) =>
    g.names.some((n) => normalize(n) === q)
  ) || null
}

const WHATSAPP = "573172812535"

// ─── Medical floating icons (background decoration) ─────────────────────────

const MedIcons = () => {
  const items = [
    { Icon: Stethoscope, x: "8%",  y: "12%", size: 28, delay: 0 },
    { Icon: HeartPulse,  x: "88%", y: "20%", size: 22, delay: 2 },
    { Icon: Cross,       x: "5%",  y: "65%", size: 18, delay: 4 },
    { Icon: ShieldPlus,  x: "91%", y: "72%", size: 24, delay: 1 },
    { Icon: Activity,    x: "50%", y: "6%",  size: 20, delay: 3 },
    { Icon: Stethoscope, x: "78%", y: "88%", size: 22, delay: 5 },
    { Icon: HeartPulse,  x: "18%", y: "85%", size: 18, delay: 2.5 },
    { Icon: Cross,       x: "62%", y: "90%", size: 16, delay: 1.5 },
  ]
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {items.map(({ Icon, x, y, size, delay }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: x, top: y }}
          animate={{ y: [0, -14, 0], opacity: [0.13, 0.22, 0.13] }}
          transition={{ duration: 7 + i, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <Icon size={size} color="#d4a92a" />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Ambient glow blobs ──────────────────────────────────────────────────────

const Glow = ({ top, left, right, bottom, color = "rgba(212,169,42,0.08)", size = 500, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      top, left, right, bottom,
      width: size, height: size,
      background: color,
      filter: `blur(${size * 0.24}px)`,
    }}
    animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay }}
  />
)

// ─── Thin gold divider ───────────────────────────────────────────────────────

const GoldLine = ({ width = 48 }) => (
  <div
    style={{
      width,
      height: 1,
      background: "linear-gradient(90deg, transparent, #d4a92a, transparent)",
      margin: "0 auto",
    }}
  />
)

function AccessScreen({ onSuccess }) {
  const [name, setName] = useState("")
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 250)
    return () => clearTimeout(t)
  }, [])

  const attempt = () => {
    const guest = findGuest(name)
    if (guest) {
      onSuccess(guest)
    } else {
      setError(true)
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
    }
  }

  return (
    <motion.div
      key="access"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45 }}
      className="relative min-h-screen flex items-center justify-center px-5 py-16 overflow-hidden"
    >
      <Glow top="-200px" left="-200px" size={560} delay={0} />
      <Glow bottom="-200px" right="-200px" size={480} delay={3} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[520px]"
      >
        <motion.div
          animate={shaking ? { x: [-8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "2.4rem",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
            padding: "3rem 2.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, transparent, #d4a92a, transparent)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(212,169,42,0.04) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
              pointerEvents: "none",
              borderRadius: "inherit",
            }}
          />

          <div className="relative text-center">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  border: "1px solid rgba(212,169,42,0.35)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(212,169,42,0.06)",
                }}
              >
                <HeartPulse size={20} color="#d4a92a" />
              </div>
            </div>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.35em",
                fontSize: "0.62rem",
                color: "#d4a92a",
                textTransform: "uppercase",
                marginBottom: "1.2rem",
              }}
            >
              Invitación privada
            </p>

            <h1
              className="font-display"
              style={{
                fontSize: "clamp(2.6rem, 6.5vw, 3.8rem)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
                color: "#f5f0e8",
                marginBottom: "0.8rem",
              }}
            >
              Una noche
              <br />
              <em style={{ fontStyle: "italic", color: "#e6c85a" }}>muy especial</em>
              <br />
              te espera.
            </h1>

            <div style={{ margin: "1.4rem 0" }}>
              <GoldLine width={56} />
            </div>

            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.92rem",
                lineHeight: 1.75,
                maxWidth: 340,
                margin: "0 auto 2rem",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Escribe tu nombre para abrir esta experiencia creada con cariño para ti.
            </p>

            <div
              style={{
                border: "1px solid rgba(212,169,42,0.2)",
                borderRadius: "1.6rem",
                background: "rgba(0,0,0,0.3)",
                padding: "6px 6px 6px 20px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Tu nombre..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(false)
                }}
                onKeyDown={(e) => e.key === "Enter" && attempt()}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#f5f0e8",
                  fontSize: "1rem",
                  fontFamily: "'DM Sans', sans-serif",
                  padding: "12px 0",
                }}
              />
              <motion.button
                onClick={attempt}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: "linear-gradient(135deg, #d4a92a, #b8891c)",
                  border: "none",
                  borderRadius: "1.2rem",
                  color: "#1a0e00",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  padding: "13px 24px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.02em",
                }}
              >
                Entrar
              </motion.button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    color: "rgba(230,180,90,0.7)",
                    fontSize: "0.85rem",
                    marginTop: "1rem",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  No encontramos ese nombre. Intenta con tu primer apellido.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, transparent, rgba(212,169,42,0.4), transparent)",
            }}
          />
        </motion.div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.8rem",
            color: "rgba(255,255,255,0.15)",
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Dra. Mariana · Medicina · 2026
        </p>
      </motion.div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — STORY  (scroll-based narrative)
// ════════════════════════════════════════════════════════════════════════════

const FadeInView = ({ children, delay = 0, y = 30 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
)

function StoryScreen({ guest, onContinue }) {
  const displayName = guest.displayName || guest.names[0]

  return (
    <motion.div
      key="story"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <Glow top="10%" right="-10%" size={500} delay={1} />
      <Glow bottom="20%" left="-10%" size={400} delay={4} />

      {/* ── Greeting ─────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "5rem 1.5rem",
          position: "relative",
        }}
      >
        <FadeInView>
          <p
            style={{
              letterSpacing: "0.35em",
              fontSize: "0.65rem",
              color: "#d4a92a",
              textTransform: "uppercase",
              marginBottom: "2rem",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Para ti, {displayName}
          </p>

          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "#f5f0e8",
              maxWidth: 800,
              margin: "0 auto 2rem",
            }}
          >
            Los sueños
            <br />
            <em style={{ fontStyle: "italic", color: "#e6c85a" }}>también</em> crecen.
          </h2>

          <div style={{ margin: "0 auto 2.5rem", width: 64 }}>
            <GoldLine width={64} />
          </div>

          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              maxWidth: 560,
              margin: "0 auto",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Quiero compartir contigo algo que ha tardado muchos años en llegar.
            Un sueño que hoy, por fin, tiene nombre y forma.
          </p>
        </FadeInView>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ marginTop: "4rem", color: "rgba(212,169,42,0.4)" }}
        >
          <Activity size={18} />
        </motion.div>
      </section>

     {/* ── Chapter 1: La niña ──────────────────────────────── */}
<section
  style={{
    maxWidth: 1100,
    margin: "0 auto",
    padding: "clamp(3rem, 6vw, 6rem) clamp(1.2rem, 4vw, 2rem)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
    gap: "clamp(2rem, 4vw, 4rem)",
    alignItems: "center",
  }}
>
  <FadeInView delay={0.1} style={{ order: 1 }}>
    <p
      style={{
        letterSpacing: "0.3em",
        fontSize: "0.62rem",
        color: "#d4a92a",
        textTransform: "uppercase",
        marginBottom: "1.2rem",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      El comienzo
    </p>
    <h3
      className="font-display"
      style={{
        fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
        fontWeight: 300,
        lineHeight: 1.12,
        color: "#f5f0e8",
        marginBottom: "1.5rem",
      }}
    >
      Todo comenzó
      <br />
      con una ilusión
    </h3>
    <p
      style={{
        color: "rgba(255,255,255,0.48)",
        fontSize: "1rem",
        lineHeight: 1.85,
        fontFamily: "'DM Sans', sans-serif",
        marginBottom: "1.5rem",
      }}
    >
      Desde pequeña soñaba con dedicar mi vida al cuidado de los demás.
      No era solo un juego — era una vocación que ya habitaba en mí
      sin que supiera todavía cómo llamarla.
    </p>
    <div
      style={{
        borderLeft: "2px solid rgba(212,169,42,0.3)",
        paddingLeft: "1.2rem",
      }}
    >
      <p
        className="font-display"
        style={{
          color: "rgba(255,255,255,0.65)",
          fontStyle: "italic",
          fontSize: "1.1rem",
          lineHeight: 1.7,
        }}
      >
        "Desde hace muchos años soñaba con este momento…"
      </p>
    </div>
  </FadeInView>

  <FadeInView delay={0.25} style={{ order: 2 }}>
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: "-20px",
          background: "radial-gradient(circle, rgba(212,169,42,0.12), transparent 70%)",
          borderRadius: "50%",
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "relative",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "2rem",
          background: "rgba(255,255,255,0.03)",
          padding: "10px",
          backdropFilter: "blur(12px)",
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}foto-nina.jpg`}
          alt="Mariana de niña"
          style={{
            width: "100%",
            borderRadius: "1.6rem",
            objectFit: "cover",
            objectPosition: "center 22%",
            maxHeight: "clamp(260px, 45vw, 520px)",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: "1.6rem",
            background: "linear-gradient(to top, rgba(3,3,3,0.3) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  </FadeInView>
</section>
{/* ── Chapter 2: La doctora ────────────────────────────── */}
<section
  style={{
    maxWidth: 1100,
    margin: "0 auto",
    padding: "clamp(3rem, 6vw, 6rem) clamp(1.2rem, 4vw, 2rem)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
    gap: "clamp(2rem, 4vw, 4rem)",
    alignItems: "center",
  }}
>
  {/* TEXTO PRIMERO en JSX para que en mobile salga arriba */}
  <FadeInView delay={0.05}>
    <p
      style={{
        letterSpacing: "0.3em",
        fontSize: "0.62rem",
        color: "#d4a92a",
        textTransform: "uppercase",
        marginBottom: "1.2rem",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      Hoy
    </p>
    <h3
      className="font-display"
      style={{
        fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
        fontWeight: 300,
        lineHeight: 1.12,
        color: "#f5f0e8",
        marginBottom: "1.5rem",
      }}
    >
      El esfuerzo
      <br />
      siempre florece
    </h3>
    <p
      style={{
        color: "rgba(255,255,255,0.48)",
        fontSize: "1rem",
        lineHeight: 1.9,
        fontFamily: "'DM Sans', sans-serif",
        marginBottom: "1.4rem",
      }}
    >
      Han sido años de entrega, aprendizaje y esfuerzo.
      Madrugadas, exámenes, sacrificios y también momentos de duda.
      Pero incluso en los días más difíciles, dentro de mí seguía viva
      la certeza de que todo esto tenía un propósito.
    </p>
    <p
      style={{
        color: "rgba(255,255,255,0.48)",
        fontSize: "1rem",
        lineHeight: 1.9,
        fontFamily: "'DM Sans', sans-serif",
        marginBottom: "2rem",
      }}
    >
      Y hoy, cuando siento que ya estoy a punto de cumplir este sueño,
      quiero detenerme un momento, mirar hacia atrás y celebrar
      este camino con las personas que han sido especiales para mí.
    </p>

    <div
      style={{
        border: "1px solid rgba(212,169,42,0.2)",
        borderRadius: "1.6rem",
        background: "rgba(212,169,42,0.04)",
        padding: "1.5rem 1.8rem",
      }}
    >
      <p
        className="font-display"
        style={{
          color: "rgba(255,255,255,0.75)",
          fontStyle: "italic",
          fontSize: "1.15rem",
          lineHeight: 1.75,
        }}
      >
        "Ya estoy a punto de cumplir este sueño,
        y no quiero vivir este momento sin compartirlo
        con personas que han sido importantes para mí."
      </p>
      <p
        style={{
          marginTop: "1rem",
          color: "#d4a92a",
          fontSize: "0.8rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        — Dra Mariana
      </p>
    </div>
  </FadeInView>

  {/* FOTO DESPUÉS en JSX → en mobile sale debajo del texto ✓ */}
  <FadeInView delay={0.15}>
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: "-20px",
          background: "radial-gradient(circle, rgba(212,169,42,0.12), transparent 70%)",
          borderRadius: "50%",
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "relative",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "2rem",
          background: "rgba(255,255,255,0.03)",
          padding: "10px",
          backdropFilter: "blur(12px)",
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}foto-doctora.jpg`}
          alt="Mariana doctora"
          style={{
            width: "100%",
            borderRadius: "1.6rem",
            objectFit: "cover",
            objectPosition: "center 18%",
            maxHeight: "clamp(260px, 45vw, 520px)",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: "1.6rem",
            background: "linear-gradient(to top, rgba(3,3,3,0.3) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  </FadeInView>
</section>
      {/* ── CTA ─────────────────────────────────────────────── */}
      <section
        style={{
          padding: "4rem 1.5rem 8rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        <FadeInView>
          <p
            style={{
              color: "rgba(255,255,255,0.38)",
              fontSize: "0.9rem",
              marginBottom: "2.5rem",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.7,
            }}
          >
            Quiero cerrar esta etapa rodeada de personas importantes para mí.
            <br />
            Y tú eres una de ellas.
          </p>

          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "linear-gradient(135deg, #d4a92a, #b8891c)",
              border: "none",
              borderRadius: "1.4rem",
              color: "#1a0e00",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: "0.95rem",
              letterSpacing: "0.04em",
              padding: "1.1rem 2.4rem",
              cursor: "pointer",
              boxShadow: "0 0 40px rgba(212,169,42,0.18)",
            }}
          >
            <HeartPulse size={18} />
            Ver mi invitación
          </motion.button>
        </FadeInView>
      </section>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — INVITATION
// ════════════════════════════════════════════════════════════════════════════

function InviteScreen({ guest }) {
  const displayName = guest.displayName || guest.names[0]
const isPairInvite = displayName.includes(" y ")
const inviteValidityText = isPairInvite
  ? "Esta invitación es válida para dos personas."
  : "Esta invitación es válida para una persona."
const confirmText = isPairInvite
  ? `Hola Dra Mariana, somos ${displayName}. Sí, ahí estaremos acompañándote en esta cena tan especial para celebrar tu logro.`
  : `Hola Dra Mariana, soy ${displayName}. Sí, ahí estaré acompañándote en esta cena tan especial para celebrar tu logro.`

const declineText = isPairInvite
  ? `Hola Dra Mariana, somos ${displayName}. Muchas gracias por tu invitación. En esta ocasión no podremos acompañarte en la cena de celebración.`
  : `Hola Dra Mariana, soy ${displayName}. Muchas gracias por tu invitación. En esta ocasión no podré acompañarte en la cena de celebración.`

const confirmMsg = encodeURIComponent(confirmText)
const declineMsg = encodeURIComponent(declineText)

const confirmLink = `https://wa.me/${WHATSAPP}?text=${confirmMsg}`
const declineLink = `https://wa.me/${WHATSAPP}?text=${declineMsg}`

const details = [
  { label: "Fecha", value: "Viernes 19 de junio" },
  { label: "Hora", value: "7:00 PM" },
  { label: "Lugar", value: "Rilette, al frente del Batallón" },
  {
    label: "Lluvia de sobres",
    value: (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.55rem",
          flexWrap: "wrap",
        }}
      >
        <Mail size={18} strokeWidth={1.8} color="#d4a92a" />
      </span>
    ),
  },
  {
    label: "Validez",
    value: inviteValidityText,
  },
]

  return (
    <motion.div
      key="invite"
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem",
        position: "relative",
      }}
    >
 

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 720,
        }}
      >
        {/* Header seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              border: "1px solid rgba(212,169,42,0.35)",
              borderRadius: "50%",
              background: "rgba(212,169,42,0.06)",
              marginBottom: "1.2rem",
            }}
          >
            <Stethoscope size={24} color="#d4a92a" />
          </div>
          <p
            style={{
              letterSpacing: "0.35em",
              fontSize: "0.62rem",
              color: "#d4a92a",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cena de celebración · Medicina · 2026
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "2.4rem",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(16px)",
WebkitBackdropFilter: "blur(16px)",
boxShadow: "0 24px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Inner shimmer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(212,169,42,0.05), transparent 50%)",
              pointerEvents: "none",
            }}
          />

          {/* Gold top bar */}
          <div
            style={{
              height: 2,
              background: "linear-gradient(90deg, transparent, #d4a92a, transparent)",
            }}
          />

          <div style={{ padding: "clamp(2rem, 5vw, 3.5rem)" }}>
            {/* Guest name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              style={{ marginBottom: "0.5rem" }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: "0.5rem",
                }}
              >
                Para
              </p>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(2.6rem, 7vw, 4.5rem)",
                  fontWeight: 300,
                  color: "#f5f0e8",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                }}
              >
                {displayName}
              </h2>
            </motion.div>

            {/* Gold divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              style={{
                height: 1,
                background: "linear-gradient(90deg, #d4a92a, transparent)",
                margin: "1.5rem 0 2rem",
                transformOrigin: "left",
              }}
            />

            {/* Personal message */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "1.05rem",
                lineHeight: 1.85,
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: "2.5rem",
              }}
            >
              {guest.message}
            </motion.p>
          <motion.div
  initial={{ opacity: 0, y: 18, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ delay: 0.82, duration: 0.8 }}
  style={{
    marginBottom: "2.2rem",
    position: "relative",
  }}
>
  <div
    style={{
      position: "absolute",
      inset: "-18px",
      background: "radial-gradient(circle, rgba(212,169,42,0.12), transparent 72%)",
      borderRadius: "50%",
      filter: "blur(14px)"
    }}
  />
  <div
    style={{
      position: "relative",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "1.8rem",
      background: "rgba(255,255,255,0.03)",
      padding: "10px",
      backdropFilter: "blur(6px)",
      overflow: "hidden",
    }}
  >
    <img
      src={`${import.meta.env.BASE_URL}foto-invitacion.jpg`}
      alt="Mariana doctora"
      style={{
        width: "100%",
        borderRadius: "1.4rem",
        objectFit: "cover",
        objectPosition: "center 18%",
        maxHeight: 420,
        display: "block",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 10,
        borderRadius: "1.4rem",
        background: "linear-gradient(to top, rgba(3,3,3,0.34) 0%, transparent 55%)",
        pointerEvents: "none",
      }}
    />
  </div>
</motion.div>
            {/* Event details */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.92, duration: 0.7 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              {details.map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "1.4rem",
                    background: "rgba(0,0,0,0.2)",
                    padding: "1.2rem 1.4rem",
                  }}
                >
                  <p
                    style={{
                      color: "#d4a92a",
                      fontSize: "0.6rem",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      fontFamily: "'DM Sans', sans-serif",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    className="font-display"
                    style={{
                      color: "#f5f0e8",
                      fontSize: "1.15rem",
                      fontWeight: 400,
                      lineHeight: 1.35,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Mariana quote */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.02, duration: 0.7 }}
              style={{
                border: "1px solid rgba(212,169,42,0.18)",
                borderRadius: "1.6rem",
                background: "linear-gradient(135deg, rgba(212,169,42,0.05), rgba(255,255,255,0.02))",
                padding: "1.8rem 2rem",
                marginBottom: "2rem",
              }}
            >
              <p
                className="font-display"
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  marginBottom: "1rem",
                }}
              >
                "He preparado esta noche con muchísimo cariño,
porque este momento significa tanto para mí como
las personas con quienes quiero compartirlo.
Me haría muy feliz contar con tu presencia."
              </p>
              <p
                style={{
                  color: "#d4a92a",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                — Dra Mariana
              </p>
            </motion.div>

            {/* WhatsApp buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.12, duration: 0.7 }}
              style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
            >
              <a
                href={confirmLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  background: "linear-gradient(135deg, #d4a92a, #b8891c)",
                  border: "none",
                  borderRadius: "1.2rem",
                  color: "#1a0e00",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  letterSpacing: "0.03em",
                  padding: "1.1rem 2rem",
                  textDecoration: "none",
                  transition: "filter 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "")}
              >
                <HeartPulse size={18} />
                Síii, ahí estaré ✨
              </a>

              <a
                href={declineLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "1.2rem",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.9rem",
                  padding: "1rem 2rem",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.03)",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)"
                }}
              >
                No podré asistir
              </a>
            </motion.div>
          </div>

          {/* Gold bottom bar */}
          <div
            style={{
              height: 2,
              background: "linear-gradient(90deg, transparent, #d4a92a, transparent)",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [step, setStep] = useState("access")  // access | story | invite
  const [guest, setGuest] = useState(null)
  const [flash, setFlash] = useState(false)
  const audioRef = useRef(null)
useEffect(() => {
  const handleVisibilityChange = () => {
    if (!audioRef.current) return

    if (document.hidden) {
      audioRef.current.pause()
   } else {
  return
}
  }

  const handleBeforeUnload = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }

  document.addEventListener("visibilitychange", handleVisibilityChange)
  window.addEventListener("beforeunload", handleBeforeUnload)

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange)
    window.removeEventListener("beforeunload", handleBeforeUnload)
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }
}, [step])
  const handleAccess = (foundGuest) => {
    setGuest(foundGuest)

    if (audioRef.current) {
      audioRef.current.volume = 0.45
      audioRef.current.play().catch(() => {})
    }

    setFlash(true)
    setTimeout(() => {
      setFlash(false)
      setStep("story")
      window.scrollTo({ top: 0, behavior: "instant" })
    }, 700)
  }

const handleContinue = () => {
  setStep("invite")
  window.scrollTo({ top: 0, behavior: "instant" })
}

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030303",
        color: "#fff",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <audio ref={audioRef} loop preload="metadata">
        <source src={`${import.meta.env.BASE_URL}music.mp3`} type="audio/mpeg" />
      </audio>

      <MedIcons />

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "radial-gradient(ellipse at center, rgba(30,20,5,0.97) 0%, #030303 100%)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === "access" && (
          <AccessScreen key="access" onSuccess={handleAccess} />
        )}
        {step === "story" && guest && (
          <StoryScreen key="story" guest={guest} onContinue={handleContinue} />
        )}
        {step === "invite" && guest && (
          <InviteScreen key="invite" guest={guest} />
        )}
      </AnimatePresence>
    </div>
  )
} 
