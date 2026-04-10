import { Clock, User } from "lucide-react";

interface Props {
  name: string;
  rating: number;
  isActive: boolean;
  capturedPieces?: string[];
  timeLeft: number; // seconds, managed externally
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const PlayerInfo = ({ name, rating, isActive, capturedPieces = [], timeLeft }: Props) => {
  const isLow = timeLeft < 60;

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isActive ? "bg-primary/10 border border-primary/30" : "bg-card border border-border"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
          <User className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">Rating: {rating}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {capturedPieces.length > 0 && (
          <span className="text-lg tracking-tighter">{capturedPieces.join("")}</span>
        )}
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-mono font-bold ${
          isLow
            ? "bg-destructive/20 text-destructive animate-pulse"
            : isActive
              ? "bg-primary/20 text-primary"
              : "bg-secondary text-muted-foreground"
        }`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
