'use client';

import { useEffect, useRef } from 'react';

// Sampled points from the left hand SVG paths (simplified outline)
const HAND_POINTS = [
  // Main hand outline - sampled key points
  { x: 204, y: 71 }, { x: 238, y: 61 }, { x: 260, y: 54 }, { x: 284, y: 54 },
  { x: 315, y: 63 }, { x: 349, y: 80 }, { x: 380, y: 94 }, { x: 400, y: 106 },
  { x: 426, y: 125 }, { x: 450, y: 137 }, { x: 472, y: 145 }, { x: 496, y: 159 },
  { x: 507, y: 178 }, { x: 513, y: 190 }, { x: 529, y: 205 }, { x: 545, y: 219 },
  { x: 574, y: 247 }, { x: 587, y: 285 }, { x: 592, y: 305 }, { x: 598, y: 320 },
  { x: 605, y: 345 }, { x: 605, y: 355 }, { x: 599, y: 357 }, { x: 573, y: 349 },
  { x: 559, y: 328 }, { x: 553, y: 307 }, { x: 536, y: 274 }, { x: 518, y: 262 },
  { x: 496, y: 246 }, { x: 471, y: 237 }, { x: 451, y: 228 }, { x: 431, y: 230 },
  { x: 417, y: 231 }, { x: 410, y: 217 }, { x: 402, y: 207 }, { x: 410, y: 214 },
  { x: 424, y: 247 }, { x: 441, y: 277 }, { x: 457, y: 296 }, { x: 471, y: 324 },
  { x: 467, y: 347 }, { x: 455, y: 357 }, { x: 439, y: 350 }, { x: 425, y: 339 },
  { x: 409, y: 316 }, { x: 390, y: 284 }, { x: 376, y: 273 }, { x: 356, y: 256 },
  { x: 350, y: 243 }, { x: 345, y: 237 }, { x: 340, y: 250 }, { x: 320, y: 236 },
  { x: 304, y: 217 }, { x: 295, y: 193 }, { x: 292, y: 172 }, { x: 275, y: 144 },
  { x: 255, y: 129 }, { x: 226, y: 121 }, { x: 201, y: 124 }, { x: 205, y: 120 },
  { x: 227, y: 118 }, { x: 256, y: 126 }, { x: 278, y: 141 }, { x: 297, y: 171 },
  { x: 300, y: 192 }, { x: 308, y: 214 }, { x: 323, y: 233 }, { x: 345, y: 246 },
  { x: 354, y: 242 }, { x: 359, y: 253 }, { x: 378, y: 270 }, { x: 394, y: 284 },
  { x: 411, y: 312 }, { x: 428, y: 336 }, { x: 442, y: 347 }, { x: 461, y: 351 },
  { x: 468, y: 324 }, { x: 461, y: 305 }, { x: 445, y: 288 }, { x: 424, y: 253 },
  { x: 412, y: 227 }, { x: 402, y: 206 }, { x: 420, y: 229 }, { x: 446, y: 220 },
  { x: 453, y: 221 }, { x: 456, y: 226 }, { x: 464, y: 230 }, { x: 483, y: 238 },
  { x: 507, y: 248 }, { x: 520, y: 259 }, { x: 536, y: 268 }, { x: 543, y: 277 },
  { x: 549, y: 288 }, { x: 557, y: 307 }, { x: 562, y: 327 }, { x: 575, y: 346 },
  { x: 599, y: 354 }, { x: 602, y: 352 }, { x: 594, y: 320 }, { x: 583, y: 285 },
  { x: 572, y: 251 }, { x: 548, y: 225 }, { x: 530, y: 212 }, { x: 512, y: 195 },
  { x: 498, y: 170 }, { x: 470, y: 150 }, { x: 447, y: 141 }, { x: 413, y: 123 },
  { x: 377, y: 99 }, { x: 347, y: 85 }, { x: 314, y: 68 }, { x: 283, y: 59 },
  { x: 256, y: 58 }, { x: 233, y: 69 }, { x: 200, y: 75 }, { x: 178, y: 73 },
  { x: 147, y: 70 }, { x: 120, y: 76 }, { x: 87, y: 82 }, { x: 74, y: 83 },
  // Wrist/arm area
  { x: 269, y: 185 }, { x: 248, y: 189 }, { x: 218, y: 201 }, { x: 197, y: 217 },
  { x: 176, y: 228 }, { x: 148, y: 242 }, { x: 119, y: 240 }, { x: 92, y: 248 },
  { x: 65, y: 258 }, { x: 43, y: 265 }, { x: 16, y: 274 }, { x: 5, y: 279 },
  // Additional detail points
  { x: 450, y: 285 }, { x: 464, y: 304 }, { x: 471, y: 287 }, { x: 474, y: 281 },
  { x: 480, y: 273 }, { x: 488, y: 259 }, { x: 494, y: 246 }, { x: 506, y: 252 },
  { x: 522, y: 260 }, { x: 541, y: 276 }, { x: 546, y: 288 }, { x: 546, y: 308 },
  { x: 547, y: 350 }, { x: 547, y: 377 }, { x: 548, y: 393 }, { x: 538, y: 397 },
  { x: 520, y: 381 }, { x: 518, y: 362 }, { x: 520, y: 341 }, { x: 516, y: 329 },
  { x: 508, y: 294 }, { x: 497, y: 314 }, { x: 501, y: 335 }, { x: 497, y: 364 },
  { x: 499, y: 375 }, { x: 514, y: 381 }, { x: 517, y: 380 },
];

interface Props {
  className?: string;
  width?: number;
  height?: number;
  scale?: number;
  starColor?: string;
  lineColor?: string;
  connectionDistance?: number;
}

export function HandConstellation({
  className = '',
  width = 657,
  height = 436,
  scale = 1,
  starColor = 'rgba(255, 255, 255, 0.8)',
  lineColor = 'rgba(255, 255, 255, 0.40)',
  connectionDistance = 50,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharpness
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * scale * dpr;
    canvas.height = height * scale * dpr;
    canvas.style.width = `${width * scale}px`;
    canvas.style.height = `${height * scale}px`;
    ctx.scale(dpr, dpr);

    // Scale points
    const scaledPoints = HAND_POINTS.map(p => ({
      x: p.x * scale,
      y: p.y * scale,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.5 + Math.random() * 1.5,
      baseSize: 0.4 + Math.random() * 0.4,
    }));

    const draw = (time: number) => {
      timeRef.current = time * 0.001; // Convert to seconds
      
      ctx.clearRect(0, 0, width * scale, height * scale);

      // Draw connections first (behind stars)
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.8;
      
      for (let i = 0; i < scaledPoints.length; i++) {
        for (let j = i + 1; j < scaledPoints.length; j++) {
          const dx = scaledPoints[i].x - scaledPoints[j].x;
          const dy = scaledPoints[i].y - scaledPoints[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDistance * scale) {
            const opacity = 1 - dist / (connectionDistance * scale);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * opacity})`;
            ctx.beginPath();
            ctx.moveTo(scaledPoints[i].x, scaledPoints[i].y);
            ctx.lineTo(scaledPoints[j].x, scaledPoints[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw stars with twinkle effect
      scaledPoints.forEach((point) => {
        const twinkle = 0.5 + 0.5 * Math.sin(timeRef.current * point.twinkleSpeed + point.twinkleOffset);
        const size = point.baseSize * (0.6 + 0.4 * twinkle);
        const opacity = 0.4 + 0.6 * twinkle;

        // Outer glow
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, size * 1
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core star
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [width, height, scale, starColor, lineColor, connectionDistance]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: width * scale,
        height: height * scale,
      }}
    />
  );
}

