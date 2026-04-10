import { useNavigate, useLocation } from "react-router-dom";
import { Swords, Puzzle, BookOpen, Trophy, Users, BarChart3, Settings, Crown } from "lucide-react";
import logo from "@/assets/chessrealm-logo.png";

const navItems = [
  { icon: Swords, label: "Play", path: "/play" },
  { icon: Puzzle, label: "Puzzles", path: "/puzzles" },
  { icon: BookOpen, label: "Learn", path: "/learn" },
  { icon: Trophy, label: "Tournaments", path: "/tournaments" },
  { icon: Users, label: "Social", path: "/social" },
  { icon: BarChart3, label: "Stats", path: "/stats" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const GameSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-16 lg:w-52 bg-card border-r border-border flex flex-col shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 p-3 lg:px-4 lg:py-5 border-b border-border cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} alt="ChessRealm" width={32} height={32} />
        <span className="hidden lg:block font-display text-sm font-bold text-gold-gradient">ChessRealm</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 text-sm transition-colors ${
                active
                  ? "bg-primary/10 text-primary border-r-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0 mx-auto lg:mx-0" />
              <span className="hidden lg:block">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Upgrade */}
      <div className="hidden lg:block p-4 border-t border-border">
        <div className="bg-secondary rounded-lg p-3 text-center">
          <Crown className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xs font-semibold text-foreground">Go Premium</p>
          <p className="text-[10px] text-muted-foreground">Unlock all features</p>
        </div>
      </div>
    </aside>
  );
};

export default GameSidebar;
