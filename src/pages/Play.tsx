import { useState, useCallback, useEffect, useRef } from "react";
import { Chess, Square } from "chess.js";
import ChessBoard from "@/components/chess/ChessBoard";
import GameSidebar from "@/components/chess/GameSidebar";
import RightPanel, { BotConfig, bots } from "@/components/chess/RightPanel";
import PlayerInfo from "@/components/chess/PlayerInfo";
import { playMoveSound, playCaptureSound, playCheckSound, playGameOverSound } from "@/lib/sounds";
import { getBotMove, analyzeGame } from "@/lib/chess-engine";
import { Bot, Zap, Timer, Swords, Crown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TimeControl {
  label: string;
  seconds: number;
  category: string;
}

export const timeControls: TimeControl[] = [
  { label: "1 min", seconds: 60, category: "Bullet" },
  { label: "2 min", seconds: 120, category: "Bullet" },
  { label: "3 min", seconds: 180, category: "Blitz" },
  { label: "5 min", seconds: 300, category: "Blitz" },
  { label: "10 min", seconds: 600, category: "Rapid" },
  { label: "15 min", seconds: 900, category: "Rapid" },
];

interface MoveRecord {
  san: string;
  fen: string;
  from: string;
  to: string;
  captured?: string;
  color: "w" | "b";
}

const PIECE_SYMBOLS: Record<string, string> = {
  p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚",
};

const botAvatars: Record<string, string> = {
  Squire: "🐣",
  Knight: "🐴",
  Bishop: "🧙",
  Rook: "🏰",
  Queen: "👑",
};

const Play = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [game, setGame] = useState(new Chess());
  const [moveRecords, setMoveRecords] = useState<MoveRecord[]>([]);
  const [viewIndex, setViewIndex] = useState(-1);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [gameStatus, setGameStatus] = useState("");
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);
  const [currentBot, setCurrentBot] = useState<BotConfig>(bots[1]);
  const [analysisData, setAnalysisData] = useState<{ moveScores: number[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTime, setSelectedTime] = useState<TimeControl>(timeControls[4]);
  const [whiteTime, setWhiteTime] = useState(timeControls[4].seconds);
  const [blackTime, setBlackTime] = useState(timeControls[4].seconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const gameOver = game.isGameOver() || !!gameStatus;

  // Central timer management
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!gameStarted || gameOver || moveRecords.length === 0) return;

    const turn = game.turn();
    timerRef.current = setInterval(() => {
      if (turn === "w") {
        setWhiteTime(prev => {
          if (prev <= 1) {
            setGameStatus("Time's up! Black wins!");
            playGameOverSound();
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            setGameStatus("Time's up! White wins!");
            playGameOverSound();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [game.turn(), gameOver, moveRecords.length, gameStarted]);

  const updateStatus = useCallback((g: Chess) => {
    if (g.isCheckmate()) {
      setGameStatus(`Checkmate! ${g.turn() === "w" ? "Black" : "White"} wins!`);
      playGameOverSound();
    } else if (g.isDraw()) {
      setGameStatus("Draw!");
      playGameOverSound();
    } else if (g.isStalemate()) {
      setGameStatus("Stalemate!");
      playGameOverSound();
    } else if (g.isCheck()) {
      setGameStatus("Check!");
      playCheckSound();
    } else {
      setGameStatus("");
    }
  }, []);

  const handleMove = useCallback((from: string, to: string) => {
    if (viewIndex !== -1) return false;
    if (game.turn() !== "w") return false;

    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({ from: from as Square, to: to as Square, promotion: "q" });
      if (move) {
        if (move.captured) playCaptureSound(); else playMoveSound();

        const record: MoveRecord = { san: move.san, fen: gameCopy.fen(), from, to, captured: move.captured, color: "w" };

        if (move.captured) {
          setCapturedWhite(prev => [...prev, PIECE_SYMBOLS[move.captured!]]);
        }

        setGame(gameCopy);
        setMoveRecords(prev => [...prev, record]);
        setLastMove({ from, to });
        updateStatus(gameCopy);

        // Bot response
        if (!gameCopy.isGameOver()) {
          setTimeout(() => {
            const botMove = getBotMove(gameCopy, currentBot.depth);
            if (botMove) {
              gameCopy.move(botMove);
              if (botMove.captured) playCaptureSound(); else playMoveSound();
              if (botMove.captured) {
                setCapturedBlack(prev => [...prev, PIECE_SYMBOLS[botMove.captured!]]);
              }
              const botRecord: MoveRecord = { san: botMove.san, fen: gameCopy.fen(), from: botMove.from, to: botMove.to, captured: botMove.captured, color: "b" };
              setGame(new Chess(gameCopy.fen()));
              setMoveRecords(prev => [...prev, botRecord]);
              setLastMove({ from: botMove.from, to: botMove.to });
              updateStatus(gameCopy);
            }
          }, 300);
        }
        return true;
      }
    } catch { /* invalid move */ }
    return false;
  }, [game, updateStatus, viewIndex, currentBot]);

  const handleUndo = () => {
    if (moveRecords.length === 0 || gameOver) return;
    const undoCount = moveRecords.length >= 2 && moveRecords[moveRecords.length - 1].color === "b" ? 2 : 1;
    const newRecords = moveRecords.slice(0, -undoCount);
    
    const newGame = new Chess();
    const newCapWhite: string[] = [];
    const newCapBlack: string[] = [];
    for (const rec of newRecords) {
      newGame.move(rec.san);
      if (rec.captured) {
        if (rec.color === "w") newCapWhite.push(PIECE_SYMBOLS[rec.captured]);
        else newCapBlack.push(PIECE_SYMBOLS[rec.captured]);
      }
    }
    
    setGame(newGame);
    setMoveRecords(newRecords);
    setCapturedWhite(newCapWhite);
    setCapturedBlack(newCapBlack);
    setViewIndex(-1);
    setLastMove(newRecords.length > 0 ? { from: newRecords[newRecords.length - 1].from, to: newRecords[newRecords.length - 1].to } : null);
    setGameStatus("");
  };

  const resetGame = () => {
    setGame(new Chess());
    setMoveRecords([]);
    setViewIndex(-1);
    setLastMove(null);
    setGameStatus("");
    setCapturedWhite([]);
    setCapturedBlack([]);
    setAnalysisData(null);
    setWhiteTime(selectedTime.seconds);
    setBlackTime(selectedTime.seconds);
  };

  const handleNewGame = () => {
    resetGame();
  };

  const handleResign = () => {
    setGameStatus("You resigned. Black wins!");
    playGameOverSound();
  };

  const handleGoToMove = (index: number) => {
    if (index < 0 || index >= moveRecords.length) return;
    setViewIndex(index);
    const fen = moveRecords[index].fen;
    setGame(new Chess(fen));
    setLastMove({ from: moveRecords[index].from, to: moveRecords[index].to });
  };

  const handleGoToCurrent = () => {
    if (moveRecords.length === 0) return;
    setViewIndex(-1);
    const fen = moveRecords[moveRecords.length - 1].fen;
    setGame(new Chess(fen));
    const last = moveRecords[moveRecords.length - 1];
    setLastMove({ from: last.from, to: last.to });
  };

  const handleSelectBot = (bot: BotConfig) => {
    setCurrentBot(bot);
    resetGame();
    setGameStarted(true);
  };

  const handleSelectTime = (tc: TimeControl) => {
    setSelectedTime(tc);
    setWhiteTime(tc.seconds);
    setBlackTime(tc.seconds);
    resetGame();
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const fens = moveRecords.map(r => r.fen);
      const scores = analyzeGame(fens);
      setAnalysisData({ moveScores: scores });
      setIsAnalyzing(false);
    }, 500);
  };

  const handleBackToLobby = () => {
    resetGame();
    setGameStarted(false);
  };

  const moveHistory = moveRecords.map(r => r.san);

  // Pre-game lobby screen (chess.com style)
  if (!gameStarted) {
    return (
      <div className="flex min-h-screen bg-background">
        <GameSidebar />
        <main className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-auto">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <Swords className="w-5 h-5 text-primary" />
                <span className="text-primary font-display font-semibold text-sm">Play vs Computer</span>
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">Choose Your Opponent</h1>
              <p className="text-muted-foreground text-sm">Select a bot difficulty and time control, then start playing!</p>
            </div>

            {/* Bot Selection */}
            <div className="mb-6">
              <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4" /> Difficulty
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {bots.map(bot => {
                  const isActive = currentBot.name === bot.name;
                  return (
                    <button
                      key={bot.name}
                      onClick={() => setCurrentBot(bot)}
                      className={`relative flex flex-col items-center p-4 rounded-xl transition-all border-2 ${
                        isActive
                          ? "bg-primary/15 border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                          : "bg-card border-border hover:border-primary/40 hover:bg-secondary/50"
                      }`}
                    >
                      <span className="text-3xl mb-2">{botAvatars[bot.name]}</span>
                      <span className="font-display font-bold text-foreground text-sm">{bot.name}</span>
                      <span className={`text-xs font-semibold mt-0.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}>{bot.rating}</span>
                      <span className="text-[10px] text-muted-foreground mt-1">{bot.level}</span>
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Zap className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Control */}
            <div className="mb-8">
              <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Timer className="w-4 h-4" /> Time Control
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {timeControls.map(tc => (
                  <button
                    key={tc.label}
                    onClick={() => {
                      setSelectedTime(tc);
                      setWhiteTime(tc.seconds);
                      setBlackTime(tc.seconds);
                    }}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all border ${
                      selectedTime.label === tc.label
                        ? "bg-primary/15 border-primary text-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <span className="font-bold text-sm">{tc.label}</span>
                    <span className="text-[10px] opacity-70">{tc.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Play Button */}
            <Button
              size="lg"
              className="w-full h-14 text-lg font-display font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
              onClick={() => {
                resetGame();
                setGameStarted(true);
              }}
            >
              <Swords className="w-5 h-5 mr-2" />
              Play vs {currentBot.name} ({currentBot.rating})
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>

            {/* Quick info */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Crown className="w-3 h-3 text-primary" /> You play as White</span>
              <span className="flex items-center gap-1"><Timer className="w-3 h-3 text-primary" /> {selectedTime.label} {selectedTime.category}</span>
              <span className="flex items-center gap-1"><Bot className="w-3 h-3 text-primary" /> Depth {currentBot.depth}</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // In-game view
  return (
    <div className="flex min-h-screen bg-background">
      <GameSidebar />
      <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-3 p-3 lg:p-4 overflow-auto">
        <div className="flex flex-col items-center gap-2">
          <PlayerInfo name={`${currentBot.name} (${currentBot.rating})`} rating={currentBot.rating} isActive={game.turn() === "b"} capturedPieces={capturedBlack} timeLeft={blackTime} />
          <ChessBoard game={game} onMove={handleMove} lastMove={lastMove} />
          <PlayerInfo name="You (Guest)" rating={1200} isActive={game.turn() === "w"} capturedPieces={capturedWhite} timeLeft={whiteTime} />
        </div>
        <RightPanel
          game={game}
          moveHistory={moveHistory}
          onNewGame={handleNewGame}
          onResign={handleResign}
          onUndo={handleUndo}
          gameStatus={gameStatus}
          viewIndex={viewIndex}
          onGoToMove={handleGoToMove}
          onGoToCurrent={handleGoToCurrent}
          onSelectBot={handleSelectBot}
          currentBot={currentBot}
          analysisData={analysisData}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          timeControls={timeControls}
          selectedTime={selectedTime}
          onSelectTime={handleSelectTime}
          canUndo={moveRecords.length > 0 && !gameOver}
          onBackToLobby={handleBackToLobby}
          onRematch={resetGame}
        />
      </div>
    </div>
  );
};

export default Play;
