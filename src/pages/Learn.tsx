import GameSidebar from "@/components/chess/GameSidebar";
import { BookOpen, Play, GraduationCap, Lightbulb, Crown, Star, Trophy, ExternalLink } from "lucide-react";

const lessons = [
  { icon: Play, title: "Beginner Basics", desc: "Learn how pieces move and basic rules", progress: 100 },
  { icon: GraduationCap, title: "Tactics Training", desc: "Forks, pins, skewers, and discoveries", progress: 45 },
  { icon: Lightbulb, title: "Opening Principles", desc: "Control the center, develop pieces", progress: 20 },
  { icon: BookOpen, title: "Endgame Mastery", desc: "King & pawn endings, rook endings", progress: 0 },
];

interface Grandmaster {
  name: string;
  country: string;
  peakRating: number;
  title: string;
  specialty: string;
  era: string;
}

const grandmasters: Grandmaster[] = [
  { name: "Magnus Carlsen", country: "🇳🇴 Norway", peakRating: 2882, title: "World Champion 2013–2023", specialty: "Universal, endgame wizard", era: "Modern" },
  { name: "D. Gukesh", country: "🇮🇳 India", peakRating: 2794, title: "World Champion 2024–", specialty: "Tactical precision, nerves of steel", era: "Modern" },
  { name: "R. Praggnanandhaa", country: "🇮🇳 India", peakRating: 2747, title: "Super GM", specialty: "Rapid calculation, fearless play", era: "Modern" },
  { name: "Viswanathan Anand", country: "🇮🇳 India", peakRating: 2817, title: "World Champion 2007–2013", specialty: "Speed, opening preparation", era: "Modern" },
  { name: "Garry Kasparov", country: "🇷🇺 Russia", peakRating: 2851, title: "World Champion 1985–2000", specialty: "Dynamic attacking play", era: "Classic" },
  { name: "Bobby Fischer", country: "🇺🇸 USA", peakRating: 2785, title: "World Champion 1972–1975", specialty: "Opening innovation, perfectionism", era: "Classic" },
  { name: "Anatoly Karpov", country: "🇷🇺 Russia", peakRating: 2780, title: "World Champion 1975–1985", specialty: "Positional mastery, prophylaxis", era: "Classic" },
  { name: "Mikhail Tal", country: "🇱🇻 Latvia", peakRating: 2705, title: "World Champion 1960–1961", specialty: "Sacrificial attacks, imagination", era: "Classic" },
  { name: "José Raúl Capablanca", country: "🇨🇺 Cuba", peakRating: 2725, title: "World Champion 1921–1927", specialty: "Endgame technique, simplicity", era: "Legend" },
  { name: "Fabiano Caruana", country: "🇺🇸 USA", peakRating: 2844, title: "World #2, Challenger 2018", specialty: "Deep preparation, calculation", era: "Modern" },
  { name: "Hikaru Nakamura", country: "🇺🇸 USA", peakRating: 2816, title: "Super GM, Streaming Legend", specialty: "Bullet/blitz, intuition", era: "Modern" },
  { name: "Levon Aronian", country: "🇺🇸 Armenia/USA", peakRating: 2830, title: "Super GM", specialty: "Creative middlegame play", era: "Modern" },
  { name: "Alireza Firouzja", country: "🇫🇷 France", peakRating: 2804, title: "Super GM, Youngest 2800", specialty: "Aggressive, dynamic style", era: "Modern" },
  { name: "Ian Nepomniachtchi", country: "🇷🇺 Russia", peakRating: 2795, title: "World Championship Challenger", specialty: "Fast play, opening depth", era: "Modern" },
  { name: "Ding Liren", country: "🇨🇳 China", peakRating: 2816, title: "World Champion 2023–2024", specialty: "Solid defense, resilience", era: "Modern" },
  { name: "Vladimir Kramnik", country: "🇷🇺 Russia", peakRating: 2817, title: "World Champion 2000–2007", specialty: "Berlin Wall, strategic depth", era: "Classic" },
  { name: "Veselin Topalov", country: "🇧🇬 Bulgaria", peakRating: 2816, title: "FIDE World Champion 2005", specialty: "Aggressive, dynamic play", era: "Modern" },
  { name: "Alexander Alekhine", country: "🇷🇺 Russia/France", peakRating: 2690, title: "World Champion 1927–1946", specialty: "Combinational genius", era: "Legend" },
  { name: "Emanuel Lasker", country: "🇩🇪 Germany", peakRating: 2720, title: "World Champion 1894–1921", specialty: "Psychological warfare, resilience", era: "Legend" },
  { name: "Judit Polgár", country: "🇭🇺 Hungary", peakRating: 2735, title: "Strongest Female Player Ever", specialty: "Tactical brilliance, fearless", era: "Modern" },
];

const coachTips = [
  { title: "Control the Center", tip: "Occupy and control d4, d5, e4, e5 with pawns and pieces early.", gm: "Capablanca" },
  { title: "Develop All Pieces", tip: "Don't move the same piece twice in the opening. Get knights and bishops out fast.", gm: "Morphy" },
  { title: "King Safety First", tip: "Castle early to protect your king and connect your rooks.", gm: "Karpov" },
  { title: "Think in Plans", tip: "Every move should have a purpose. Ask: what does my opponent want?", gm: "Kasparov" },
  { title: "Master the Endgame", tip: "Study king and pawn endings — they're the foundation of all endgames.", gm: "Carlsen" },
  { title: "Calculate Variations", tip: "Look 3-4 moves ahead. Check all captures, checks, and threats.", gm: "Tal" },
];

const Learn = () => (
  <div className="flex min-h-screen bg-background">
    <GameSidebar />
    <main className="flex-1 p-6 lg:p-10 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="w-8 h-8 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Chess Coach</h1>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold ml-2">Become a Grandmaster</span>
        </div>

        {/* Lessons */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Lessons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map(l => (
              <button key={l.title} className="bg-card border border-border rounded-lg p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-secondary/50 transition-all group text-left">
                <l.icon className="w-10 h-10 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground mb-1">{l.title}</h3>
                  <p className="text-muted-foreground text-sm">{l.desc}</p>
                  <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${l.progress}%` }} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{l.progress}%</span>
              </button>
            ))}
          </div>
        </section>

        {/* Coach Tips from GMs */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" /> Grandmaster Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {coachTips.map(ct => (
              <div key={ct.title} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                <h4 className="font-semibold text-foreground text-sm mb-1">{ct.title}</h4>
                <p className="text-muted-foreground text-xs mb-2">{ct.tip}</p>
                <span className="text-[10px] text-primary font-medium">— Inspired by {ct.gm}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Grandmasters Hall of Fame */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" /> Hall of Fame — Study the Greatest
          </h2>
          <p className="text-muted-foreground text-sm mb-6">Learn from the legends. Study their games, master their styles, and become a grandmaster yourself.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {grandmasters.map(gm => (
              <div key={gm.name} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{gm.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{gm.country}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded text-[11px] text-primary font-bold">
                    <Star className="w-3 h-3" />
                    {gm.peakRating}
                  </div>
                </div>
                <p className="text-[11px] text-primary/80 font-medium mb-1">{gm.title}</p>
                <p className="text-[10px] text-muted-foreground">{gm.specialty}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    gm.era === "Modern" ? "bg-green-500/10 text-green-400" :
                    gm.era === "Classic" ? "bg-blue-500/10 text-blue-400" :
                    "bg-amber-500/10 text-amber-400"
                  }`}>{gm.era}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  </div>
);

export default Learn;
