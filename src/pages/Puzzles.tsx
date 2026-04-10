import GameSidebar from "@/components/chess/GameSidebar";
import { Puzzle, Target, TrendingUp, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const puzzleCategories = [
  { icon: Target, title: "Daily Puzzle", desc: "Solve today's challenge", rating: null },
  { icon: TrendingUp, title: "Rated Puzzles", desc: "Improve your tactical rating", rating: "1200" },
  { icon: Clock, title: "Puzzle Rush", desc: "Solve as many as you can in 5 min", rating: null },
  { icon: Star, title: "Puzzle Themes", desc: "Practice forks, pins, skewers & more", rating: null },
];

const Puzzles = () => (
  <div className="flex min-h-screen bg-background">
    <GameSidebar />
    <main className="flex-1 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Puzzle className="w-8 h-8 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Puzzles</h1>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {puzzleCategories.map(c => (
            <button key={c.title} className="bg-card border border-border rounded-lg p-6 text-left hover:border-primary/50 hover:bg-secondary/50 transition-all group">
              <c.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-semibold text-foreground mb-1">{c.title}</h3>
              <p className="text-muted-foreground text-sm">{c.desc}</p>
              {c.rating && <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Rating: {c.rating}</span>}
            </button>
          ))}
        </div>
        <div className="mt-8 bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">Your puzzle rating: <span className="text-primary font-bold text-xl">1200</span></p>
          <Button className="bg-primary text-primary-foreground hover:bg-gold-dark font-display text-lg px-8">Start Solving</Button>
        </div>
      </div>
    </main>
  </div>
);

export default Puzzles;
