"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import styles from "./TetrisGame.module.css";

// ─── Constants ─────────────────────────────────────
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const WIN_ROWS = 5;
const TICK_MS = 500;

// ─── Tetromino definitions ──────────────────────────
const PIECES = {
  I: { shape: [[1,1,1,1]], color: "#00d4ff" },
  O: { shape: [[1,1],[1,1]], color: "#ffd600" },
  T: { shape: [[0,1,0],[1,1,1]], color: "#c678ff" },
  S: { shape: [[0,1,1],[1,1,0]], color: "#38ef7d" },
  Z: { shape: [[1,1,0],[0,1,1]], color: "#ff2d6b" },
  J: { shape: [[1,0,0],[1,1,1]], color: "#4776e6" },
  L: { shape: [[0,0,1],[1,1,1]], color: "#ff8c00" },
} as const;

type PieceKey = keyof typeof PIECES;

interface Piece {
  key: PieceKey;
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

type Board = (string | null)[][];

function emptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

function randomPiece(): Piece {
  const keys = Object.keys(PIECES) as PieceKey[];
  const key = keys[Math.floor(Math.random() * keys.length)];
  const { shape, color } = PIECES[key];
  return {
    key,
    shape: shape.map(r => [...r]),
    color,
    x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
    y: 0,
  };
}

function rotate(shape: number[][]): number[][] {
  const rows = shape.length, cols = shape[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

function isValid(board: Board, piece: Piece): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const nx = piece.x + c;
      const ny = piece.y + r;
      if (nx < 0 || nx >= BOARD_WIDTH || ny >= BOARD_HEIGHT) return false;
      if (ny >= 0 && board[ny][nx] !== null) return false;
    }
  }
  return true;
}

function placePiece(board: Board, piece: Piece): Board {
  const newBoard = board.map(r => [...r]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const nx = piece.x + c;
      const ny = piece.y + r;
      if (ny >= 0) newBoard[ny][nx] = piece.color;
    }
  }
  return newBoard;
}

function clearLines(board: Board): { board: Board; cleared: number } {
  const remaining = board.filter(row => row.some(cell => cell === null));
  const cleared = BOARD_HEIGHT - remaining.length;
  const newRows: (string | null)[][] = Array.from({ length: cleared }, () => Array(BOARD_WIDTH).fill(null));
  return { board: [...newRows, ...remaining], cleared };
}

function getGhostY(board: Board, piece: Piece): number {
  let gy = piece.y;
  while (isValid(board, { ...piece, y: gy + 1 })) gy++;
  return gy;
}

// ─── Component ──────────────────────────────────────
interface TetrisGameProps {
  onWin: () => void;
}

export default function TetrisGame({ onWin }: TetrisGameProps) {
  const [board, setBoard] = useState<Board>(emptyBoard());
  const [current, setCurrent] = useState<Piece | null>(null);
  const [next, setNext] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [clearedRows, setClearedRows] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const boardRef = useRef(board);
  const currentRef = useRef(current);
  const clearedRef = useRef(clearedRows);
  const runningRef = useRef(running);

  boardRef.current = board;
  currentRef.current = current;
  clearedRef.current = clearedRows;
  runningRef.current = running;

  const spawnPiece = useCallback((nextPiece: Piece, boardState: Board) => {
    if (!isValid(boardState, nextPiece)) {
      setGameOver(true);
      setRunning(false);
      return;
    }
    setCurrent(nextPiece);
    setNext(randomPiece());
  }, []);

  const lockAndSpawn = useCallback((boardState: Board, piece: Piece, nextPiece: Piece) => {
    const placed = placePiece(boardState, piece);
    const { board: cleared, cleared: numCleared } = clearLines(placed);

    setBoard(cleared);

    if (numCleared > 0) {
      setScore(s => s + numCleared * 100);
      const newTotal = clearedRef.current + numCleared;
      setClearedRows(newTotal);

      if (newTotal >= WIN_ROWS) {
        setWon(true);
        setRunning(false);
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#ff2d6b", "#a855f7", "#38bdf8", "#ffd600"],
        });
        setTimeout(() => onWin(), 2500);
        return;
      }
    }

    spawnPiece(nextPiece, cleared);
  }, [spawnPiece, onWin]);

  // Tick (auto drop)
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const cur = currentRef.current;
      const brd = boardRef.current;
      if (!cur) return;
      const dropped = { ...cur, y: cur.y + 1 };
      if (isValid(brd, dropped)) {
        setCurrent(dropped);
      } else {
        lockAndSpawn(brd, cur, next!);
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running, next, lockAndSpawn]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!runningRef.current || !currentRef.current) return;
      const cur = currentRef.current;
      const brd = boardRef.current;

      if (e.key === "ArrowLeft") {
        const moved = { ...cur, x: cur.x - 1 };
        if (isValid(brd, moved)) setCurrent(moved);
      } else if (e.key === "ArrowRight") {
        const moved = { ...cur, x: cur.x + 1 };
        if (isValid(brd, moved)) setCurrent(moved);
      } else if (e.key === "ArrowUp" || e.key === "x") {
        const rotated = { ...cur, shape: rotate(cur.shape) };
        if (isValid(brd, rotated)) setCurrent(rotated);
      } else if (e.key === "ArrowDown") {
        const dropped = { ...cur, y: cur.y + 1 };
        if (isValid(brd, dropped)) setCurrent(dropped);
        else lockAndSpawn(brd, cur, next!);
      } else if (e.key === " ") {
        e.preventDefault();
        const gy = getGhostY(brd, cur);
        const landed = { ...cur, y: gy };
        lockAndSpawn(brd, landed, next!);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, lockAndSpawn]);

  const startGame = () => {
    const b = emptyBoard();
    const first = randomPiece();
    const second = randomPiece();
    setBoard(b);
    setScore(0);
    setClearedRows(0);
    setGameOver(false);
    setWon(false);
    setCurrent(first);
    setNext(second);
    setRunning(true);
  };

  // Mobile controls
  const moveLeft  = () => { const cur = currentRef.current; const brd = boardRef.current; if (!cur) return; const m = { ...cur, x: cur.x - 1 }; if (isValid(brd, m)) setCurrent(m); };
  const moveRight = () => { const cur = currentRef.current; const brd = boardRef.current; if (!cur) return; const m = { ...cur, x: cur.x + 1 }; if (isValid(brd, m)) setCurrent(m); };
  const rotatePiece = () => { const cur = currentRef.current; const brd = boardRef.current; if (!cur) return; const m = { ...cur, shape: rotate(cur.shape) }; if (isValid(brd, m)) setCurrent(m); };
  const softDrop  = () => { const cur = currentRef.current; const brd = boardRef.current; if (!cur) return; const d = { ...cur, y: cur.y + 1 }; if (isValid(brd, d)) setCurrent(d); else lockAndSpawn(brd, cur, next!); };

  // Build display board (board + ghost + current piece)
  const displayBoard = board.map(r => [...r]);
  if (current) {
    const gy = getGhostY(board, current);
    // Draw ghost
    for (let r = 0; r < current.shape.length; r++) {
      for (let c = 0; c < current.shape[r].length; c++) {
        if (!current.shape[r][c]) continue;
        const nx = current.x + c;
        const ny = gy + r;
        if (ny >= 0 && ny < BOARD_HEIGHT && nx >= 0 && nx < BOARD_WIDTH) {
          if (!displayBoard[ny][nx]) displayBoard[ny][nx] = "__ghost__";
        }
      }
    }
    // Draw current piece
    for (let r = 0; r < current.shape.length; r++) {
      for (let c = 0; c < current.shape[r].length; c++) {
        if (!current.shape[r][c]) continue;
        const nx = current.x + c;
        const ny = current.y + r;
        if (ny >= 0 && ny < BOARD_HEIGHT && nx >= 0 && nx < BOARD_WIDTH) {
          displayBoard[ny][nx] = current.color;
        }
      }
    }
  }

  // Next piece display (4×4 grid)
  const nextGrid = Array.from({ length: 4 }, () => Array(4).fill(null) as (string | null)[]);
  if (next) {
    const offsetR = Math.floor((4 - next.shape.length) / 2);
    const offsetC = Math.floor((4 - next.shape[0].length) / 2);
    for (let r = 0; r < next.shape.length; r++) {
      for (let c = 0; c < next.shape[r].length; c++) {
        if (next.shape[r][c]) nextGrid[offsetR + r][offsetC + c] = next.color;
      }
    }
  }

  const progressPct = Math.min((clearedRows / WIN_ROWS) * 100, 100);

  return (
    <div className={styles.screen}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Тетрис</h1>
        <p className={styles.subtitle}>
          Бидний хамгийн нандин дурсамжуудыг нээхийн тулд {WIN_ROWS} мөрийг устгаарай
        </p>
      </header>

      <div className={styles.layout}>
        {/* Left column */}
        <div className={styles.leftCol}>
          <div className={`${styles.panel} ${styles.scorePanel}`}>
            <div className={styles.panelLabel}>Оноо</div>
            <div className={styles.scoreValue}>{String(score).padStart(4, "0")}</div>
          </div>

          <div className={`${styles.panel} ${styles.rowsPanel}`}>
            <div className={styles.panelLabel}>Устгасан мөр</div>
            <div className={styles.rowsValue}>
              {clearedRows}/{WIN_ROWS}
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Board */}
        <div className={styles.boardWrapper}>
          <div
            className={styles.board}
            style={{ gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)` }}
          >
            {displayBoard.map((row, ri) =>
              row.map((cell, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  className={`${styles.cell} ${cell && cell !== "__ghost__" ? styles.filled : ""} ${cell === "__ghost__" ? styles.ghost : ""}`}
                  style={
                    cell && cell !== "__ghost__"
                      ? { backgroundColor: cell, borderColor: "rgba(0,0,0,0.25)" }
                      : cell === "__ghost__"
                      ? { backgroundColor: "rgba(255,45,107,0.08)", borderColor: "rgba(255,45,107,0.15)" }
                      : {}
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          <div className={`${styles.panel} ${styles.nextPanel}`}>
            <div className={styles.panelLabel}>Дараагийн дүрс</div>
            <div className={styles.nextGrid}>
              {nextGrid.map((row, ri) =>
                row.map((cell, ci) => (
                  <div
                    key={`next-${ri}-${ci}`}
                    className={styles.nextCell}
                    style={
                      cell
                        ? {
                            backgroundColor: cell,
                            border: "0.5px solid rgba(0,0,0,0.3)",
                            boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.15)",
                          }
                        : {}
                    }
                  />
                ))
              )}
            </div>
          </div>

          <div className={`${styles.panel} ${styles.controlsPanel}`}>
            <div className={styles.panelLabel}>Удирдлага</div>
            <div className={styles.controlsGrid}>
              <button className={styles.controlBtn} onClick={moveLeft} aria-label="Зүүн тийш">←</button>
              <button className={styles.controlBtn} onClick={rotatePiece} aria-label="Эргүүлэх">↻</button>
              <button className={styles.controlBtn} onClick={moveRight} aria-label="Баруун тийш">→</button>
              <button className={`${styles.controlBtn} ${styles.controlBtnWide}`} onClick={softDrop} aria-label="Доош">↓</button>
            </div>
          </div>

          <button
            className={styles.startBtn}
            onClick={startGame}
            id="tetris-start-btn"
          >
            ▶ {running ? "Дахин эхлэх" : gameOver ? "Дахин тоглох" : "Эхлэх"}
          </button>
        </div>
      </div>

      {/* Win overlay */}
      {won && (
        <div className={styles.overlay}>
          <div className={styles.overlayCard}>
            <div className={styles.overlayTitle}>🎉 Амжилттай!</div>
            <p className={styles.overlayText}>
              {WIN_ROWS} мөрийг устгалаа!<br />Одоо нандин дурсамжуудыг нээж байна...
            </p>
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {gameOver && !won && (
        <div className={styles.overlay}>
          <div className={styles.overlayCard}>
            <div className={styles.overlayTitle}>Тоглоом дууслаа</div>
            <p className={styles.overlayText}>
              Оноо: {score} | Устгасан мөр: {clearedRows}/{WIN_ROWS}
            </p>
            <div className={styles.overlayBtns}>
              <button className="btn-primary" onClick={startGame}>Дахин тоглох</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
