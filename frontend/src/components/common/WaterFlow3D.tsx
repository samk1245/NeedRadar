import React, { useEffect, useRef, useState } from 'react';
import { Waves, Sparkles, Activity } from 'lucide-react';

interface WaterFlow3DProps {
  className?: string;
  showControls?: boolean;
  interactive?: boolean;
}

export const WaterFlow3D: React.FC<WaterFlow3DProps> = ({
  className = '',
  showControls = false,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [speed, setSpeed] = useState<number>(1.2);
  const [waveHeight, setWaveHeight] = useState<number>(24);
  const [isFlowActive, setIsFlowActive] = useState<boolean>(true);
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const ripples = useRef<Array<{ x: number; y: number; radius: number; maxRadius: number; alpha: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particles floating on the water current
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * (canvas.clientWidth || 800),
      y: Math.random() * (canvas.clientHeight || 400),
      size: Math.random() * 2.5 + 1.2,
      speedX: Math.random() * 1.5 + 0.6,
      speedY: (Math.random() - 0.5) * 0.4,
      hue: Math.random() > 0.6 ? 175 : (Math.random() > 0.3 ? 210 : 195),
      opacity: Math.random() * 0.7 + 0.3
    }));

    const render = () => {
      const width = canvas.clientWidth || 800;
      const height = canvas.clientHeight || 400;

      ctx.clearRect(0, 0, width, height);

      // Deep 3D perspective gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, 'rgba(8, 18, 38, 0.95)');
      bgGrad.addColorStop(0.5, 'rgba(11, 28, 56, 0.90)');
      bgGrad.addColorStop(1, 'rgba(6, 14, 29, 0.98)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Multi-layer 3D Water Waves
      const waves = [
        { amp: waveHeight * 1.3, freq: 0.007, speed: speed * 0.02, color: 'rgba(14, 165, 233, 0.18)', yOffset: height * 0.65 },
        { amp: waveHeight * 1.0, freq: 0.012, speed: speed * -0.025, color: 'rgba(20, 184, 166, 0.22)', yOffset: height * 0.72 },
        { amp: waveHeight * 0.7, freq: 0.018, speed: speed * 0.035, color: 'rgba(56, 189, 248, 0.28)', yOffset: height * 0.78 },
        { amp: waveHeight * 0.4, freq: 0.025, speed: speed * 0.045, color: 'rgba(99, 102, 241, 0.20)', yOffset: height * 0.84 }
      ];

      waves.forEach((wave, idx) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 4) {
          // 3D Sine harmonic wave calculation with perspective tapering
          const perspectiveScale = 0.7 + (x / width) * 0.5;
          let y = Math.sin(x * wave.freq + t * wave.speed) * wave.amp * perspectiveScale;
          y += Math.sin(x * wave.freq * 2.2 + t * wave.speed * 1.4) * (wave.amp * 0.35);

          // Interaction with mouse if active
          if (mousePos.current.active) {
            const dx = x - mousePos.current.x;
            const dist = Math.abs(dx);
            if (dist < 180) {
              const influence = (1 - dist / 180) * 20 * Math.sin(t * 0.2);
              y += influence;
            }
          }

          ctx.lineTo(x, wave.yOffset + y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // 3D Caustic water gradient
        const waveGrad = ctx.createLinearGradient(0, wave.yOffset - wave.amp, width, height);
        waveGrad.addColorStop(0, wave.color);
        waveGrad.addColorStop(1, idx % 2 === 0 ? 'rgba(3, 105, 161, 0.45)' : 'rgba(13, 148, 136, 0.40)');
        ctx.fillStyle = waveGrad;
        ctx.fill();

        // Wave crest highlight
        ctx.strokeStyle = idx === 2 ? 'rgba(255, 255, 255, 0.45)' : 'rgba(186, 230, 253, 0.25)';
        ctx.lineWidth = idx === 2 ? 1.8 : 1.0;
        ctx.stroke();
      });

      // Render expanding water ripples
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const r = ripples.current[i];
        r.radius += 2.5;
        r.alpha -= 0.015;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Secondary harmonic inner ring
        if (r.radius > 12) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(45, 212, 191, ${r.alpha * 0.6})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }

      // Update and draw floating civic action particles (needs & volunteer sparks)
      particles.forEach((p) => {
        p.x += p.speedX * (isFlowActive ? speed : 0.2);
        p.y += p.speedY + Math.sin(t * 0.05 + p.x * 0.01) * 0.3;

        if (p.x > width + 20) p.x = -20;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.opacity})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });

      t += 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, waveHeight, isFlowActive]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePos.current = { x, y, active: true };

    // Occasionally spawn water ripple
    if (Math.random() > 0.75 && ripples.current.length < 10) {
      ripples.current.push({
        x,
        y,
        radius: 4,
        maxRadius: 65,
        alpha: 0.65
      });
    }
  };

  const handleMouseLeave = () => {
    mousePos.current.active = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Burst ripple on click
    for (let k = 0; k < 2; k++) {
      ripples.current.push({
        x: x + (k * 6 - 3),
        y: y + (k * 6 - 3),
        radius: 2 + k * 8,
        maxRadius: 90 + k * 20,
        alpha: 0.85
      });
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Floating 3D Depth Badge */}
      <div className="absolute top-3 left-4 flex items-center space-x-2 bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30 text-xs font-medium text-cyan-300 pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <Waves className="w-3.5 h-3.5 text-cyan-400" />
        <span>3D Water Flow Engine</span>
      </div>

      {showControls && (
        <div className="absolute bottom-3 right-4 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-300 shadow-xl">
          <button
            type="button"
            onClick={() => setIsFlowActive(!isFlowActive)}
            className={`px-2 py-0.5 rounded text-xs transition ${isFlowActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'}`}
          >
            {isFlowActive ? 'Flow Active' : 'Paused'}
          </button>
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-700">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <button
              type="button"
              onClick={() => setSpeed(s => (s >= 2.0 ? 0.8 : s + 0.4))}
              className="hover:text-white px-1 font-mono"
              title="Adjust Flow Velocity"
            >
              {speed.toFixed(1)}x
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
