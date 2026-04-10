import GameSidebar from "@/components/chess/GameSidebar";
import { BarChart3, TrendingUp, Award, Target } from "lucide-react";

const stats = [
  { label: "Games Played", value: "247", icon: Target },
  { label: "Win Rate", value: "54%", icon: TrendingUp },
  { label: "Current Rating", value: "1340", icon: BarChart3 },
  { label: "Best Rating", value: "1425", icon: Award },
];

const Stats = () => (
  <div className="flex min-h-screen bg-background">
    <GameSidebar />
    <main className="flex-1 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Statistics</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-5 text-center hover:border-primary/50 transition-colors">
              <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-muted-foreground text-xs">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Rating History</h3>
          <div className="h-48 flex items-end justify-between gap-1 px-4">
            {[1200,1250,1220,1280,1310,1290,1340,1320,1350,1380,1340,1425].map((r, i) => (
              <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t cursor-pointer group relative" style={{ height: `${((r - 1150) / 300) * 100}%` }}>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default Stats;
