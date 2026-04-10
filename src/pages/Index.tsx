import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Swords, BookOpen, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/chessrealm-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const features = [
    { icon: Swords, title: "Play Online", desc: "Challenge players worldwide", path: "/play" },
    { icon: BookOpen, title: "Learn", desc: "Master strategies & openings", path: "/learn" },
    { icon: Trophy, title: "Tournaments", desc: "Compete for glory", path: "/tournaments" },
    { icon: Users, title: "Community", desc: "Join thousands of players", path: "/social" },
  ];

  return (
    <div className="min-h-screen bg-royal-gradient flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="ChessRealm" width={40} height={40} />
          <span className="font-display text-xl text-gold-gradient font-bold">ChessRealm</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => { setShowLogin(true); setShowSignup(false); }}>
            Log In
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-gold-dark font-semibold" onClick={() => { setShowSignup(true); setShowLogin(false); }}>
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium text-sm uppercase tracking-widest">The Royal Chess Experience</span>
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground">
              Your Kingdom <br />
              <span className="text-gold-gradient">Awaits</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Play chess online against players worldwide. Solve puzzles, learn strategies, and rise through the ranks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-gold-dark font-display text-lg px-8 glow-gold" onClick={() => navigate("/play")}>
                Play as Guest
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 font-display text-lg px-8" onClick={() => setShowSignup(true)}>
                Create Account
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            {(showLogin || showSignup) ? (
              <div className="bg-card border border-border rounded-lg p-8 glow-gold">
                <h2 className="font-display text-2xl font-bold mb-6 text-gold-gradient">
                  {showLogin ? "Welcome Back" : "Join ChessRealm"}
                </h2>
                <div className="space-y-4">
                  {showSignup && <Input placeholder="Username" className="bg-secondary border-border" />}
                  <Input placeholder="Email" type="email" className="bg-secondary border-border" />
                  <Input placeholder="Password" type="password" className="bg-secondary border-border" />
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-gold-dark font-semibold" onClick={() => navigate("/play")}>
                    {showLogin ? "Log In" : "Sign Up"}
                  </Button>
                  <p className="text-center text-muted-foreground text-sm">
                    {showLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button className="text-primary hover:underline" onClick={() => { setShowLogin(!showLogin); setShowSignup(!showSignup); }}>
                      {showLogin ? "Sign Up" : "Log In"}
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group cursor-pointer"
                    onClick={() => navigate(f.path)}
                  >
                    <f.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-muted-foreground text-sm">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-muted-foreground text-sm border-t border-border">
        © 2026 ChessRealm. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
