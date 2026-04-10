import { useState, useCallback, useRef } from "react";
import { Chess, Square as ChessSquare } from "chess.js";
import { motion } from "framer-motion";

const PIECE_UNICODE: Record<string, string> = {
  wp: "♙", wn: "♘", wb: "♗", wr: "♖", wq: "♕", wk: "♔",
  bp: "♟", bn: "♞", bb: "♝", br: "♜", bq: "♛", bk: "♚",
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

interface Props {
  game: Chess;
  onMove: (from: string, to: string) => boolean;
  lastMove?: { from: string; to: string } | null;
}

const ChessBoard = ({ game, onMove, lastMove }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [dragSquare, setDragSquare] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const board = game.board();

  const getSquareFromPoint = (clientX: number, clientY: number): string | null => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const squareSize = rect.width / 8;
    const fileIdx = Math.floor(x / squareSize);
    const rankIdx = Math.floor(y / squareSize);
    if (fileIdx < 0 || fileIdx > 7 || rankIdx < 0 || rankIdx > 7) return null;
    return `${FILES[fileIdx]}${RANKS[rankIdx]}`;
  };

  const handleSquareClick = useCallback((square: string) => {
    if (dragSquare) return; // Don't click while dragging
    if (selected) {
      if (legalMoves.includes(square)) {
        const success = onMove(selected, square);
        if (success) {
          setSelected(null);
          setLegalMoves([]);
          return;
        }
      }
      const piece = game.get(square as ChessSquare);
      if (piece && piece.color === game.turn()) {
        setSelected(square);
        const moves = game.moves({ square: square as ChessSquare, verbose: true });
        setLegalMoves(moves.map(m => m.to));
        return;
      }
      setSelected(null);
      setLegalMoves([]);
    } else {
      const piece = game.get(square as ChessSquare);
      if (piece && piece.color === game.turn()) {
        setSelected(square);
        const moves = game.moves({ square: square as ChessSquare, verbose: true });
        setLegalMoves(moves.map(m => m.to));
      }
    }
  }, [selected, legalMoves, game, onMove, dragSquare]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, square: string) => {
    const piece = game.get(square as ChessSquare);
    if (!piece || piece.color !== game.turn()) return;
    e.preventDefault();
    setDragSquare(square);
    setDragPos({ x: e.clientX, y: e.clientY });
    setSelected(square);
    const moves = game.moves({ square: square as ChessSquare, verbose: true });
    setLegalMoves(moves.map(m => m.to));
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragSquare) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  }, [dragSquare]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragSquare) return;
    const targetSquare = getSquareFromPoint(e.clientX, e.clientY);
    if (targetSquare && targetSquare !== dragSquare && legalMoves.includes(targetSquare)) {
      onMove(dragSquare, targetSquare);
    }
    setDragSquare(null);
    setDragPos(null);
    setSelected(null);
    setLegalMoves([]);
  }, [dragSquare, legalMoves, onMove]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent, square: string) => {
    const piece = game.get(square as ChessSquare);
    if (!piece || piece.color !== game.turn()) return;
    const touch = e.touches[0];
    setDragSquare(square);
    setDragPos({ x: touch.clientX, y: touch.clientY });
    setSelected(square);
    const moves = game.moves({ square: square as ChessSquare, verbose: true });
    setLegalMoves(moves.map(m => m.to));
  };

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragSquare) return;
    e.preventDefault();
    const touch = e.touches[0];
    setDragPos({ x: touch.clientX, y: touch.clientY });
  }, [dragSquare]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!dragSquare) return;
    const touch = e.changedTouches[0];
    const targetSquare = getSquareFromPoint(touch.clientX, touch.clientY);
    if (targetSquare && targetSquare !== dragSquare && legalMoves.includes(targetSquare)) {
      onMove(dragSquare, targetSquare);
    }
    setDragSquare(null);
    setDragPos(null);
    setSelected(null);
    setLegalMoves([]);
  }, [dragSquare, legalMoves, onMove]);

  // Get the dragged piece info
  const dragPiece = dragSquare ? game.get(dragSquare as ChessSquare) : null;

  return (
    <div
      ref={boardRef}
      className="inline-block border-2 border-primary/30 rounded-md overflow-hidden glow-gold relative select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {RANKS.map((rank, ri) => (
        <div key={rank} className="flex">
          {FILES.map((file, fi) => {
            const square = `${file}${rank}`;
            const isLight = (ri + fi) % 2 === 0;
            const piece = board[ri][fi];
            const isSelected = selected === square;
            const isLegal = legalMoves.includes(square);
            const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
            const isDragging = dragSquare === square;

            let bgClass = isLight ? "bg-board-light" : "bg-board-dark";
            if (isSelected) bgClass = "bg-primary/50";
            else if (isLastMove) bgClass = isLight ? "bg-primary/20" : "bg-primary/30";

            return (
              <div
                key={square}
                data-square={square}
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center relative cursor-pointer transition-colors duration-150 ${bgClass}`}
                onClick={() => handleSquareClick(square)}
                onMouseDown={(e) => handleMouseDown(e, square)}
                onTouchStart={(e) => handleTouchStart(e, square)}
              >
                {fi === 0 && (
                  <span className={`absolute top-0.5 left-0.5 text-[10px] font-semibold ${isLight ? "text-board-dark" : "text-board-light"} opacity-60`}>{rank}</span>
                )}
                {ri === 7 && (
                  <span className={`absolute bottom-0.5 right-0.5 text-[10px] font-semibold ${isLight ? "text-board-dark" : "text-board-light"} opacity-60`}>{file}</span>
                )}

                {isLegal && !piece && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full bg-primary/40" />
                )}
                {isLegal && piece && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 border-[3px] border-primary/50 rounded-full m-1" />
                )}

                {piece && !isDragging && (
                  <motion.span
                    key={`${square}-${piece.type}-${piece.color}-${game.fen()}`}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25, duration: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-[2.8rem] select-none z-10 cursor-grab active:cursor-grabbing"
                    style={{
                      color: piece.color === "w" ? "#FFFFFF" : "#111111",
                      textShadow: piece.color === "w"
                        ? "0 0 4px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.8), 1px 0 1px rgba(0,0,0,0.6), -1px 0 1px rgba(0,0,0,0.6)"
                        : "0 0 4px rgba(255,255,255,0.9), 0 1px 2px rgba(255,255,255,0.7), 1px 0 1px rgba(255,255,255,0.5), -1px 0 1px rgba(255,255,255,0.5)",
                    }}
                    whileHover={{ scale: 1.15, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {PIECE_UNICODE[`${piece.color}${piece.type}`]}
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Floating drag piece */}
      {dragSquare && dragPiece && dragPos && (
        <div
          className="fixed pointer-events-none z-50 text-[3.5rem]"
          style={{
            left: dragPos.x - 28,
            top: dragPos.y - 28,
            color: dragPiece.color === "w" ? "#FFFFFF" : "#111111",
            textShadow: dragPiece.color === "w"
              ? "0 0 8px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8)"
              : "0 0 8px rgba(255,255,255,0.9), 0 2px 4px rgba(255,255,255,0.7)",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
          }}
        >
          {PIECE_UNICODE[`${dragPiece.color}${dragPiece.type}`]}
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
