import { useRef, useState, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Stethoscope, HeartPulse, Cross, ShieldPlus, Activity, Mail, Plus, Pencil, Trash2, X, Check, LogOut } from "lucide-react"
import { supabase } from "./supabase"

// ─── Helpers ────────────────────────────────────────────────────────────────

const normalize = (v = "") =>
  v.toLowerCase()
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "")
   .replace(/\s+/g, " ")
   .trim()

const findGuest = (input, guestList) => {
  const q = normalize(input)
  if (!q) return null
  return guestList.find((g) => g.names.some((n) => normalize(n) === q)) || null
}

const WHATSAPP = "573172812535"
const BASE = import.meta.env.BASE_URL
const ADMIN_PASSWORD = "mariana2026"

// ─── Transiciones ────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1]
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

// ─── Gold divider ─────────────────────────────────────────────────────────────

const GoldLine = ({ width = 48 }) => (
  <div style={{
    width, height: 1, margin: "0 auto",
    background: "linear-gradient(90deg, transparent, #d4a92a, transparent)",
  }} />
)

// ─── Floating medical icons ───────────────────────────────────────────────────

const MED_ICONS = [
  { Icon: Stethoscope, x: "8%",  y: "12%", size: 28, delay: 0 },
  { Icon: HeartPulse,  x: "88%", y: "20%", size: 22, delay: 2 },
  { Icon: Cross,       x: "5%",  y: "65%", size: 18, delay: 4 },
  { Icon: ShieldPlus,  x: "91%", y: "72%", size: 24, delay: 1 },
  { Icon: Activity,    x: "50%", y: "6%",  size: 20, delay: 3 },
  { Icon: Stethoscope, x: "78%", y: "88%", size: 22, delay: 5 },
  { Icon: HeartPulse,  x: "18%", y: "85%", size: 18, delay: 2.5 },
  { Icon: Cross,       x: "62%", y: "90%", size: 16, delay: 1.5 },
]

const MedIcons = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 800)
    return () => clearTimeout(t)
  }, [])
  if (!mounted) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {MED_ICONS.map(({ Icon, x, y, size, delay }, i) => (
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

// ─── FadeInView ───────────────────────────────────────────────────────────────

const FadeInView = ({ children, delay = 0 }) => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-60px" }}
    variants={fadeUp}
    transition={{ duration: 0.8, ease: EASE, delay }}
  >
    {children}
  </motion.div>
)

// ─── Estilos base ─────────────────────────────────────────────────────────────

const S = {
  card: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "2.4rem",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
    padding: "3rem 2.5rem",
    position: "relative",
    overflow: "hidden",
  },
  goldBarTop: {
    position: "absolute", top: 0, left: 0, right: 0, height: 2,
    background: "linear-gradient(90deg, transparent, #d4a92a, transparent)",
  },
  goldBarBottom: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
    background: "linear-gradient(90deg, transparent, rgba(212,169,42,0.4), transparent)",
  },
  overline: {
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.35em",
    fontSize: "0.62rem",
    color: "#d4a92a",
    textTransform: "uppercase",
    marginBottom: "1.2rem",
  },
  muted: {
    color: "rgba(255,255,255,0.48)",
    fontSize: "1rem",
    lineHeight: 1.85,
    fontFamily: "'DM Sans', sans-serif",
  },
  goldBtn: {
    display: "inline-flex",
    alignItems: "center",
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
    cursor: "pointer",
    textDecoration: "none",
    transition: "filter 0.2s",
  },
  photoFrame: {
    position: "relative",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "2rem",
    background: "rgba(255,255,255,0.03)",
    padding: "10px",
    backdropFilter: "blur(12px)",
  },
  photoOverlay: {
    position: "absolute",
    inset: 10,
    borderRadius: "1.6rem",
    background: "linear-gradient(to top, rgba(3,3,3,0.3) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  photo: {
    width: "100%",
    borderRadius: "1.6rem",
    objectFit: "cover",
    maxHeight: "clamp(260px, 45vw, 520px)",
    display: "block",
  },
  input: {
    width: "100%",
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(212,169,42,0.2)",
    borderRadius: "0.8rem",
    color: "#f5f0e8",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
    padding: "0.75rem 1rem",
    outline: "none",
  },
  label: {
    display: "block",
    color: "#d4a92a",
    fontSize: "0.65rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: "0.4rem",
  },
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ════════════════════════════════════════════════════════════════════════════

function AdminPanel({ onLogout }) {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [form, setForm] = useState({ names: "", display_name: "", message: "" })

  const fetchGuests = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from("guests").select("*").order("created_at", { ascending: true })
    setGuests(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchGuests() }, [fetchGuests])

  const openNew = () => {
    setEditing(null)
    setForm({ names: "", display_name: "", message: "" })
    setShowForm(true)
  }

  const openEdit = (g) => {
    setEditing(g.id)
    setForm({ names: g.names.join(", "), display_name: g.display_name, message: g.message })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.display_name.trim() || !form.names.trim()) return
    setSaving(true)
    const payload = {
      names: form.names.split(",").map(n => n.trim()).filter(Boolean),
      display_name: form.display_name.trim(),
      message: form.message.trim(),
    }
    if (editing) {
      await supabase.from("guests").update(payload).eq("id", editing)
    } else {
      await supabase.from("guests").insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    fetchGuests()
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este invitado?")) return
    setDeletingId(id)
    await supabase.from("guests").delete().eq("id", id)
    setDeletingId(null)
    fetchGuests()
  }

  return (
    <div style={{
      minHeight: "100vh", padding: "2rem 1.5rem",
      maxWidth: 860, margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem" }}>
        <div>
          <p style={S.overline}>Panel de administración</p>
          <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 300, color: "#f5f0e8" }}>
            Invitados
          </h1>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <motion.button
            onClick={openNew}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ ...S.goldBtn, padding: "0.75rem 1.4rem", fontSize: "0.85rem" }}
          >
            <Plus size={16} /> Nuevo invitado
          </motion.button>
          <button
            onClick={onLogout}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2rem",
              color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem", padding: "0.75rem 1.2rem", background: "none", cursor: "pointer",
            }}
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      <GoldLine width={80} />

      {/* Lista */}
      <div style={{ marginTop: "2rem" }}>
        {loading ? (
          <p style={{ ...S.muted, textAlign: "center", padding: "3rem 0" }}>Cargando invitados…</p>
        ) : guests.length === 0 ? (
          <p style={{ ...S.muted, textAlign: "center", padding: "3rem 0" }}>No hay invitados aún.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {guests.map((g) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "1.2rem",
                  background: "rgba(255,255,255,0.03)",
                  padding: "1.2rem 1.5rem",
                  display: "flex", alignItems: "center", gap: "1rem",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#f5f0e8", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginBottom: "0.2rem" }}>
                    {g.display_name}
                  </p>
                  <p style={{ color: "rgba(212,169,42,0.7)", fontSize: "0.75rem", fontFamily: "'DM Sans', sans-serif", marginBottom: "0.3rem" }}>
                    Nombres: {g.names.join(", ")}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {g.message}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <button
                    onClick={() => openEdit(g)}
                    style={{
                      width: 36, height: 36, borderRadius: "0.6rem",
                      border: "1px solid rgba(212,169,42,0.25)",
                      background: "rgba(212,169,42,0.06)",
                      color: "#d4a92a", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(g.id)}
                    disabled={deletingId === g.id}
                    style={{
                      width: 36, height: 36, borderRadius: "0.6rem",
                      border: "1px solid rgba(255,80,80,0.2)",
                      background: "rgba(255,80,80,0.05)",
                      color: "rgba(255,100,100,0.7)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal formulario */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              style={{
                ...S.card,
                width: "100%", maxWidth: 520,
                padding: "2rem",
              }}
            >
              <div style={S.goldBarTop} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h2 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 300, color: "#f5f0e8" }}>
                  {editing ? "Editar invitado" : "Nuevo invitado"}
                </h2>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div>
                  <label style={S.label}>Nombre para mostrar</label>
                  <input
                    style={S.input}
                    placeholder="Ej: Ana y Kevin"
                    value={form.display_name}
                    onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={S.label}>Nombres de búsqueda (separados por coma)</label>
                  <input
                    style={S.input}
                    placeholder="Ej: Ana, Kevin, Ana García"
                    value={form.names}
                    onChange={e => setForm(f => ({ ...f, names: e.target.value }))}
                  />
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", fontFamily: "'DM Sans', sans-serif", marginTop: "0.4rem" }}>
                    El invitado puede buscar cualquiera de estos nombres.
                  </p>
                </div>
                <div>
                  <label style={S.label}>Mensaje personalizado</label>
                  <textarea
                    style={{ ...S.input, minHeight: 90, resize: "vertical" }}
                    placeholder="Mensaje de bienvenida para este invitado..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                </div>

                <motion.button
                  onClick={handleSave}
                  disabled={saving}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ ...S.goldBtn, justifyContent: "center", opacity: saving ? 0.7 : 1 }}
                >
                  <Check size={16} />
                  {saving ? "Guardando…" : editing ? "Guardar cambios" : "Agregar invitado"}
                </motion.button>
              </div>
              <div style={S.goldBarBottom} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN LOGIN
// ════════════════════════════════════════════════════════════════════════════

function AdminLogin({ onSuccess }) {
  const [pass, setPass] = useState("")
  const [error, setError] = useState(false)

  const attempt = () => {
    if (pass === ADMIN_PASSWORD) {
      onSuccess()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "2rem",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ ...S.card, width: "100%", maxWidth: 400, textAlign: "center" }}
      >
        <div style={S.goldBarTop} />
        <p style={S.overline}>Acceso restringido</p>
        <h2 className="font-display" style={{ fontSize: "2rem", fontWeight: 300, color: "#f5f0e8", marginBottom: "2rem" }}>
          Panel Admin
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <input
            type="password"
            placeholder="Contraseña…"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            style={S.input}
          />
          <motion.button
            onClick={attempt}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ ...S.goldBtn, justifyContent: "center" }}
          >
            Entrar
          </motion.button>
          {error && (
            <p style={{ color: "rgba(230,100,100,0.8)", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
              Contraseña incorrecta.
            </p>
          )}
        </div>
        <div style={S.goldBarBottom} />
      </motion.div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — ACCESS
// ════════════════════════════════════════════════════════════════════════════

function AccessScreen({ onSuccess, guests }) {
  const [name, setName] = useState("")
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 250)
    return () => clearTimeout(t)
  }, [])

  const attempt = useCallback(() => {
    const guest = findGuest(name, guests)
    if (guest) {
      onSuccess(guest)
    } else {
      setError(true)
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
    }
  }, [name, guests, onSuccess])

  return (
    <motion.div
      key="access"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen flex items-center justify-center px-5 py-16 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative z-10 w-full max-w-[520px]"
      >
        <motion.div
          animate={shaking ? { x: [-8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          style={{ ...S.card }}
        >
          <div style={S.goldBarTop} />
          <div style={{
            position: "absolute", inset: 0, borderRadius: "inherit",
            background: "linear-gradient(135deg, rgba(212,169,42,0.04) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
            pointerEvents: "none",
          }} />

          <div className="relative text-center">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
              <div style={{
                width: 52, height: 52,
                border: "1px solid rgba(212,169,42,0.35)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(212,169,42,0.06)",
              }}>
                <HeartPulse size={20} color="#d4a92a" />
              </div>
            </div>

            <p style={S.overline}>Invitación privada</p>

            <h1 className="font-display" style={{
              fontSize: "clamp(2.6rem, 6.5vw, 3.8rem)",
              fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.01em",
              color: "#f5f0e8", marginBottom: "0.8rem",
            }}>
              Una noche<br />
              <em style={{ fontStyle: "italic", color: "#e6c85a" }}>muy especial</em><br />
              te espera.
            </h1>

            <div style={{ margin: "1.4rem 0" }}>
              <GoldLine width={56} />
            </div>

            <p style={{
              color: "rgba(255,255,255,0.4)", fontSize: "0.92rem", lineHeight: 1.75,
              maxWidth: 340, margin: "0 auto 2rem",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Escribe tu nombre para abrir esta experiencia creada con cariño para ti.
            </p>

            <div style={{
              border: "1px solid rgba(212,169,42,0.2)",
              borderRadius: "1.6rem",
              background: "rgba(0,0,0,0.3)",
              padding: "6px 6px 6px 20px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Tu nombre..."
                value={name}
                onChange={(e) => { setName(e.target.value); setError(false) }}
                onKeyDown={(e) => e.key === "Enter" && attempt()}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "#f5f0e8", fontSize: "1rem",
                  fontFamily: "'DM Sans', sans-serif", padding: "12px 0",
                }}
              />
              <motion.button
                onClick={attempt}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: "linear-gradient(135deg, #d4a92a, #b8891c)",
                  border: "none", borderRadius: "1.2rem",
                  color: "#1a0e00", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500, fontSize: "0.9rem",
                  padding: "13px 24px", cursor: "pointer",
                  whiteSpace: "nowrap", letterSpacing: "0.02em",
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
                    color: "rgba(230,180,90,0.7)", fontSize: "0.85rem",
                    marginTop: "1rem", fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  No encontramos ese nombre. Intenta con tu primer apellido.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={S.goldBarBottom} />
        </motion.div>

        <p style={{
          textAlign: "center", marginTop: "1.8rem",
          color: "rgba(255,255,255,0.15)", fontSize: "0.68rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Dra. Mariana · Medicina · 2026
        </p>
      </motion.div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — STORY
// ════════════════════════════════════════════════════════════════════════════

function StoryScreen({ guest, onContinue }) {
  const displayName = guest.display_name || guest.names[0]

  return (
    <motion.div
      key="story"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="relative"
    >
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "5rem 1.5rem", position: "relative",
      }}>
        <FadeInView>
          <p style={S.overline}>Para ti, {displayName}</p>
          <h2 className="font-display" style={{
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            fontWeight: 300, lineHeight: 1.05,
            color: "#f5f0e8", maxWidth: 800, margin: "0 auto 2rem",
          }}>
            Los sueños<br />
            <em style={{ fontStyle: "italic", color: "#e6c85a" }}>también</em> crecen.
          </h2>
          <div style={{ margin: "0 auto 2.5rem", width: 64 }}>
            <GoldLine width={64} />
          </div>
          <p style={{ ...S.muted, maxWidth: 560, margin: "0 auto" }}>
            Quiero compartir contigo algo que ha tardado muchos años en llegar.
            Un sueño que hoy, por fin, tiene nombre y forma.
          </p>
        </FadeInView>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ marginTop: "4rem", color: "rgba(212,169,42,0.4)" }}
        >
          <Activity size={18} />
        </motion.div>
      </section>

      <section style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "clamp(3rem, 6vw, 6rem) clamp(1.2rem, 4vw, 2rem)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
        gap: "clamp(2rem, 4vw, 4rem)", alignItems: "center",
      }}>
        <FadeInView delay={0.1}>
          <p style={S.overline}>El comienzo</p>
          <h3 className="font-display" style={{
            fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
            fontWeight: 300, lineHeight: 1.12,
            color: "#f5f0e8", marginBottom: "1.5rem",
          }}>
            Todo comenzó<br />con una ilusión
          </h3>
          <p style={{ ...S.muted, marginBottom: "1.5rem" }}>
            Desde pequeña soñaba con dedicar mi vida al cuidado de los demás.
            No era solo un juego — era una vocación que ya habitaba en mí
            sin que supiera todavía cómo llamarla.
          </p>
          <div style={{ borderLeft: "2px solid rgba(212,169,42,0.3)", paddingLeft: "1.2rem" }}>
            <p className="font-display" style={{
              color: "rgba(255,255,255,0.65)",
              fontStyle: "italic", fontSize: "1.1rem", lineHeight: 1.7,
            }}>
              "Desde hace muchos años soñaba con este momento…"
            </p>
          </div>
        </FadeInView>

        <FadeInView delay={0.25}>
          <div style={S.photoFrame}>
            <img src={`${BASE}foto-nina.jpg`} alt="Mariana de niña" loading="lazy" style={{ ...S.photo, objectPosition: "center 22%" }} />
            <div style={S.photoOverlay} />
          </div>
        </FadeInView>
      </section>

      <section style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "clamp(3rem, 6vw, 6rem) clamp(1.2rem, 4vw, 2rem)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
        gap: "clamp(2rem, 4vw, 4rem)", alignItems: "center",
      }}>
        <FadeInView delay={0.05}>
          <p style={S.overline}>Hoy</p>
          <h3 className="font-display" style={{
            fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
            fontWeight: 300, lineHeight: 1.12,
            color: "#f5f0e8", marginBottom: "1.5rem",
          }}>
            El esfuerzo<br />siempre florece
          </h3>
          <p style={{ ...S.muted, marginBottom: "1.4rem" }}>
            Han sido años de entrega, aprendizaje y esfuerzo.
            Madrugadas, exámenes, sacrificios y también momentos de duda.
            Pero incluso en los días más difíciles, dentro de mí seguía viva
            la certeza de que todo esto tenía un propósito.
          </p>
          <p style={{ ...S.muted, marginBottom: "2rem" }}>
            Y hoy, cuando siento que ya estoy a punto de cumplir este sueño,
            quiero detenerme un momento, mirar hacia atrás y celebrar
            este camino con las personas que han sido especiales para mí.
          </p>
          <div style={{
            border: "1px solid rgba(212,169,42,0.2)",
            borderRadius: "1.6rem",
            background: "rgba(212,169,42,0.04)",
            padding: "1.5rem 1.8rem",
          }}>
            <p className="font-display" style={{
              color: "rgba(255,255,255,0.75)",
              fontStyle: "italic", fontSize: "1.15rem", lineHeight: 1.75,
            }}>
              "Ya estoy a punto de cumplir este sueño,
              y no quiero vivir este momento sin compartirlo
              con personas que han sido importantes para mí."
            </p>
            <p style={{
              marginTop: "1rem", color: "#d4a92a",
              fontSize: "0.8rem", letterSpacing: "0.15em",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
            }}>
              — Dra Mariana
            </p>
          </div>
        </FadeInView>

        <FadeInView delay={0.15}>
          <div style={S.photoFrame}>
            <img src={`${BASE}foto-doctora.jpg`} alt="Mariana doctora" loading="lazy" style={{ ...S.photo, objectPosition: "center 18%" }} />
            <div style={S.photoOverlay} />
          </div>
        </FadeInView>
      </section>

      <section style={{ padding: "4rem 1.5rem 8rem", textAlign: "center", position: "relative" }}>
        <FadeInView>
          <p style={{
            color: "rgba(255,255,255,0.38)", fontSize: "0.9rem",
            marginBottom: "2.5rem", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7,
          }}>
            Quiero cerrar esta etapa rodeada de personas importantes para mí.
            <br />Y tú eres una de ellas.
          </p>
          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{ ...S.goldBtn, boxShadow: "0 0 40px rgba(212,169,42,0.18)", padding: "1.1rem 2.4rem", fontSize: "0.95rem" }}
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
  const displayName = guest.display_name || guest.names[0]
  const isPair = displayName.includes(" y ")

  const confirmText = isPair
    ? `Hola Dra Mariana, somos ${displayName}. Sí, ahí estaremos acompañándote en esta cena tan especial para celebrar tu logro.`
    : `Hola Dra Mariana, soy ${displayName}. Sí, ahí estaré acompañándote en esta cena tan especial para celebrar tu logro.`

  const declineText = isPair
    ? `Hola Dra Mariana, somos ${displayName}. Muchas gracias por tu invitación. En esta ocasión no podremos acompañarte en la cena de celebración.`
    : `Hola Dra Mariana, soy ${displayName}. Muchas gracias por tu invitación. En esta ocasión no podré acompañarte en la cena de celebración.`

  const confirmLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(confirmText)}`
  const declineLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(declineText)}`

  const details = [
    { label: "Fecha", value: "Viernes 19 de junio" },
    { label: "Hora", value: "7:00 PM" },
    { label: "Lugar", value: "Rilette, al frente del Batallón" },
    { label: "Lluvia de sobres", value: <span style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem" }}><Mail size={18} strokeWidth={1.8} color="#d4a92a" /></span> },
    { label: "Validez", value: isPair ? "Invitación para dos personas." : "Invitación para una persona." },
  ]

  return (
    <motion.div
      key="invite"
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "4rem 1.5rem", position: "relative",
      }}
    >
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 720 }}>

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 64, height: 64,
            border: "1px solid rgba(212,169,42,0.35)",
            borderRadius: "50%",
            background: "rgba(212,169,42,0.06)",
            marginBottom: "1.2rem",
          }}>
            <Stethoscope size={24} color="#d4a92a" />
          </div>
          <p style={{ ...S.overline, marginBottom: 0 }}>
            Cena de celebración · Medicina · 2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "2.4rem",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
            overflow: "hidden", position: "relative",
          }}
        >
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(135deg, rgba(212,169,42,0.05), transparent 50%)",
          }} />
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #d4a92a, transparent)" }} />

          <div style={{ padding: "clamp(2rem, 5vw, 3.5rem)" }}>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              style={{ marginBottom: "0.5rem" }}
            >
              <p style={{
                color: "rgba(255,255,255,0.35)", fontSize: "0.8rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif", marginBottom: "0.5rem",
              }}>
                Para
              </p>
              <h2 className="font-display" style={{
                fontSize: "clamp(2.6rem, 7vw, 4.5rem)",
                fontWeight: 300, color: "#f5f0e8",
                lineHeight: 1.05, letterSpacing: "-0.01em",
              }}>
                {displayName}
              </h2>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                height: 1, background: "linear-gradient(90deg, #d4a92a, transparent)",
                margin: "1.5rem 0 2rem", transformOrigin: "left",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{ ...S.muted, color: "rgba(255,255,255,0.6)", marginBottom: "2.5rem" }}
            >
              {guest.message}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78, duration: 0.7 }}
              style={{ marginBottom: "2.2rem", position: "relative" }}
            >
              <div style={{
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "1.8rem",
                background: "rgba(255,255,255,0.03)",
                padding: "10px", overflow: "hidden",
              }}>
                <img
                  src={`${BASE}foto-invitacion.jpg`}
                  alt="Cena de celebración"
                  loading="lazy"
                  style={{
                    width: "100%", borderRadius: "1.4rem",
                    objectFit: "cover", objectPosition: "center 18%",
                    maxHeight: 420, display: "block",
                  }}
                />
                <div style={{
                  position: "absolute", inset: 10, borderRadius: "1.4rem",
                  background: "linear-gradient(to top, rgba(3,3,3,0.34) 0%, transparent 55%)",
                  pointerEvents: "none",
                }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88, duration: 0.6 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "1rem", marginBottom: "2.5rem",
              }}
            >
              {details.map(({ label, value }) => (
                <div key={label} style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "1.4rem",
                  background: "rgba(0,0,0,0.2)",
                  padding: "1.2rem 1.4rem",
                }}>
                  <p style={{
                    color: "#d4a92a", fontSize: "0.6rem",
                    letterSpacing: "0.28em", textTransform: "uppercase",
                    fontFamily: "'DM Sans', sans-serif", marginBottom: "0.5rem",
                  }}>
                    {label}
                  </p>
                  <p className="font-display" style={{
                    color: "#f5f0e8", fontSize: "1.15rem",
                    fontWeight: 400, lineHeight: 1.35,
                  }}>
                    {value}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.98, duration: 0.6 }}
              style={{
                border: "1px solid rgba(212,169,42,0.18)",
                borderRadius: "1.6rem",
                background: "linear-gradient(135deg, rgba(212,169,42,0.05), rgba(255,255,255,0.02))",
                padding: "1.8rem 2rem", marginBottom: "2rem",
              }}
            >
              <p className="font-display" style={{
                color: "rgba(255,255,255,0.75)",
                fontStyle: "italic", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "1rem",
              }}>
                "He preparado esta noche con muchísimo cariño,
                porque este momento significa tanto para mí como
                las personas con quienes quiero compartirlo.
                Me haría muy feliz contar con tu presencia."
              </p>
              <p style={{
                color: "#d4a92a", fontSize: "0.75rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                — Dra Mariana
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.08, duration: 0.6 }}
              style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
            >
              <a
                href={confirmLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...S.goldBtn, justifyContent: "center" }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "")}
              >
                <HeartPulse size={18} />
                Síiii, ahí estaré ✨
              </a>
              <a
                href={declineLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "1.2rem",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400, fontSize: "0.9rem",
                  padding: "1rem 2rem", textDecoration: "none",
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

          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #d4a92a, transparent)" }} />
        </motion.div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [step, setStep] = useState("access")
  const [guest, setGuest] = useState(null)
  const [flash, setFlash] = useState(false)
  const [guestList, setGuestList] = useState([])
  const [loadingGuests, setLoadingGuests] = useState(true)
  const [adminAuthed, setAdminAuthed] = useState(false)
  const audioRef = useRef(null)

  // Detectar ruta admin
  const isAdmin = window.location.hash === "#admin"

  // Cargar invitados desde Supabase al montar
  useEffect(() => {
    supabase
      .from("guests")
      .select("*")
      .then(({ data }) => {
        setGuestList(data || [])
        setLoadingGuests(false)
      })
  }, [])

  // Audio: pausa al ocultar pestaña
  useEffect(() => {
    const pauseAudio = () => audioRef.current?.pause()
    const handleVisibility = () => {
      if (!audioRef.current) return
      if (document.hidden) {
        pauseAudio()
      } else if (audioRef.current.currentTime > 0) {
        audioRef.current.play().catch(() => {})
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("pagehide", pauseAudio)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("pagehide", pauseAudio)
    }
  }, [])

  const handleAccess = useCallback((foundGuest) => {
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
  }, [])

  const handleContinue = useCallback(() => {
    setStep("invite")
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  // ── Panel admin ──
  if (isAdmin) {
    if (!adminAuthed) return (
      <div style={{ minHeight: "100vh", background: "#030303", color: "#fff" }}>
        <AdminLogin onSuccess={() => setAdminAuthed(true)} />
      </div>
    )
    return (
      <div style={{ minHeight: "100vh", background: "#030303", color: "#fff" }}>
        <AdminPanel onLogout={() => setAdminAuthed(false)} />
      </div>
    )
  }

  // ── Loading inicial ──
  if (loadingGuests) {
    return (
      <div style={{
        minHeight: "100vh", background: "#030303",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: "#d4a92a", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.2em", fontSize: "0.8rem" }}
        >
          CARGANDO…
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#030303",
      color: "#fff", position: "relative", overflowX: "hidden",
    }}>
      <audio ref={audioRef} loop preload="none">
        <source src={`${BASE}music.mp3`} type="audio/mpeg" />
      </audio>

      <MedIcons />

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "radial-gradient(ellipse at center, rgba(30,20,5,0.97) 0%, #030303 100%)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === "access" && <AccessScreen key="access" onSuccess={handleAccess} guests={guestList} />}
        {step === "story"  && guest && <StoryScreen key="story" guest={guest} onContinue={handleContinue} />}
        {step === "invite" && guest && <InviteScreen key="invite" guest={guest} />}
      </AnimatePresence>
    </div>
  )
}