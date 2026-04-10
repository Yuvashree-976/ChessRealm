import { Chess, Move } from "chess.js";

// Piece values for evaluation
const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3.25, r: 5, q: 9, k: 0,
};

// Simple position tables for piece-square evaluation
const PAWN_TABLE = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
  0.1, 0.1, 0.2, 0.3, 0.3, 0.2, 0.1, 0.1,
  0.05, 0.05, 0.1, 0.25, 0.25, 0.1, 0.05, 0.05,
  0, 0, 0, 0.2, 0.2, 0, 0, 0,
  0.05, -0.05, -0.1, 0, 0, -0.1, -0.05, 0.05,
  0.05, 0.1, 0.1, -0.2, -0.2, 0.1, 0.1, 0.05,
  0, 0, 0, 0, 0, 0, 0, 0,
];

const KNIGHT_TABLE = [
  -0.5, -0.4, -0.3, -0.3, -0.3, -0.3, -0.4, -0.5,
  -0.4, -0.2, 0, 0, 0, 0, -0.2, -0.4,
  -0.3, 0, 0.1, 0.15, 0.15, 0.1, 0, -0.3,
  -0.3, 0.05, 0.15, 0.2, 0.2, 0.15, 0.05, -0.3,
  -0.3, 0, 0.15, 0.2, 0.2, 0.15, 0, -0.3,
  -0.3, 0.05, 0.1, 0.15, 0.15, 0.1, 0.05, -0.3,
  -0.4, -0.2, 0, 0.05, 0.05, 0, -0.2, -0.4,
  -0.5, -0.4, -0.3, -0.3, -0.3, -0.3, -0.4, -0.5,
];

function evaluateBoard(game: Chess): number {
  if (game.isCheckmate()) return game.turn() === "w" ? -100 : 100;
  if (game.isDraw() || game.isStalemate()) return 0;

  let score = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (!piece) continue;
      const value = PIECE_VALUES[piece.type] || 0;
      const posBonus = piece.type === "p" ? PAWN_TABLE[piece.color === "w" ? r * 8 + f : (7 - r) * 8 + f] :
                       piece.type === "n" ? KNIGHT_TABLE[piece.color === "w" ? r * 8 + f : (7 - r) * 8 + f] : 0;
      score += piece.color === "w" ? (value + posBonus) : -(value + posBonus);
    }
  }
  return score;
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
  if (depth === 0 || game.isGameOver()) return evaluateBoard(game);

  const moves = game.moves();
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const eval_ = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const eval_ = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, eval_);
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getBotMove(game: Chess, depth: number): Move | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Depth 0 = random
  if (depth === 0) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const isMaximizing = game.turn() === "w";
  let bestMove = moves[0];
  let bestEval = isMaximizing ? -Infinity : Infinity;

  for (const move of moves) {
    game.move(move);
    const eval_ = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
    game.undo();

    if (isMaximizing ? eval_ > bestEval : eval_ < bestEval) {
      bestEval = eval_;
      bestMove = move;
    }
  }

  // Add slight randomness for lower depths
  if (depth <= 2 && Math.random() < 0.15) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  return bestMove;
}

// Analyze a completed game: return evaluation score for each position
export function analyzeGame(fens: string[]): number[] {
  return fens.map(fen => {
    const g = new Chess(fen);
    return parseFloat(evaluateBoard(g).toFixed(1));
  });
}
