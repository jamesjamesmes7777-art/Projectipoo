import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
  vx: number;
  vy: number;
  color: string;
}

interface Streak {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  active: boolean;
  progress: number;
}

const STAR_COLORS = [
  'rgba(180,220,255,',
  'rgba(200,230,255,',
  'rgba(160,210,240,',
  'rgba(220,235,255,',
];

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capture non-null references for use in nested functions
    const cvs = canvas;
    const c = ctx;

    let animId: number;
    let frame = 0;
    const stars: Star[] = [];
    const streaks: Streak[] = [];
    const N_STARS = 280;
    const N_STREAKS = 4;

    function resize() {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    }

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < N_STARS; i++) {
        const r = Math.random() < 0.08 ? Math.random() * 1.2 + 0.9 : Math.random() * 0.8 + 0.2;
        stars.push({
          x: Math.random() * cvs.width,
          y: Math.random() * cvs.height,
          r,
          opacity: Math.random() * 0.55 + 0.15,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.018 + 0.004,
          vx: (Math.random() - 0.5) * 0.04,
          vy: (Math.random() - 0.5) * 0.04,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
    }

    function initStreaks() {
      streaks.length = 0;
      for (let i = 0; i < N_STREAKS; i++) {
        streaks.push(newStreak(cvs.width, cvs.height, i * 8000));
      }
    }

    function newStreak(w: number, h: number, delay = 0): Streak {
      return {
        x: Math.random() * w * 0.6,
        y: Math.random() * h * 0.4,
        len: Math.random() * 120 + 80,
        speed: Math.random() * 12 + 10,
        opacity: 0,
        active: delay === 0,
        progress: delay === 0 ? 0 : -delay / 16,
      };
    }

    function drawScanLine(w: number, h: number, f: number) {
      const y = ((f * 0.25) % (h + 80)) - 40;
      const grad = c.createLinearGradient(0, y - 50, 0, y + 2);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(0,149,255,0.025)');
      c.fillStyle = grad;
      c.fillRect(0, y - 50, w, 52);
    }

    function draw() {
      frame++;
      const W = cvs.width;
      const H = cvs.height;
      c.clearRect(0, 0, W, H);

      drawScanLine(W, H, frame);

      // Stars
      stars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -2) s.x = W + 2;
        if (s.x > W + 2) s.x = -2;
        if (s.y < -2) s.y = H + 2;
        if (s.y > H + 2) s.y = -2;

        const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinklePhase);
        const alpha = s.opacity * (0.65 + twinkle * 0.35) * 0.6;

        if (s.r > 0.85) {
          const halo = c.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4.5);
          halo.addColorStop(0, `${s.color}${(alpha * 0.5).toFixed(3)})`);
          halo.addColorStop(1, 'transparent');
          c.beginPath();
          c.arc(s.x, s.y, s.r * 4.5, 0, Math.PI * 2);
          c.fillStyle = halo;
          c.fill();
        }

        c.beginPath();
        c.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        c.fillStyle = `${s.color}${alpha.toFixed(3)})`;
        c.fill();
      });

      // Shooting streaks
      streaks.forEach((streak, idx) => {
        streak.progress += 1;
        if (streak.progress < 0) return;

        if (!streak.active) {
          streak.active = true;
          streak.progress = 0;
        }

        const totalFrames = (streak.len + 40) / streak.speed * 16;
        const pct = streak.progress / totalFrames;
        if (pct > 1) {
          streaks[idx] = newStreak(W, H, 6000 + Math.random() * 12000);
          return;
        }

        const headX = streak.x + pct * streak.len * streak.speed * 0.7;
        const headY = streak.y + pct * streak.len * streak.speed * 0.35;
        const tailX = headX - streak.len;
        const tailY = headY - streak.len * 0.5;

        const alpha = pct < 0.1 ? pct * 10 : pct > 0.8 ? (1 - pct) * 5 : 1;
        const grad = c.createLinearGradient(tailX, tailY, headX, headY);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.6, `rgba(180,230,255,${(alpha * 0.35).toFixed(3)})`);
        grad.addColorStop(1, `rgba(220,245,255,${(alpha * 0.7).toFixed(3)})`);

        c.beginPath();
        c.moveTo(tailX, tailY);
        c.lineTo(headX, headY);
        c.strokeStyle = grad;
        c.lineWidth = 1;
        c.stroke();
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    initStars();
    initStreaks();
    draw();

    const onResize = () => { resize(); initStars(); };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}
