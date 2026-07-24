import { useEffect, useState } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { ShieldAlert, Lock, Sparkles, Bot, Swords, ScrollText, Save, LogIn } from "lucide-react"
import { db } from "../firebase"
import { useAuth } from "../context/AuthContext"
import { isOwner } from "../config/admin"
import { Button } from "../components/ui/Button"

type Tab = "overview" | "quests" | "ai" | "moderation"

interface AdminConfig {
  aiProvider: string
  aiModel: string
  aiEnabled: boolean
  questAutoGen: boolean
  questDailyCount: number
  questDifficulty: string
  bossAutoSchedule: boolean
}

const DEFAULT_CONFIG: AdminConfig = {
  aiProvider: "openai",
  aiModel: "gpt-4o-mini",
  aiEnabled: false,
  questAutoGen: false,
  questDailyCount: 3,
  questDifficulty: "adaptive",
  bossAutoSchedule: false,
}

export function CreatorAdmin() {
  const { user, loading, loginWithGoogle } = useAuth()
  const [tab, setTab] = useState<Tab>("overview")
  const [config, setConfig] = useState<AdminConfig>(DEFAULT_CONFIG)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const owner = isOwner(user?.email)

  useEffect(() => {
    if (!owner) return
    getDoc(doc(db, "config", "admin")).then((snap) => {
      if (snap.exists()) setConfig({ ...DEFAULT_CONFIG, ...snap.data() })
    })
  }, [owner])

  const saveConfig = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, "config", "admin"), config, { merge: true })
      setSavedAt(Date.now())
    } catch (e) {
      console.error("[v0] admin save failed:", e)
    }
    setSaving(false)
  }

  // --- Access gates ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground font-display text-2xl animate-in fade-in">
        Vérification des sceaux...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center glass-card rounded-2xl border border-white/10 p-8 mt-12 animate-in fade-in zoom-in-95">
        <Lock className="w-10 h-10 text-gold mx-auto mb-4" />
        <h2 className="font-display text-2xl text-gold">Chambre Scellée</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Cette zone est réservée à l&apos;Overseer. Authentifie-toi pour prouver ton identité.
        </p>
        <Button onClick={loginWithGoogle} className="bg-gold/20 text-gold hover:bg-gold/30">
          <LogIn className="w-4 h-4 mr-2" /> Se connecter avec Google
        </Button>
      </div>
    )
  }

  if (!owner) {
    return (
      <div className="max-w-md mx-auto text-center glass-card rounded-2xl border border-red-500/20 p-8 mt-12 animate-in fade-in zoom-in-95">
        <ShieldAlert className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <h2 className="font-display text-2xl text-red-400">Accès Interdit</h2>
        <p className="text-muted-foreground mt-2">
          Seul l&apos;Overseer du Sanctuaire peut franchir ce seuil.
          <br />
          Connecté en tant que <span className="text-text">{user.email}</span>.
        </p>
      </div>
    )
  }

  // --- Owner dashboard ---
  const tabs: { id: Tab; label: string; icon: typeof Sparkles }[] = [
    { id: "overview", label: "Vue d'ensemble", icon: Sparkles },
    { id: "quests", label: "Automatisation Quêtes", icon: Swords },
    { id: "ai", label: "IA & API", icon: Bot },
    { id: "moderation", label: "Modération", icon: ScrollText },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-3xl text-gold flex items-center gap-2">
            <ShieldAlert className="w-7 h-7" /> Chambre de l&apos;Overseer
          </h2>
          <p className="text-muted-foreground mt-1">
            Contrôle total du Sanctuaire — {user.email}
          </p>
        </div>
        <Button onClick={saveConfig} disabled={saving} className="bg-cyan/20 text-cyan hover:bg-cyan/30">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Sauvegarde..." : savedAt ? "Enregistré" : "Sauvegarder"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-white/10 pb-2">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                tab === t.id
                  ? "bg-gold/20 text-gold"
                  : "text-muted-foreground hover:bg-white/5 hover:text-text"
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          )
        })}
      </div>

      {tab === "overview" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "IA", value: config.aiEnabled ? "Active" : "Inactive", accent: config.aiEnabled ? "text-cyan" : "text-muted-foreground" },
            { label: "Génération auto de quêtes", value: config.questAutoGen ? `${config.questDailyCount}/jour` : "Désactivée", accent: config.questAutoGen ? "text-gold" : "text-muted-foreground" },
            { label: "Boss programmés", value: config.bossAutoSchedule ? "Auto" : "Manuel", accent: config.bossAutoSchedule ? "text-red-400" : "text-muted-foreground" },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl border border-white/5 p-5">
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className={`text-2xl font-display mt-2 ${s.accent}`}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "quests" && (
        <div className="glass-card rounded-xl border border-white/5 p-6 space-y-5">
          <Toggle
            label="Génération automatique des quêtes"
            desc="Créer chaque jour de nouvelles quêtes à partir de la banque de questions."
            checked={config.questAutoGen}
            onChange={(v) => setConfig({ ...config, questAutoGen: v })}
          />
          <Field label="Quêtes par jour">
            <input
              type="number"
              min={1}
              max={20}
              value={config.questDailyCount}
              onChange={(e) => setConfig({ ...config, questDailyCount: Number(e.target.value) })}
              className="w-24 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-text focus:border-gold outline-none"
            />
          </Field>
          <Field label="Difficulté">
            <select
              value={config.questDifficulty}
              onChange={(e) => setConfig({ ...config, questDifficulty: e.target.value })}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-text focus:border-gold outline-none"
            >
              <option value="easy">Facile</option>
              <option value="normal">Normale</option>
              <option value="hard">Difficile</option>
              <option value="adaptive">Adaptative (selon le rang)</option>
            </select>
          </Field>
          <Toggle
            label="Programmation automatique des Boss"
            desc="Invoquer les événements Boss à intervalles réguliers."
            checked={config.bossAutoSchedule}
            onChange={(v) => setConfig({ ...config, bossAutoSchedule: v })}
          />
        </div>
      )}

      {tab === "ai" && (
        <div className="glass-card rounded-xl border border-white/5 p-6 space-y-5">
          <Toggle
            label="Activer l'IA"
            desc="Utiliser un modèle pour générer questions, indices et dialogues de Boss."
            checked={config.aiEnabled}
            onChange={(v) => setConfig({ ...config, aiEnabled: v })}
          />
          <Field label="Fournisseur">
            <select
              value={config.aiProvider}
              onChange={(e) => setConfig({ ...config, aiProvider: e.target.value })}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-text focus:border-gold outline-none"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google Gemini</option>
              <option value="groq">Groq</option>
            </select>
          </Field>
          <Field label="Modèle">
            <input
              type="text"
              value={config.aiModel}
              onChange={(e) => setConfig({ ...config, aiModel: e.target.value })}
              className="w-64 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-text focus:border-gold outline-none"
            />
          </Field>
          <div className="flex items-start gap-3 rounded-lg border border-gold/20 bg-gold/5 p-4 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <p>
              Les clés API ne se saisissent jamais ici (le navigateur les exposerait). Elles doivent
              vivre côté serveur dans des variables d&apos;environnement. Dis-moi quand tu veux brancher
              l&apos;IA et j&apos;ajoute une route serveur sécurisée qui lit la clé depuis l&apos;environnement.
            </p>
          </div>
        </div>
      )}

      {tab === "moderation" && (
        <div className="glass-card rounded-xl border border-white/5 p-8 text-center text-muted-foreground">
          File de modération des contributions — à connecter à la collection des soumissions.
        </div>
      )}
    </div>
  )
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string
  desc: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-text">{label}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
          checked ? "bg-cyan/60" : "bg-white/10"
        }`}
        aria-pressed={checked}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-text">{label}</div>
      {children}
    </div>
  )
}
