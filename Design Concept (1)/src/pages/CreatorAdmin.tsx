import { useState } from "react"
import { Button } from "../components/ui/Button"

export function CreatorAdmin() {
  const [items, setItems] = useState([
    {
      id: 1,
      author: "Mithras",
      domain: "Thinkers",
      q: "Who wrote 'Beyond Good and Evil'?",
    },
    {
      id: 2,
      author: "Nyx",
      domain: "Otaku",
      q: "In NGE, what is the name of Shinji's Eva?",
    },
  ])

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="font-display text-3xl text-gold">Overseer Chamber</h2>
        <p className="text-muted-foreground mt-1">
          Review contributions before they enter the Archives.
        </p>
      </div>

      <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-sm font-medium text-muted-foreground">
          <div className="col-span-2">Author</div>
          <div className="col-span-2">Domain</div>
          <div className="col-span-6">Question</div>
          <div className="col-span-2 text-right">Decree</div>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No pending scrolls.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors"
              >
                <div className="col-span-2 text-sm">{item.author}</div>
                <div className="col-span-2 text-sm text-cyan">
                  {item.domain}
                </div>
                <div className="col-span-6 text-sm">{item.q}</div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={() =>
                      setItems(items.filter((i) => i.id !== item.id))
                    }
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="bg-cyan/20 text-cyan hover:bg-cyan/30"
                    onClick={() =>
                      setItems(items.filter((i) => i.id !== item.id))
                    }
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
