import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Button } from "../components/ui/Button"

export function Catalog() {
  const domains = [
    { id: 1, name: "Otaku", count: 342, level: "Initiate" },
    { id: 2, name: "General Culture", count: 890, level: "Adept" },
    { id: 3, name: "Thinkers", count: 124, level: "Scholar" },
    { id: 4, name: "Abyssal Lore", count: 50, level: "Master" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-gold">Archives</h2>
          <p className="text-muted-foreground mt-1">
            Browse the recorded knowledge of the sanctuary.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search trials..."
            className="bg-black/50 border border-white/10 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan text-text"
          />
          <Button variant="secondary">Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {domains.map((d) => (
          <Card key={d.id} className="cursor-pointer group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg group-hover:text-cyan transition-colors">
                {d.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mt-4">
                <span className="text-xs text-muted-foreground">
                  {d.count} entries
                </span>
                <span className="text-xs font-display text-gold bg-gold/10 px-2 py-1 rounded">
                  {d.level}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
