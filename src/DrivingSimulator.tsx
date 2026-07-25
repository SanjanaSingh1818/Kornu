import { useRef, useEffect, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   Kör Nu Trafikskola – Interactive Driving Simulator
   Canvas-based top-down driving game
   ═══════════════════════════════════════════════════ */

// ---------- types ----------
interface Vec { x: number; y: number }
interface Car { x: number; y: number; w: number; h: number; color: string; speed: number; lane: number; passed: boolean }
interface Scenery { x: number; y: number; type: "tree" | "building" | "lamp" | "sign"; side: "left" | "right"; h: number }
interface RoadMark { y: number }

type GameState = "menu" | "playing" | "paused" | "over";
type Mode = "city" | "motorway" | "night";

const MODES: { id: Mode; label: string; desc: string; emoji: string; speed: number; traffic: number }[] = [
  { id: "city", label: "Stadskörning", desc: "Göteborg centrum – 50 km/h", emoji: "🏙️", speed: 3, traffic: 0.012 },
  { id: "motorway", label: "Motorväg", desc: "E6 mot Malmö – 110 km/h", emoji: "🛣️", speed: 5.5, traffic: 0.008 },
  { id: "night", label: "Mörkerkörning", desc: "Natt i Västra Frölunda", emoji: "🌙", speed: 3.5, traffic: 0.015 },
];

const LANE_COUNT = 3;
const CAR_W = 38;
const CAR_H = 72;
const TRAFFIC_COLORS = ["#e74c3c", "#3498db", "#f39c12", "#2ecc71", "#9b59b6", "#1abc9c", "#e67e22", "#34495e"];

// ---------- helper ----------
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

export default function DrivingSimulator({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const stateRef = useRef<{
    state: GameState; mode: Mode;
    player: Vec & { targetX: number; speed: number; maxSpeed: number; steering: number };
    traffic: Car[]; scenery: Scenery[]; marks: RoadMark[];
    score: number; distance: number; combo: number;
    keys: Set<string>; roadScroll: number;
    W: number; H: number;
    roadL: number; roadR: number; laneW: number;
    shakeT: number; flashT: number;
    lastTraffic: number; lastScenery: number;
    touchL: boolean; touchR: boolean; touchBrake: boolean;
  } | null>(null);

  const [gameState, setGameState] = useState<GameState>("menu");
  const [mode, setMode] = useState<Mode>("city");
  const [finalScore, setFinalScore] = useState(0);
  const [finalDist, setFinalDist] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("kornu-sim-hi") || "0"); } catch { return 0; }
  });

  // ---------- init game ----------
  const startGame = useCallback((m: Mode) => {
    setMode(m);
    const canvas = canvasRef.current!;
    const W = canvas.width;
    const H = canvas.height;
    const roadW = Math.min(W * 0.55, 280);
    const roadL = (W - roadW) / 2;
    const roadR = roadL + roadW;
    const laneW = roadW / LANE_COUNT;

    stateRef.current = {
      state: "playing", mode: m,
      player: { x: roadL + laneW * 1 + laneW / 2, y: H - 120, targetX: roadL + laneW * 1 + laneW / 2, speed: MODES.find(x => x.id === m)!.speed, maxSpeed: MODES.find(x => x.id === m)!.speed * 1.6, steering: 0 },
      traffic: [], scenery: [], marks: [],
      score: 0, distance: 0, combo: 1,
      keys: new Set(), roadScroll: 0,
      W, H, roadL, roadR, laneW,
      shakeT: 0, flashT: 0,
      lastTraffic: 0, lastScenery: 0,
      touchL: false, touchR: false, touchBrake: false,
    };
    // init road marks
    for (let y = -40; y < H + 40; y += 50) {
      stateRef.current.marks.push({ y });
    }
    // init scenery
    for (let y = -200; y < H + 200; y += rand(80, 160)) {
      addScenery(stateRef.current, y, "left");
      addScenery(stateRef.current, y + rand(-40, 40), "right");
    }
    setGameState("playing");
  }, []);

  // ---------- add scenery ----------
  function addScenery(s: NonNullable<typeof stateRef.current>, y: number, side: "left" | "right") {
    const types: Scenery["type"][] = ["tree", "tree", "building", "lamp", "sign", "tree"];
    const type = types[Math.floor(Math.random() * types.length)];
    const offset = side === "left" ? rand(14, s.roadL - 20) : rand(s.roadR + 14, s.W - 20);
    s.scenery.push({ x: offset, y, type, side, h: type === "building" ? rand(60, 100) : rand(20, 36) });
  }

  // ---------- game loop ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas!.parentElement!.getBoundingClientRect();
      canvas!.width = Math.floor(rect.width * dpr);
      canvas!.height = Math.floor(rect.height * dpr);
      canvas!.style.width = rect.width + "px";
      canvas!.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // keys
    const onKeyDown = (e: KeyboardEvent) => {
      if (!stateRef.current) return;
      stateRef.current.keys.add(e.key);
      if (e.key === "Escape") {
        if (stateRef.current.state === "playing") { stateRef.current.state = "paused"; setGameState("paused"); }
        else if (stateRef.current.state === "paused") { stateRef.current.state = "playing"; setGameState("playing"); }
      }
      if (e.key === " " && stateRef.current.state === "over") startGame(stateRef.current.mode);
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => { stateRef.current?.keys.delete(e.key); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let lastTime = 0;
    function loop(time: number) {
      const dt = Math.min((time - lastTime) / 16.67, 3); // normalize to ~60fps
      lastTime = time;

      const W = canvas!.width / Math.min(window.devicePixelRatio, 2);
      const H = canvas!.height / Math.min(window.devicePixelRatio, 2);
      ctx.clearRect(0, 0, W, H);

      const s = stateRef.current;
      if (!s || s.state === "menu") {
        drawMenuBg(ctx, W, H, time);
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      // update dims
      s.W = W; s.H = H;
      const roadW = Math.min(W * 0.55, 280);
      s.roadL = (W - roadW) / 2;
      s.roadR = s.roadL + roadW;
      s.laneW = roadW / LANE_COUNT;

      if (s.state === "playing") {
        update(s, dt);
      }

      draw(ctx, s, time);
      frameRef.current = requestAnimationFrame(loop);
    }
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", resize);
    };
  }, [startGame]);

  // ---------- update ----------
  function update(s: NonNullable<typeof stateRef.current>, dt: number) {
    const k = s.keys;
    const modeConf = MODES.find(m => m.id === s.mode)!;

    // steering
    let steerInput = 0;
    if (k.has("ArrowLeft") || k.has("a") || k.has("A") || s.touchL) steerInput = -1;
    if (k.has("ArrowRight") || k.has("d") || k.has("D") || s.touchR) steerInput = 1;

    // speed
    if (k.has("ArrowUp") || k.has("w") || k.has("W")) {
      s.player.speed = Math.min(s.player.speed + 0.08 * dt, s.player.maxSpeed);
    } else if (k.has("ArrowDown") || k.has("s") || k.has("S") || s.touchBrake) {
      s.player.speed = Math.max(s.player.speed - 0.15 * dt, modeConf.speed * 0.3);
    } else {
      s.player.speed = lerp(s.player.speed, modeConf.speed, 0.02 * dt);
    }

    // move player
    s.player.steering = lerp(s.player.steering, steerInput * 4.5, 0.12 * dt);
    s.player.x = clamp(s.player.x + s.player.steering * dt, s.roadL + 12, s.roadR - 12);
    s.player.y = clamp(s.player.y, s.H * 0.55, s.H - 50);

    // road scroll
    s.roadScroll += s.player.speed * dt;
    s.distance += s.player.speed * dt * 0.15;

    // update road marks
    for (const m of s.marks) {
      m.y += s.player.speed * dt;
      if (m.y > s.H + 60) m.y -= s.H + 100;
    }

    // update scenery
    for (let i = s.scenery.length - 1; i >= 0; i--) {
      s.scenery[i].y += s.player.speed * dt;
      if (s.scenery[i].y > s.H + 200) s.scenery.splice(i, 1);
    }
    // spawn scenery
    s.lastScenery += dt;
    if (s.lastScenery > rand(3, 8)) {
      s.lastScenery = 0;
      addScenery(s, -rand(40, 120), Math.random() > 0.5 ? "left" : "right");
    }

    // update traffic
    for (let i = s.traffic.length - 1; i >= 0; i--) {
      const t = s.traffic[i];
      t.y += (s.player.speed - t.speed) * dt;

      // passed scoring
      if (!t.passed && t.y > s.player.y + CAR_H) {
        t.passed = true;
        s.score += 10 * s.combo;
        s.combo = Math.min(s.combo + 1, 8);
      }

      if (t.y > s.H + 120 || t.y < -200) {
        s.traffic.splice(i, 1);
        continue;
      }

      // collision
      if (boxCollide(s.player.x - CAR_W / 2, s.player.y - CAR_H / 2, CAR_W, CAR_H, t.x - t.w / 2, t.y - t.h / 2, t.w, t.h)) {
        s.state = "over";
        s.shakeT = 20;
        s.flashT = 15;
        setGameState("over");
        setFinalScore(Math.floor(s.score));
        setFinalDist(Math.floor(s.distance));
        if (Math.floor(s.score) > highScore) {
          setHighScore(Math.floor(s.score));
          try { localStorage.setItem("kornu-sim-hi", String(Math.floor(s.score))); } catch {}
        }
        return;
      }
    }

    // spawn traffic
    s.lastTraffic += dt;
    if (s.lastTraffic > 1 && Math.random() < modeConf.traffic * dt) {
      s.lastTraffic = 0;
      const lane = Math.floor(Math.random() * LANE_COUNT);
      const lx = s.roadL + lane * s.laneW + s.laneW / 2;
      // don't spawn on top of existing
      const tooClose = s.traffic.some(t => Math.abs(t.x - lx) < s.laneW * 0.8 && t.y < 80);
      if (!tooClose) {
        s.traffic.push({
          x: lx, y: -CAR_H - rand(10, 80),
          w: CAR_W - 4, h: CAR_H - 6,
          color: TRAFFIC_COLORS[Math.floor(Math.random() * TRAFFIC_COLORS.length)],
          speed: s.player.speed * rand(0.3, 0.75),
          lane, passed: false,
        });
      }
    }

    // timers
    if (s.shakeT > 0) s.shakeT -= dt;
    if (s.flashT > 0) s.flashT -= dt;
  }

  function boxCollide(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  // ---------- draw ----------
  function draw(ctx: CanvasRenderingContext2D, s: NonNullable<typeof stateRef.current>, time: number) {
    const { W, H, roadL, roadR, laneW } = s;
    const isNight = s.mode === "night";

    // shake
    let sx = 0, sy = 0;
    if (s.shakeT > 0) { sx = rand(-3, 3); sy = rand(-3, 3); }
    ctx.save();
    ctx.translate(sx, sy);

    // background
    if (isNight) {
      ctx.fillStyle = "#0a1628";
    } else {
      ctx.fillStyle = "#7cb342";
    }
    ctx.fillRect(0, 0, W, H);

    // grass texture stripes
    if (!isNight) {
      ctx.fillStyle = "#6da832";
      for (let y = (s.roadScroll * 0.5 % 30) - 30; y < H; y += 30) {
        ctx.fillRect(0, y, W, 14);
      }
    }

    // sidewalk
    const swW = 16;
    ctx.fillStyle = isNight ? "#1a2744" : "#bdbdbd";
    ctx.fillRect(roadL - swW, 0, swW, H);
    ctx.fillRect(roadR, 0, swW, H);

    // road
    ctx.fillStyle = isNight ? "#1e293b" : "#37474f";
    ctx.fillRect(roadL, 0, roadR - roadL, H);

    // road edge lines
    ctx.strokeStyle = isNight ? "#475569" : "#fff";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(roadL + 2, 0); ctx.lineTo(roadL + 2, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(roadR - 2, 0); ctx.lineTo(roadR - 2, H); ctx.stroke();

    // lane markings
    ctx.strokeStyle = isNight ? "#475569" : "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 22]);
    for (let i = 1; i < LANE_COUNT; i++) {
      const lx = roadL + i * laneW;
      ctx.lineDashOffset = -(s.roadScroll % 42);
      ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke();
    }
    ctx.setLineDash([]);

    // scenery
    for (const sc of s.scenery) {
      drawSceneryItem(ctx, sc, isNight);
    }

    // traffic cars
    for (const t of s.traffic) {
      drawCar(ctx, t.x, t.y, t.w, t.h, t.color, false, isNight);
    }

    // player car
    drawCar(ctx, s.player.x, s.player.y, CAR_W, CAR_H, "#ffffff", true, isNight, s.player.steering);

    // night overlay – headlight cone
    if (isNight) {
      // darken everything
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, W, H);

      // headlight cone
      const hlGrad = ctx.createRadialGradient(s.player.x, s.player.y - 20, 10, s.player.x, s.player.y - 180, 200);
      hlGrad.addColorStop(0, "rgba(255,255,200,0.45)");
      hlGrad.addColorStop(0.5, "rgba(255,255,200,0.15)");
      hlGrad.addColorStop(1, "rgba(255,255,200,0)");
      ctx.fillStyle = hlGrad;
      ctx.beginPath();
      ctx.moveTo(s.player.x - 8, s.player.y - 20);
      ctx.lineTo(s.player.x - 120, s.player.y - 360);
      ctx.lineTo(s.player.x + 120, s.player.y - 360);
      ctx.lineTo(s.player.x + 8, s.player.y - 20);
      ctx.closePath();
      ctx.fill();

      // dashboard glow
      const dgGrad = ctx.createRadialGradient(s.player.x, s.player.y + 20, 5, s.player.x, s.player.y + 20, 60);
      dgGrad.addColorStop(0, "rgba(16,185,129,0.2)");
      dgGrad.addColorStop(1, "rgba(16,185,129,0)");
      ctx.fillStyle = dgGrad;
      ctx.fillRect(s.player.x - 60, s.player.y - 10, 120, 80);
    }

    // flash on collision
    if (s.flashT > 0) {
      ctx.fillStyle = `rgba(239,68,68,${s.flashT / 15 * 0.4})`;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.restore();

    // ---- HUD ----
    drawHUD(ctx, s, W, H, time);
  }

  function drawCar(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, color: string, isPlayer: boolean, isNight: boolean, steering = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    if (isPlayer) ctx.rotate(steering * 0.03);

    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    roundRect(ctx, -w / 2 + 3, -h / 2 + 5, w, h, 8);
    ctx.fill();

    // body
    const bGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    bGrad.addColorStop(0, shadeColor(color, -20));
    bGrad.addColorStop(0.5, color);
    bGrad.addColorStop(1, shadeColor(color, -30));
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    roundRect(ctx, -w / 2, -h / 2, w, h, 8);
    ctx.fill();

    // roof / windshield
    ctx.fillStyle = isNight ? "rgba(100,180,255,0.25)" : "rgba(100,180,255,0.4)";
    ctx.beginPath();
    roundRect(ctx, -w / 2 + 5, -h / 2 + h * 0.22, w - 10, h * 0.32, 4);
    ctx.fill();

    // rear window
    ctx.fillStyle = isNight ? "rgba(80,140,200,0.2)" : "rgba(80,140,200,0.3)";
    ctx.beginPath();
    roundRect(ctx, -w / 2 + 6, -h / 2 + h * 0.6, w - 12, h * 0.18, 3);
    ctx.fill();

    // headlights
    if (isPlayer) {
      ctx.fillStyle = isNight ? "#fff9c4" : "#fff59d";
      ctx.shadowColor = isNight ? "#fff9c4" : "transparent";
      ctx.shadowBlur = isNight ? 12 : 0;
      ctx.fillRect(-w / 2 + 3, -h / 2 - 2, 8, 6);
      ctx.fillRect(w / 2 - 11, -h / 2 - 2, 8, 6);
      ctx.shadowBlur = 0;
    }

    // taillights
    ctx.fillStyle = "#ef5350";
    ctx.fillRect(-w / 2 + 3, h / 2 - 5, 8, 4);
    ctx.fillRect(w / 2 - 11, h / 2 - 5, 8, 4);
    if (!isPlayer) {
      ctx.shadowColor = "#ef5350";
      ctx.shadowBlur = 6;
      ctx.fillRect(-w / 2 + 3, h / 2 - 5, 8, 4);
      ctx.fillRect(w / 2 - 11, h / 2 - 5, 8, 4);
      ctx.shadowBlur = 0;
    }

    // wheels
    ctx.fillStyle = "#212121";
    ctx.fillRect(-w / 2 - 2, -h / 2 + 8, 5, 14);
    ctx.fillRect(w / 2 - 3, -h / 2 + 8, 5, 14);
    ctx.fillRect(-w / 2 - 2, h / 2 - 22, 5, 14);
    ctx.fillRect(w / 2 - 3, h / 2 - 22, 5, 14);

    // player KÖR NU label
    if (isPlayer) {
      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      roundRect(ctx, -w / 2 + 3, -h / 2 + h * 0.56, w - 6, 4, 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawSceneryItem(ctx: CanvasRenderingContext2D, sc: Scenery, isNight: boolean) {
    ctx.save();
    ctx.translate(sc.x, sc.y);

    if (sc.type === "tree") {
      // trunk
      ctx.fillStyle = isNight ? "#3e2723" : "#5d4037";
      ctx.fillRect(-3, -4, 6, 12);
      // canopy
      ctx.fillStyle = isNight ? "#1b4332" : "#43a047";
      ctx.beginPath();
      ctx.arc(0, -8, sc.h / 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isNight ? "#145a32" : "#2e7d32";
      ctx.beginPath();
      ctx.arc(-3, -6, sc.h / 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (sc.type === "building") {
      ctx.fillStyle = isNight ? "#1a2744" : "#78909c";
      ctx.fillRect(-18, -sc.h, 36, sc.h);
      // windows
      ctx.fillStyle = isNight ? "#ffd54f" : "#b0bec5";
      for (let wy = -sc.h + 8; wy < -6; wy += 16) {
        for (let wx = -12; wx <= 6; wx += 12) {
          ctx.fillRect(wx, wy, 6, 8);
        }
      }
    } else if (sc.type === "lamp") {
      ctx.fillStyle = isNight ? "#546e7a" : "#90a4ae";
      ctx.fillRect(-1.5, -28, 3, 28);
      ctx.fillStyle = isNight ? "#ffd54f" : "#e0e0e0";
      ctx.beginPath();
      ctx.arc(0, -30, 4, 0, Math.PI * 2);
      ctx.fill();
      if (isNight) {
        ctx.shadowColor = "#ffd54f";
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        // light pool
        const lg = ctx.createRadialGradient(0, 0, 2, 0, 0, 40);
        lg.addColorStop(0, "rgba(255,213,79,0.15)");
        lg.addColorStop(1, "rgba(255,213,79,0)");
        ctx.fillStyle = lg;
        ctx.fillRect(-40, -20, 80, 40);
      }
    } else if (sc.type === "sign") {
      ctx.fillStyle = isNight ? "#455a64" : "#78909c";
      ctx.fillRect(-1.5, -32, 3, 32);
      // sign face
      ctx.fillStyle = "#1565c0";
      ctx.beginPath();
      roundRect(ctx, -10, -40, 20, 14, 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 6px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("50", 0, -30);
    }

    ctx.restore();
  }

  function drawHUD(ctx: CanvasRenderingContext2D, s: NonNullable<typeof stateRef.current>, W: number, H: number, _time: number) {
    const kmh = Math.floor(s.player.speed * 18);
    const dist = Math.floor(s.distance);

    // top bar
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    roundRect(ctx, 10, 10, W - 20, 44, 12);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`⭐ ${Math.floor(s.score)}`, 22, 37);

    ctx.textAlign = "center";
    ctx.fillText(`${dist} m`, W / 2, 37);

    ctx.textAlign = "right";
    ctx.fillText(`${kmh} km/h`, W - 22, 37);

    // combo
    if (s.combo > 1 && s.state === "playing") {
      ctx.fillStyle = "#10B981";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`×${s.combo} COMBO`, 22, 22);
    }

    // speed bar
    const barW = 60;
    const barX = W - 22 - barW;
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    roundRect(ctx, barX, 18, barW, 5, 2.5);
    ctx.fill();
    const speedPct = clamp(s.player.speed / s.player.maxSpeed, 0, 1);
    const sBarColor = speedPct > 0.8 ? "#ef5350" : "#10B981";
    ctx.fillStyle = sBarColor;
    ctx.beginPath();
    roundRect(ctx, barX, 18, barW * speedPct, 5, 2.5);
    ctx.fill();

    // game over / paused overlay
    if (s.state === "over" || s.state === "paused") {
      ctx.fillStyle = "rgba(2,44,34,0.7)";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.font = "bold 28px Inter, sans-serif";
      ctx.fillText(s.state === "over" ? "Krock!" : "Pausad", W / 2, H / 2 - 50);

      if (s.state === "over") {
        ctx.font = "16px Inter, sans-serif";
        ctx.fillStyle = "#A7F3D0";
        ctx.fillText(`Poäng: ${Math.floor(s.score)}  •  Distans: ${dist} m`, W / 2, H / 2 - 16);

        ctx.font = "bold 14px Inter, sans-serif";
        ctx.fillStyle = "#10B981";
        ctx.fillText("Tryck SPACE eller knappen för att köra igen", W / 2, H / 2 + 24);
      } else {
        ctx.font = "14px Inter, sans-serif";
        ctx.fillStyle = "#A7F3D0";
        ctx.fillText("Tryck ESC för att fortsätta", W / 2, H / 2 - 10);
      }
    }
  }

  function drawMenuBg(ctx: CanvasRenderingContext2D, W: number, H: number, time: number) {
    ctx.fillStyle = "#064E3B";
    ctx.fillRect(0, 0, W, H);

    // animated road
    const roadW = Math.min(W * 0.4, 180);
    const rl = (W - roadW) / 2;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(rl, 0, roadW, H);

    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([16, 18]);
    ctx.lineDashOffset = -(time * 0.06 % 34);
    const cx = rl + roadW / 2;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.setLineDash([]);

    // scrolling dots as cars
    for (let i = 0; i < 3; i++) {
      const cy = ((time * 0.04 + i * 240) % (H + 100)) - 50;
      const lx = rl + (i === 0 ? roadW * 0.25 : i === 1 ? roadW * 0.75 : roadW * 0.5);
      ctx.fillStyle = i === 2 ? "#10B981" : "rgba(255,255,255,0.2)";
      ctx.beginPath();
      roundRect(ctx, lx - 8, cy - 16, 16, 32, 4);
      ctx.fill();
    }
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function shadeColor(color: string, percent: number) {
    const num = parseInt(color.replace("#", ""), 16);
    const r = clamp((num >> 16) + percent, 0, 255);
    const g = clamp(((num >> 8) & 0x00FF) + percent, 0, 255);
    const b = clamp((num & 0x0000FF) + percent, 0, 255);
    return `rgb(${r},${g},${b})`;
  }

  // ---------- touch controls ----------
  const touchStart = (dir: "left" | "right" | "brake") => {
    if (!stateRef.current) return;
    if (dir === "left") stateRef.current.touchL = true;
    if (dir === "right") stateRef.current.touchR = true;
    if (dir === "brake") stateRef.current.touchBrake = true;
  };
  const touchEnd = (dir: "left" | "right" | "brake") => {
    if (!stateRef.current) return;
    if (dir === "left") stateRef.current.touchL = false;
    if (dir === "right") stateRef.current.touchR = false;
    if (dir === "brake") stateRef.current.touchBrake = false;
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#022c22]">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-dark/90 px-4 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-primary-400">KÖR NU</span>
          <span className="text-xs font-bold text-white/50">SIMULATOR</span>
        </div>
        <div className="flex items-center gap-3">
          {gameState === "playing" && (
            <button onClick={() => { if (stateRef.current) { stateRef.current.state = "paused"; setGameState("paused"); } }}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70 hover:bg-white/20">
              ⏸ Paus
            </button>
          )}
          {gameState === "paused" && (
            <button onClick={() => { if (stateRef.current) { stateRef.current.state = "playing"; setGameState("playing"); } }}
              className="rounded-lg bg-primary/30 px-3 py-1.5 text-xs font-bold text-primary-300 hover:bg-primary/50">
              ▶ Fortsätt
            </button>
          )}
          <button onClick={onClose}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70 hover:bg-red-500/30 hover:text-red-300">
            ✕ Stäng
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative flex-1 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Menu overlay */}
        {gameState === "menu" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="mx-4 w-full max-w-md rounded-3xl border border-primary-800/50 bg-dark/90 p-8 text-center shadow-2xl backdrop-blur-2xl">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                <span className="text-3xl">🚗</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Kör Nu Simulator</h2>
              <p className="mt-2 text-sm text-white/50">Öva dina körkunskaper i en interaktiv simulator. Undvik trafik, samla poäng!</p>

              <div className="mt-6 space-y-3">
                {MODES.map((m) => (
                  <button key={m.id} onClick={() => startGame(m.id)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-primary-800/40 bg-primary-900/30 p-4 text-left transition hover:border-primary/50 hover:bg-primary-900/60">
                    <span className="text-2xl">{m.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{m.label}</p>
                      <p className="text-xs text-white/45">{m.desc}</p>
                    </div>
                    <span className="rounded-lg bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary-300 opacity-0 transition group-hover:opacity-100">
                      Kör →
                    </span>
                  </button>
                ))}
              </div>

              {highScore > 0 && (
                <p className="mt-5 text-xs font-semibold text-primary-400">🏆 Bästa resultat: {highScore} poäng</p>
              )}

              <div className="mt-5 rounded-xl bg-white/5 p-3">
                <p className="text-[0.65rem] font-semibold text-white/40">
                  🖥️ Piltangenter / WASD för att styra  ·  📱 Touch-knappar på mobil
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {gameState === "over" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="mx-4 w-full max-w-sm rounded-3xl border border-red-900/40 bg-dark/90 p-8 text-center shadow-2xl backdrop-blur-2xl">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20">
                <span className="text-3xl">💥</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Krock!</h2>
              <p className="mt-2 text-sm text-white/50">Övning ger färdighet – försök igen!</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-2xl font-black text-primary-400">{finalScore}</p>
                  <p className="text-xs font-semibold text-white/40">Poäng</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-2xl font-black text-primary-400">{finalDist} m</p>
                  <p className="text-xs font-semibold text-white/40">Distans</p>
                </div>
              </div>

              {finalScore >= highScore && finalScore > 0 && (
                <p className="mt-4 text-sm font-bold text-amber-400">🏆 Nytt rekord!</p>
              )}

              <div className="mt-6 flex gap-3">
                <button onClick={() => startGame(mode)}
                  className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-primary-600">
                  🔄 Kör igen
                </button>
                <button onClick={() => { setGameState("menu"); stateRef.current = null; }}
                  className="flex-1 rounded-xl bg-white/10 py-3 text-sm font-bold text-white/70 transition hover:bg-white/20">
                  📋 Meny
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile touch controls */}
      <div className="flex items-center justify-between bg-dark/90 px-3 py-2 backdrop-blur-md md:hidden">
        <button
          onTouchStart={(e) => { e.preventDefault(); touchStart("left"); }}
          onTouchEnd={() => touchEnd("left")}
          onMouseDown={() => touchStart("left")}
          onMouseUp={() => touchEnd("left")}
          onMouseLeave={() => touchEnd("left")}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl text-white active:bg-primary/40 select-none"
          aria-label="Sväng vänster"
        >
          ◀
        </button>

        <button
          onTouchStart={(e) => { e.preventDefault(); touchStart("brake"); }}
          onTouchEnd={() => touchEnd("brake")}
          onMouseDown={() => touchStart("brake")}
          onMouseUp={() => touchEnd("brake")}
          onMouseLeave={() => touchEnd("brake")}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20 text-xl text-red-400 active:bg-red-500/50 select-none"
          aria-label="Bromsa"
        >
          🛑
        </button>

        <button
          onTouchStart={(e) => { e.preventDefault(); touchStart("right"); }}
          onTouchEnd={() => touchEnd("right")}
          onMouseDown={() => touchStart("right")}
          onMouseUp={() => touchEnd("right")}
          onMouseLeave={() => touchEnd("right")}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl text-white active:bg-primary/40 select-none"
          aria-label="Sväng höger"
        >
          ▶
        </button>
      </div>

      {/* Desktop keyboard hints */}
      {gameState === "playing" && (
        <div className="hidden items-center justify-center gap-6 bg-dark/70 py-1.5 text-[0.6rem] font-semibold text-white/30 md:flex">
          <span>← → Styra</span>
          <span>↑ Gas</span>
          <span>↓ Broms</span>
          <span>ESC Paus</span>
        </div>
      )}
    </div>
  );
}
