import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  useWindowStore,
  type WindowInstance,
} from "../../core/state/useWindowStore";
import { useNotificationStore } from "../../core/state/useNotificationStore";
import "./SnakeGame.css";

/* ═══════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════ */
const CELL = 20;
const BASE_SPEED = 120; // ms per tick at level 1
const MIN_SPEED = 50; // fastest possible
const SPEED_STEP = 8; // ms reduction per level
const POINTS_PER_LEVEL = 50;
const COMBO_WINDOW = 1500; // ms to chain combos
const LS_KEY = "webos-snake-highscore";

type GameState = "idle" | "playing" | "paused" | "gameover";

interface FoodItem {
  x: number;
  y: number;
  type: "apple" | "star" | "diamond";
  pts: number;
  spawnedAt: number;
  ttl: number | null; // ms, null = permanent
}

/* ═══════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════ */
function randomFood(
  cols: number,
  rows: number,
  snake: { x: number; y: number }[],
  now: number,
): FoodItem {
  const rand = Math.random();
  let type: FoodItem["type"] = "apple";
  let pts = 10;
  let ttl: number | null = null;

  if (rand > 0.92) {
    type = "diamond";
    pts = 50;
    ttl = 5000;
  } else if (rand > 0.78) {
    type = "star";
    pts = 25;
    ttl = 8000;
  }

  let x: number, y: number;
  do {
    x = Math.floor(Math.random() * cols);
    y = Math.floor(Math.random() * rows);
  } while (snake.some((s) => s.x === x && s.y === y));

  return { x, y, type, pts, spawnedAt: now, ttl };
}

/* Particle for eating effect */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

function spawnParticles(cx: number, cy: number, color: string): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
    const speed = 1.5 + Math.random() * 3;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 20 + Math.random() * 15,
      color,
      size: 2 + Math.random() * 3,
    });
  }
  return particles;
}

/* ═══════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════ */
export const SnakeGame: React.FC<{ window: WindowInstance }> = ({
  window: win,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const focusedWindowId = useWindowStore((s) => s.focusedWindowId);

  // Game state
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [level, setLevel] = useState(1);
  const [comboText, setComboText] = useState<string | null>(null);
  const [flashType, setFlashType] = useState<"none" | "eat" | "die">("none");
  const [newRecord, setNewRecord] = useState(false);
  const [finalStats, setFinalStats] = useState({
    score: 0,
    length: 1,
    level: 1,
    time: 0,
  });

  const addGlobalNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  // Refs for game loop
  const snakeRef = useRef([{ x: 5, y: 5 }]);
  const dirRef = useRef({ dx: 1, dy: 0 });
  const nextDirRef = useRef({ dx: 1, dy: 0 }); // buffered input
  const foodRef = useRef<FoodItem>({
    x: 10,
    y: 10,
    type: "apple",
    pts: 10,
    spawnedAt: 0,
    ttl: null,
  });
  const lastTickRef = useRef(0);
  const rafRef = useRef(0);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const comboCountRef = useRef(0);
  const lastEatTimeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef(0);
  const gridRef = useRef({ cols: 20, rows: 20 });
  const gameStateRef = useRef<GameState>("idle");

  // Sync refs
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  /* ─── Resize canvas to container ─── */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const w = Math.floor(width);
      const h = Math.floor(height);
      canvas.width = w;
      canvas.height = h;
      const cols = Math.floor(w / CELL);
      const rows = Math.floor(h / CELL);
      gridRef.current = { cols: Math.max(cols, 5), rows: Math.max(rows, 5) };

      // Clamp food
      const f = foodRef.current;
      if (f.x >= cols || f.y >= rows) {
        f.x = Math.min(f.x, cols - 1);
        f.y = Math.min(f.y, rows - 1);
      }
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  /* ─── Game loop ─── */
  useEffect(() => {
    if (gameState !== "playing") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    if (focusedWindowId !== win.id) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const speed = () =>
      Math.max(MIN_SPEED, BASE_SPEED - (levelRef.current - 1) * SPEED_STEP);

    const tick = (now: number) => {
      if (gameStateRef.current !== "playing") return;

      // --- Update particles ---
      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life + 1,
          vy: p.vy + 0.08,
        }))
        .filter((p) => p.life < p.maxLife);

      if (now - lastTickRef.current >= speed()) {
        lastTickRef.current = now;

        // Apply buffered direction
        const nd = nextDirRef.current;
        if (nd.dx !== -dirRef.current.dx || nd.dy !== -dirRef.current.dy) {
          dirRef.current = nd;
        }

        const snake = [...snakeRef.current];
        const head = {
          x: snake[0].x + dirRef.current.dx,
          y: snake[0].y + dirRef.current.dy,
        };
        const { cols, rows } = gridRef.current;

        // Wall collision
        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
          endGame(now);
          return;
        }
        // Self collision
        if (snake.some((s) => s.x === head.x && s.y === head.y)) {
          endGame(now);
          return;
        }

        snake.unshift(head);

        // Food collision
        const food = foodRef.current;
        if (head.x === food.x && head.y === food.y) {
          const newScore = scoreRef.current + food.pts;
          scoreRef.current = newScore;
          setScore(newScore);

          // Combo
          if (now - lastEatTimeRef.current < COMBO_WINDOW) {
            comboCountRef.current++;
            if (comboCountRef.current >= 2) {
              setComboText(`COMBO x${comboCountRef.current}!`);
              setTimeout(() => setComboText(null), 800);
            }
          } else {
            comboCountRef.current = 1;
          }
          lastEatTimeRef.current = now;

          // Level
          const newLevel = Math.floor(newScore / POINTS_PER_LEVEL) + 1;
          if (newLevel !== levelRef.current) {
            levelRef.current = newLevel;
            setLevel(newLevel);
          }

          // Particles
          const pColor =
            food.type === "diamond"
              ? "#00c8ff"
              : food.type === "star"
                ? "#ffd700"
                : "#ff4444";
          particlesRef.current.push(
            ...spawnParticles(
              food.x * CELL + CELL / 2,
              food.y * CELL + CELL / 2,
              pColor,
            ),
          );

          // Flash
          setFlashType("eat");
          setTimeout(() => setFlashType("none"), 200);

          // New food
          foodRef.current = randomFood(cols, rows, snake, now);
        } else {
          snake.pop();

          // Food TTL
          if (food.ttl !== null && now - food.spawnedAt > food.ttl) {
            foodRef.current = randomFood(cols, rows, snake, now);
          }
        }

        snakeRef.current = snake;
      }

      // ─── RENDER ───
      render(ctx, canvas.width, canvas.height, now);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, focusedWindowId, win.id]);

  /* ─── Render function ─── */
  const render = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, now: number) => {
      const { cols, rows } = gridRef.current;

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, "#0a0e27");
      bgGrad.addColorStop(0.5, "#111633");
      bgGrad.addColorStop(1, "#0d1117");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(0,255,136,0.04)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL, 0);
        ctx.lineTo(x * CELL, rows * CELL);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL);
        ctx.lineTo(cols * CELL, y * CELL);
        ctx.stroke();
      }

      // Boundary glow
      const pulse = 0.3 + Math.sin(now / 400) * 0.15;
      ctx.strokeStyle = `rgba(0,255,136,${pulse})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, cols * CELL - 2, rows * CELL - 2);

      // ─── Food ───
      const food = foodRef.current;
      const fx = food.x * CELL + CELL / 2;
      const fy = food.y * CELL + CELL / 2;

      // Blink effect for timed food
      let drawFood = true;
      if (food.ttl !== null) {
        const remaining = food.ttl - (now - food.spawnedAt);
        if (remaining < 2000 && Math.floor(now / 100) % 2 === 0)
          drawFood = false;
      }

      if (drawFood) {
        const foodColors: Record<
          FoodItem["type"],
          { fill: string; glow: string }
        > = {
          apple: { fill: "#ff4444", glow: "rgba(255,68,68,0.5)" },
          star: { fill: "#ffd700", glow: "rgba(255,215,0,0.5)" },
          diamond: { fill: "#00c8ff", glow: "rgba(0,200,255,0.5)" },
        };
        const fc = foodColors[food.type];

        // Glow
        ctx.shadowColor = fc.glow;
        ctx.shadowBlur = 12 + Math.sin(now / 200) * 4;
        ctx.fillStyle = fc.fill;
        ctx.beginPath();

        if (food.type === "diamond") {
          // Diamond shape
          ctx.moveTo(fx, fy - CELL / 2 + 2);
          ctx.lineTo(fx + CELL / 2 - 2, fy);
          ctx.lineTo(fx, fy + CELL / 2 - 2);
          ctx.lineTo(fx - CELL / 2 + 2, fy);
          ctx.closePath();
        } else if (food.type === "star") {
          // Star shape
          for (let i = 0; i < 5; i++) {
            const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const innerAngle = outerAngle + Math.PI / 5;
            const outerR = CELL / 2 - 1;
            const innerR = CELL / 4;
            if (i === 0)
              ctx.moveTo(
                fx + Math.cos(outerAngle) * outerR,
                fy + Math.sin(outerAngle) * outerR,
              );
            else
              ctx.lineTo(
                fx + Math.cos(outerAngle) * outerR,
                fy + Math.sin(outerAngle) * outerR,
              );
            ctx.lineTo(
              fx + Math.cos(innerAngle) * innerR,
              fy + Math.sin(innerAngle) * innerR,
            );
          }
          ctx.closePath();
        } else {
          // Circle apple
          ctx.arc(fx, fy, CELL / 2 - 2, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ─── Snake ───
      const snake = snakeRef.current;
      const len = snake.length;
      snake.forEach((seg, i) => {
        const t = 1 - i / Math.max(len, 1);
        const r = Math.floor(0 + t * 0);
        const g = Math.floor(180 + t * 75);
        const b = Math.floor(100 + t * 36);
        const alpha = 0.6 + t * 0.4;

        const sx = seg.x * CELL;
        const sy = seg.y * CELL;
        const radius = 4;

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

        if (i === 0) {
          // Head — brighter with glow
          ctx.shadowColor = "rgba(0,255,136,0.7)";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#4ade80";
        }

        // Rounded rect
        ctx.beginPath();
        ctx.moveTo(sx + radius, sy);
        ctx.lineTo(sx + CELL - 1 - radius, sy);
        ctx.quadraticCurveTo(sx + CELL - 1, sy, sx + CELL - 1, sy + radius);
        ctx.lineTo(sx + CELL - 1, sy + CELL - 1 - radius);
        ctx.quadraticCurveTo(
          sx + CELL - 1,
          sy + CELL - 1,
          sx + CELL - 1 - radius,
          sy + CELL - 1,
        );
        ctx.lineTo(sx + radius, sy + CELL - 1);
        ctx.quadraticCurveTo(sx, sy + CELL - 1, sx, sy + CELL - 1 - radius);
        ctx.lineTo(sx, sy + radius);
        ctx.quadraticCurveTo(sx, sy, sx + radius, sy);
        ctx.closePath();
        ctx.fill();

        if (i === 0) {
          ctx.shadowBlur = 0;
          // Eyes
          const dir = dirRef.current;
          const eyeOffX = dir.dx * 3;
          const eyeOffY = dir.dy * 3;
          const cx = sx + CELL / 2;
          const cy = sy + CELL / 2;

          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(cx - 3 + eyeOffX, cy - 3 + eyeOffY, 2.5, 0, Math.PI * 2);
          ctx.arc(cx + 3 + eyeOffX, cy - 3 + eyeOffY, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#0a0e27";
          ctx.beginPath();
          ctx.arc(
            cx - 3 + eyeOffX * 1.2,
            cy - 3 + eyeOffY * 1.2,
            1.2,
            0,
            Math.PI * 2,
          );
          ctx.arc(
            cx + 3 + eyeOffX * 1.2,
            cy - 3 + eyeOffY * 1.2,
            1.2,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      });

      // ─── Particles ───
      particlesRef.current.forEach((p) => {
        const t = 1 - p.life / p.maxLife;
        ctx.globalAlpha = t;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * t, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    },
    [],
  );

  /* ─── End game ─── */
  const endGame = useCallback(
    (now: number) => {
      const s = scoreRef.current;
      const isNew = s > highScore;
      if (isNew && s > 0) {
        localStorage.setItem(LS_KEY, String(s));
        setHighScore(s);
        setNewRecord(true);
        addGlobalNotification(
          "New High Score! 🐍",
          `Incredible! You reached a new record score of ${s} in Snake.`,
          "success",
          "Snake Cyberpunk",
        );
      } else {
        setNewRecord(false);
        addGlobalNotification(
          "Game Over 💀",
          `You crashed! Final score: ${s}`,
          "warning",
          "Snake Cyberpunk",
        );
      }
      setFinalStats({
        score: s,
        length: snakeRef.current.length,
        level: levelRef.current,
        time: Math.floor((now - startTimeRef.current) / 1000),
      });
      setFlashType("die");
      setTimeout(() => setFlashType("none"), 300);
      setGameState("gameover");
    },
    [highScore, addGlobalNotification],
  );

  /* ─── Start / Restart ─── */
  const startGame = useCallback(() => {
    const { cols, rows } = gridRef.current;
    snakeRef.current = [{ x: Math.floor(cols / 4), y: Math.floor(rows / 2) }];
    dirRef.current = { dx: 1, dy: 0 };
    nextDirRef.current = { dx: 1, dy: 0 };
    scoreRef.current = 0;
    levelRef.current = 1;
    comboCountRef.current = 0;
    particlesRef.current = [];
    foodRef.current = randomFood(
      cols,
      rows,
      snakeRef.current,
      performance.now(),
    );
    startTimeRef.current = performance.now();
    setScore(0);
    setLevel(1);
    setComboText(null);
    setNewRecord(false);
    setGameState("playing");
  }, []);

  /* ─── Input handling ─── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (focusedWindowId !== win.id) return;

      // Prevent page scroll
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Space: start / pause / restart
      if (e.key === " ") {
        if (
          gameStateRef.current === "idle" ||
          gameStateRef.current === "gameover"
        ) {
          startGame();
        }
        return;
      }

      if (gameStateRef.current !== "playing") return;

      const cur = dirRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (cur.dy !== 1) nextDirRef.current = { dx: 0, dy: -1 };
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (cur.dy !== -1) nextDirRef.current = { dx: 0, dy: 1 };
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (cur.dx !== 1) nextDirRef.current = { dx: -1, dy: 0 };
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (cur.dx !== -1) nextDirRef.current = { dx: 1, dy: 0 };
          break;
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [focusedWindowId, win.id, startGame]);

  /* ─── D-Pad handler ─── */
  const handleDpad = useCallback((dx: number, dy: number) => {
    if (gameStateRef.current !== "playing") return;
    const cur = dirRef.current;
    if (dx !== -cur.dx || dy !== -cur.dy) {
      nextDirRef.current = { dx, dy };
    }
  }, []);

  /* ─── Pause when losing focus ─── */
  const isPaused = gameState === "playing" && focusedWindowId !== win.id;

  /* ─── Render idle canvas background ─── */
  useEffect(() => {
    if (gameState !== "idle" && gameState !== "gameover") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const draw = (now: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, "#0a0e27");
      bgGrad.addColorStop(0.5, "#111633");
      bgGrad.addColorStop(1, "#0d1117");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Animated grid
      const { cols, rows } = gridRef.current;
      const pulse = 0.03 + Math.sin(now / 1000) * 0.015;
      ctx.strokeStyle = `rgba(0,255,136,${pulse})`;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL, 0);
        ctx.lineTo(x * CELL, rows * CELL);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL);
        ctx.lineTo(cols * CELL, y * CELL);
        ctx.stroke();
      }

      // Animated snake demo (idle screen decoration)
      const t = now / 600;
      for (let i = 0; i < 8; i++) {
        const sx = Math.sin(t + i * 0.4) * (w * 0.15) + w / 2;
        const sy = Math.cos(t * 0.7 + i * 0.4) * (h * 0.1) + h / 2;
        const alpha = (1 - i / 8) * 0.3;
        ctx.fillStyle = `rgba(0,255,136,${alpha})`;
        ctx.beginPath();
        const r = 3;
        ctx.moveTo(sx + r, sy);
        ctx.lineTo(sx + CELL - 1 - r, sy);
        ctx.quadraticCurveTo(sx + CELL - 1, sy, sx + CELL - 1, sy + r);
        ctx.lineTo(sx + CELL - 1, sy + CELL - 1 - r);
        ctx.quadraticCurveTo(
          sx + CELL - 1,
          sy + CELL - 1,
          sx + CELL - 1 - r,
          sy + CELL - 1,
        );
        ctx.lineTo(sx + r, sy + CELL - 1);
        ctx.quadraticCurveTo(sx, sy + CELL - 1, sx, sy + CELL - 1 - r);
        ctx.lineTo(sx, sy + r);
        ctx.quadraticCurveTo(sx, sy, sx + r, sy);
        ctx.closePath();
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [gameState]);

  /* ─── Speed percentage for bar ─── */
  const currentSpeed = Math.max(
    MIN_SPEED,
    BASE_SPEED - (level - 1) * SPEED_STEP,
  );
  const speedPct = Math.round(
    ((BASE_SPEED - currentSpeed) / (BASE_SPEED - MIN_SPEED)) * 100,
  );

  return (
    <div className="snake-game-root">
      {/* ─── HUD ─── */}
      <div className="snake-hud">
        <div className="snake-hud-left">
          <div className="snake-hud-stat">
            <span className="snake-hud-label">Score</span>
            <span className="snake-hud-value">{score}</span>
          </div>
          <div className="snake-hud-stat">
            <span className="snake-hud-label">Best</span>
            <span className="snake-hud-value highscore">{highScore}</span>
          </div>
        </div>

        <div className="snake-hud-center">
          <span className="snake-level-badge">LVL {level}</span>
          {isPaused && <span className="snake-paused-tag">Paused</span>}
        </div>

        <div className="snake-hud-right">
          <div className="snake-hud-stat">
            <span className="snake-hud-label">Speed</span>
            <div className="snake-speed-bar">
              <div
                className="snake-speed-fill"
                style={{ width: `${speedPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Canvas Area ─── */}
      <div className="snake-canvas-area" ref={containerRef}>
        <canvas ref={canvasRef} />

        {/* Combo popup */}
        {comboText && <div className="snake-combo">{comboText}</div>}

        {/* Flash effects */}
        {flashType === "die" && <div className="snake-flash" />}
        {flashType === "eat" && <div className="snake-flash-eat" />}

        {/* ─── Start Screen ─── */}
        {gameState === "idle" && (
          <div className="snake-overlay">
            <div className="snake-title">SNAKE</div>
            <div className="snake-subtitle">Cyberpunk Edition</div>
            <button className="snake-play-btn" onClick={startGame}>
              Start Game
            </button>
            <div className="snake-start-prompt" style={{ marginTop: 16 }}>
              or press <kbd>SPACE</kbd>
            </div>
            <div className="snake-controls-hint">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd>
                <kbd>←</kbd>
                <kbd>→</kbd> or <kbd>W</kbd>
                <kbd>A</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd> to move
              </span>
            </div>
          </div>
        )}

        {/* ─── Game Over Screen ─── */}
        {gameState === "gameover" && (
          <div className="snake-overlay">
            <div className="snake-gameover-title">Game Over</div>
            <div className="snake-stats-grid">
              <div className="snake-stat-item">
                <span className="label">Score</span>
                <span className={`value ${newRecord ? "new-record" : ""}`}>
                  {finalStats.score}
                </span>
              </div>
              <div className="snake-stat-item">
                <span className="label">Best</span>
                <span className="value gold">{highScore}</span>
              </div>
              <div className="snake-stat-item">
                <span className="label">Length</span>
                <span className="value">{finalStats.length}</span>
              </div>
              <div className="snake-stat-item">
                <span className="label">Level</span>
                <span className="value">{finalStats.level}</span>
              </div>
              <div className="snake-stat-item">
                <span className="label">Time</span>
                <span className="value">{finalStats.time}s</span>
              </div>
              {newRecord && (
                <div className="snake-stat-item">
                  <span className="label">&nbsp;</span>
                  <span className="value new-record" style={{ fontSize: 14 }}>
                    🏆 NEW RECORD!
                  </span>
                </div>
              )}
            </div>
            <button className="snake-play-btn" onClick={startGame}>
              Play Again
            </button>
            <div className="snake-start-prompt" style={{ marginTop: 12 }}>
              or press <kbd>SPACE</kbd>
            </div>
          </div>
        )}

        {/* ─── Pause overlay ─── */}
        {isPaused && (
          <div
            className="snake-overlay"
            style={{ background: "rgba(10,14,39,0.7)" }}
          >
            <div
              className="snake-title"
              style={{ fontSize: "clamp(20px, 3vw, 36px)" }}
            >
              PAUSED
            </div>
            <div className="snake-start-prompt">Click window to resume</div>
          </div>
        )}

        {/* ─── Mobile D-Pad ─── */}
        <div className="snake-mobile-controls">
          <button
            className="snake-dpad-btn up"
            onPointerDown={() => handleDpad(0, -1)}
          >
            ▲
          </button>
          <button
            className="snake-dpad-btn left"
            onPointerDown={() => handleDpad(-1, 0)}
          >
            ◄
          </button>
          <button
            className="snake-dpad-btn right"
            onPointerDown={() => handleDpad(1, 0)}
          >
            ►
          </button>
          <button
            className="snake-dpad-btn down"
            onPointerDown={() => handleDpad(0, 1)}
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
};
