import GameSidebar from "@/components/chess/GameSidebar";
import { Trophy, Clock, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const tournaments = [
  { title: "Daily Blitz Arena", format: "3+0", players: 128, status: "Live", icon: Zap },
  { title: "Weekend Rapid", format: "10+5", players: 256, status: "Starts in 2h", icon: Clock },
  { title: "Monthly Championship", format: "15+10", players: 512, status: "Registration Open", icon: Trophy },
  { title: "Bullet Bonanza", format: "1+0", players: 64, status: "Live", icon: Zap },
];

const Tournaments = () => (
  <div className="flex min-h-screen bg-background">
    <GameSidebar />
    <main className="flex-1 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Tournaments</h1>
        </div>
        <div className="space-y-3">
          {tournaments.map(t => (
            <div key={t.title} className="bg-card border border-border rounded-lg p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-secondary/50 transition-all group">
              <t.icon className="w-8 h-8 text-primary shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <h3 className="font-display font-semibold text-foreground">{t.title}</h3>
                <p className="text-muted-foreground text-sm">{t.format} • <Users className="inline w-3 h-3" /> {t.players} players</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-0.5 rounded ${t.status === "Live" ? "bg-green-500/20 text-green-400" : "bg-primary/10 text-primary"}`}>{t.status}</span>
                <Button size="sm" className="mt-2 block bg-primary text-primary-foreground hover:bg-gold-dark text-xs">Join</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

export default Tournaments;
