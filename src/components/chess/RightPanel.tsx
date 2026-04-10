import { Chess } from "chess.js";
import { Bot, Flag, RotateCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Zap, Brain, Undo2, Timer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimeControl } from "@/pages/Play";

export interface BotConfig {
  name: string;
  rating: number;
  level: string;
  depth: number;
}

export const bots: BotConfig[] = [
  { name: "Squire", rating: 400, level: "Beginner", depth: 0 },
  { name: "Knight", rating: 800, level: "Casual", depth: 1 },
  { name: "Bishop", rating: 1200, level: "Intermediate", depth: 2 },
  { name: "Rook", rating: 1600, level: "Advanced", depth: 3 },
  { name: "Queen", rating: 2000, level: "Expert", depth: 4 },
];

interface Props {
  game: Chess;
  moveHistory: string[];
  onNewGame: () => void;
  onResign: () => void;
  onUndo: () => void;
  gameStatus: string;
  viewIndex: number;
  onGoToMove: (index: number) => void;
  onGoToCurrent: () => void;
  onSelectBot: (bot: BotConfig) => void;
  currentBot: BotConfig;
  analysisData?: { moveScores: number[] } | null;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  timeControls: TimeControl[];
  selectedTime: TimeControl;
  onSelectTime: (tc: TimeControl) => void;
  canUndo: boolean;
  onBackToLobby?: () => void;
  onRematch?: () => void;
}

const RightPanel = ({ game, moveHistory, onNewGame, onResign, onUndo, gameStatus, viewIndex, onGoToMove, onGoToCurrent, currentBot, analysisData, onAnalyze, isAnalyzing, canUndo, onBackToLobby, onRematch }: Props) => {
  const activeIndex = viewIndex === -1 ? moveHistory.length - 1 : viewIndex;

  const movePairs: { num: number; white: string; whiteIdx: number; black?: string; blackIdx?: number }[] = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      whiteIdx: i,
      black: moveHistory[i + 1],
      blackIdx: i + 1 < moveHistory.length ? i + 1 : undefined,
    });
  }

  const gameOver = game.isGameOver() || !!gameStatus;

  return (
    <div className="w-full lg:w-72 bg-card border border-border rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]">
      {/* Back + Game Controls */}
      <div className="p-3 border-b border-border">
        <div className="flex gap-1.5">
          {onBackToLobby && (
            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground px-2" onClick={onBackToLobby}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground text-xs" onClick={onNewGame}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> New
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground text-xs" onClick={onUndo} disabled={!canUndo}>
            <Undo2 className="w-3.5 h-3.5 mr-1" /> Undo
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10 text-xs" onClick={onResign} disabled={gameOver}>
            <Flag className="w-3.5 h-3.5 mr-1" /> Resign
          </Button>
        </div>
      </div>

      {/* Status */}
      {gameStatus && (
        <div className="px-3 py-2 bg-primary/10 text-primary text-sm font-semibold text-center">
          {gameStatus}
        </div>
      )}

      {/* Rematch & Analysis Buttons */}
      {gameOver && moveHistory.length > 0 && (
        <div className="px-3 py-2 border-b border-border space-y-1.5">
          {onRematch && (
            <Button size="sm" className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90" onClick={onRematch}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Rematch — {currentBot.name} ({currentBot.rating})
            </Button>
          )}
          {onAnalyze && (
            <Button size="sm" variant="outline" className="w-full text-xs" onClick={onAnalyze} disabled={isAnalyzing || !!analysisData}>
              <Brain className="w-3.5 h-3.5 mr-1" />
              {isAnalyzing ? "Analyzing..." : analysisData ? "Analysis Complete" : "Analyze Game"}
            </Button>
          )}
        </div>
      )}

      {/* Move History */}
      <div className="p-3 flex-1 overflow-hidden flex flex-col min-h-0">
        <h3 className="font-display text-xs font-semibold text-primary mb-2">Moves</h3>
        <div className="flex-1 overflow-y-auto space-y-0.5 text-xs">
          {movePairs.map(pair => (
            <div key={pair.num} className="flex items-center gap-1">
              <span className="text-muted-foreground text-[10px] w-5 shrink-0">{pair.num}.</span>
              <button
                onClick={() => onGoToMove(pair.whiteIdx)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors hover:bg-primary/20 ${
                  activeIndex === pair.whiteIdx ? "bg-primary/20 text-primary font-semibold" : "text-foreground"
                }`}
              >
                {pair.white}
                {analysisData && (
                  <span className={`ml-1 text-[9px] ${analysisData.moveScores[pair.whiteIdx] > 0.5 ? "text-green-400" : analysisData.moveScores[pair.whiteIdx] < -0.5 ? "text-red-400" : "text-muted-foreground"}`}>
                    {analysisData.moveScores[pair.whiteIdx] > 0 ? "+" : ""}{analysisData.moveScores[pair.whiteIdx]?.toFixed(1)}
                  </span>
                )}
              </button>
              {pair.black && (
                <button
                  onClick={() => onGoToMove(pair.blackIdx!)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors hover:bg-primary/20 ${
                    activeIndex === pair.blackIdx ? "bg-primary/20 text-primary font-semibold" : "text-foreground"
                  }`}
                >
                  {pair.black}
                  {analysisData && pair.blackIdx !== undefined && (
                    <span className={`ml-1 text-[9px] ${analysisData.moveScores[pair.blackIdx] > 0.5 ? "text-green-400" : analysisData.moveScores[pair.blackIdx] < -0.5 ? "text-red-400" : "text-muted-foreground"}`}>
                      {analysisData.moveScores[pair.blackIdx] > 0 ? "+" : ""}{analysisData.moveScores[pair.blackIdx]?.toFixed(1)}
                    </span>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
        {moveHistory.length === 0 && <p className="text-muted-foreground text-[10px]">No moves yet</p>}

        {moveHistory.length > 0 && (
          <div className="flex items-center justify-center gap-1 mt-2 pt-2 border-t border-border">
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onGoToMove(0)} disabled={activeIndex <= 0}>
              <ChevronsLeft className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onGoToMove(activeIndex - 1)} disabled={activeIndex <= 0}>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => {
              if (activeIndex < moveHistory.length - 1) onGoToMove(activeIndex + 1);
              else onGoToCurrent();
            }} disabled={viewIndex === -1}>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onGoToCurrent} disabled={viewIndex === -1}>
              <ChevronsRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Current Bot Info */}
      <div className="px-3 py-2 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Playing vs</span>
          <span className="text-foreground font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3 text-primary" />
            {currentBot.name} ({currentBot.rating})
          </span>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
