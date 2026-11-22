import React, { useEffect, useRef } from 'react';

interface CrossBeam3DProps {
  className?: string;
  beamColor?: string;
  glowColor?: string;
  interactive?: boolean;
}

export const CrossBeam3D: React.FC<CrossBeam3DProps> = ({
  className = '',
  beamColor = 'rgba(6, 182, 212, 0.85)',
  glowColor = 'rgba(14, 165, 233, 0.45)',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
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

    const render = () => {
      const width = canvas.clientWidth || 400;
      const height = canvas.clientHeight || 300;

      ctx.clearRect(0, 0, width, height);

      const cx = mouseRef.current.active ? mouseRef.current.x : width / 2 + Math.sin(t * 0.02) * (width * 0.25);
      const cy = mouseRef.current.active ? mouseRef.current.y : height / 2 + Math.cos(t * 0.025) * (height * 0.2);

      // 1. Cross Beam - Horizontal Laser Line with Perspective Depth
      const hGrad = ctx.createLinearGradient(0, cy, width, cy);
      hGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      hGrad.addColorStop(0.3, glowColor);
      hGrad.addColorStop(0.5, beamColor);
      hGrad.addColorStop(0.7, glowColor);
      hGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.save();
      ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
      ctx.shadowBlur = 15;
      ctx.fillStyle = hGrad;
      ctx.fillRect(0, cy - 1.5, width, 3);

      // 2. Cross Beam - Vertical Laser Line
      const vGrad = ctx.createLinearGradient(cx, 0, cx, height);
      vGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      vGrad.addColorStop(0.3, glowColor);
      vGrad.addColorStop(0.5, beamColor);
      vGrad.addColorStop(0.7, glowColor);
      vGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.fillStyle = vGrad;
      ctx.fillRect(cx - 1.5, 0, 3, height);

      // 3. Diagonal High-Energy Cross Beams (3D perspective intersection)
      const diagLen = Math.max(width, height) * 1.2;
      ctx.beginPath();
      ctx.moveTo(cx - diagLen, cy - diagLen * 0.5);
      ctx.lineTo(cx + diagLen, cy + diagLen * 0.5);
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - diagLen, cy + diagLen * 0.5);
      ctx.lineTo(cx + diagLen, cy - diagLen * 0.5);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 4. Central Crosshair Intersection Ring & Core Pulse
      const pulseSize = 6 + Math.sin(t * 0.1) * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseSize * 2.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.fill();

      // Precision Coordinates Marker HUD
      ctx.restore();
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.fillText(`BEAM_TARGET: [${Math.round(cx)}, ${Math.round(cy)}]`, cx + 14, cy - 12);
      ctx.fillText(`BEAM_FREQ: ${(850 + Math.sin(t * 0.05) * 50).toFixed(0)} MHz`, cx + 14, cy + 2);

      t += 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [beamColor, glowColor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full block cursor-crosshair"
      />
    </div>
  );
};
