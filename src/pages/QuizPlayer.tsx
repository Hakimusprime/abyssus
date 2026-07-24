import { useState } from "react"
import { Button } from "../components/ui/Button"

export function QuizPlayer() {
  const [state, setState] = useState<"intro" | "playing" | "result">("intro")
  const [selected, setSelected] = useState<number | null>(null)

  if (state === "intro") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="glass-card p-10 max-w-md w-full text-center rounded-xl">
          <h2 className="font-display text-3xl text-gold mb-4">
            Trial of the Deep
          </h2>
          <p className="text-muted-foreground mb-8">
            10 questions. 15 seconds each. Mistakes will drain your HP.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => setState("playing")}
          >
            Commence
          </Button>
        </div>
      </div>
    )
  }

  if (state === "playing") {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-2 bg-red-500/80 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              />
            ))}
          </div>
          <div className="text-xl font-display text-cyan">14s</div>
        </div>

        <div className="glass-card p-8 rounded-xl border border-white/5">
          <h3 className="text-2xl font-medium mb-8 leading-relaxed">
            In which realm does the forgotten deity of knowledge reside?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "The Upper Reaches",
              "The Abyssal Trench",
              "The Shallows",
              "The Sunken Spire",
            ].map((ans, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                  selected === i
                    ? "border-cyan bg-cyan/10 text-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "border-white/10 hover:border-white/30 hover:bg-white/5"
                }`}
              >
                {ans}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant={selected !== null ? "primary" : "secondary"}
            disabled={selected === null}
            onClick={() => setState("result")}
          >
            Confirm Answer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mb-6 shadow-gold-glow">
        <span className="font-display text-4xl text-gold">S</span>
      </div>
      <h2 className="font-display text-4xl text-gold mb-2">Trial Conquered</h2>
      <p className="text-cyan text-lg mb-8">+150 Abyssal XP</p>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => setState("intro")}>
          Return
        </Button>
        <Button variant="primary" onClick={() => setState("intro")}>
          Next Trial
        </Button>
      </div>
    </div>
  )
}
