import { Button } from "../components/ui/Button"

export function EventsBoss() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in zoom-in-95 duration-700">
      <div className="relative w-64 h-64 mb-12">
        <div className="absolute inset-0 rounded-full bg-red-500/20 blur-[60px] animate-pulse" />
        <div className="absolute inset-4 rounded-full border border-red-500/30 animate-[spin_10s_linear_infinite]" />
        <div className="absolute inset-8 rounded-full border border-red-500/50 animate-[spin_7s_linear_infinite_reverse]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-8xl text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
            Ω
          </span>
        </div>
      </div>

      <h2 className="font-display text-5xl text-red-400 mb-4 tracking-wider">
        LEVIATHAN
      </h2>
      <p className="text-xl text-red-200/60 max-w-lg mb-8">
        The ancient horror awakens. 100 consecutive trials. No healing. Only the
        strongest scholars will survive the mental onslaught.
      </p>

      <div className="flex flex-col items-center gap-4">
        <div className="text-sm text-red-400/80 font-mono tracking-widest">
          HP: 45,920 / 100,000
        </div>
        <div className="w-64 h-2 bg-black rounded-full overflow-hidden border border-red-900/50">
          <div className="w-[45%] h-full bg-gradient-to-r from-red-600 to-red-400" />
        </div>
        <Button
          variant="danger"
          size="lg"
          className="mt-8 px-12 py-6 text-lg tracking-widest uppercase"
        >
          Enter the Breach
        </Button>
      </div>
    </div>
  )
}
