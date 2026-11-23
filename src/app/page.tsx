"use client";

import { useEffect, useRef } from "react";

type Phase = "CODING_DAY" | "CODING_SUNSET" | "WAVING_NIGHT" | "WALKING_TO_BED" | "SLEEPING" | "WAKING_DAWN" | "RETURNING_TO_DESK" | "CODING_MORNING";

const palette = {
  wallDay: "#3b4252",
  wallNight: "#191d2b",
  skyDay: "#5fcde4",
  skySunset: "#d95763",
  skyNight: "#0f1326",
  skyDawn: "#f77622",
  sun: "#fbf236",
  windowFrame: "#222034",
  deskTop: "#8f563b",
  deskFront: "#663931",
  deskShadow: "#45283c",
  monitorCase: "#30313a",
  monitorScreen: "#14182e",
  green: "#fbf236",
  cyan: "#5fcde4",
  gold: "#fbf236",
  chair: "#222034",
  chairLight: "#3f3f74",
  skin: "#c68642",
  skinShadow: "#8d5524",
  hair: "#111111",
  beard: "#1a1a1a",
  glasses: "#1d2b53",
  lenses: "#83769c",
  sweater: "#ede6d6",
  sweaterShadow: "#c7b8a1",
  pants: "#1d2b53",
  shoes: "#45283c",
};

function mixColor(from: string, to: string, amount: number) {
  const parse = (value: string) => [1, 3, 5].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
  const start = parse(from);
  const end = parse(to);
  return `#${start.map((value, index) => Math.round(value + amount * (end[index] - value)).toString(16).padStart(2, "0")).join("")}`;
}

function getPhase(tick: number): Phase {
  if (tick < 300) return "CODING_DAY";
  if (tick < 420) return "CODING_SUNSET";
  if (tick < 520) return "WAVING_NIGHT";
  if (tick < 620) return "WALKING_TO_BED";
  if (tick < 780) return "SLEEPING";
  if (tick < 880) return "WAKING_DAWN";
  if (tick < 980) return "RETURNING_TO_DESK";
  return "CODING_MORNING";
}

function drawScene(canvas: HTMLCanvasElement, tick: number) {
  const context = canvas.getContext("2d");
  if (!context) return;
  context.setTransform(2, 0, 0, 2, 0, 0);
  context.imageSmoothingEnabled = false;

  const px = (x: number, y: number, width: number, height: number, color: string) => {
    context.fillStyle = color;
    context.fillRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
  };

  let wall = palette.wallDay;
  let sky = palette.skyDay;
  let night = 0;
  if (tick >= 300 && tick < 420) {
    const progress = (tick - 300) / 120;
    sky = progress < 0.5
      ? mixColor(palette.skyDay, palette.skySunset, progress * 2)
      : mixColor(palette.skySunset, palette.skyNight, (progress - 0.5) * 2);
    wall = mixColor(palette.wallDay, palette.wallNight, progress);
    night = progress;
  } else if (tick >= 420 && tick < 780) {
    sky = palette.skyNight;
    wall = palette.wallNight;
    night = 1;
  } else if (tick >= 780 && tick < 880) {
    const progress = (tick - 780) / 100;
    sky = progress < 0.5
      ? mixColor(palette.skyNight, palette.skyDawn, progress * 2)
      : mixColor(palette.skyDawn, palette.skyDay, (progress - 0.5) * 2);
    wall = mixColor(palette.wallNight, palette.wallDay, progress);
    night = 1 - progress;
  }

  context.clearRect(0, 0, 160, 120);
  px(0, 0, 160, 120, "#faf8f5");

  const windowX = 20;
  const windowY = 14;
  const windowWidth = 48;
  const windowHeight = 40;
  px(windowX - 3, windowY - 3, windowWidth + 6, windowHeight + 6, palette.windowFrame);
  px(windowX, windowY, windowWidth, windowHeight, sky);

  if (night < 0.5) {
    px(windowX + 33, windowY + 8 + night * 30, 7, 7, palette.sun);
    px(windowX + 6, windowY + 13, 12, 2, "#fff");
    px(windowX + 9, windowY + 11, 6, 2, "#fff");
  } else {
    px(windowX + 10, windowY + 7, 6, 6, "#fff");
    px(windowX + 12, windowY + 7, 4, 4, sky);
    const stars = Math.floor(tick / 15) % 2 === 0
      ? [[28, 9], [37, 21]]
      : [[23, 19], [39, 8]];
    stars.forEach(([x, y]) => px(windowX + x, windowY + y, 1, 1, "#fff"));
  }

  px(windowX + 23, windowY, 2, windowHeight, palette.windowFrame);
  px(windowX, windowY + 19, windowWidth, 2, palette.windowFrame);
  px(windowX - 5, windowY + windowHeight + 2, windowWidth + 10, 3, palette.chairLight);

  void wall;
  drawBed(px);
  drawDesk(context, px, tick, getPhase(tick).startsWith("CODING"));
  drawCharacter(context, px, tick, getPhase(tick));
}

function drawBed(px: (x: number, y: number, w: number, h: number, color: string) => void) {
  px(7, 80, 43, 5, palette.deskShadow);
  px(5, 85, 48, 22, palette.chair);
  px(8, 87, 42, 16, "#d8d9c5");
  px(8, 87, 12, 16, "#f0e8d2");
  px(46, 103, 4, 12, palette.deskShadow);
  px(7, 103, 4, 12, palette.deskShadow);
  px(5, 77, 4, 28, palette.chairLight);
}

function drawDesk(context: CanvasRenderingContext2D, px: (x: number, y: number, w: number, h: number, color: string) => void, tick: number, coding: boolean) {
  const deskX = 55;
  const deskY = 69;
  px(deskX + 22, deskY - 23, 27, 18, palette.monitorCase);
  px(deskX + 24, deskY - 21, 23, 14, palette.monitorScreen);
  px(deskX + 32, deskY - 5, 7, 3, palette.monitorCase);
  px(deskX + 28, deskY - 2, 15, 2, palette.monitorCase);

  if (coding) {
    const shift = Math.floor(tick / 6) % 4;
    const colors = [palette.green, palette.cyan, palette.gold, palette.green];
    for (let line = 0; line < 4; line += 1) {
      px(deskX + 26, deskY - 19 + line * 3, ((line + shift) % 3) * 4 + 6, 1, colors[(line + shift) % colors.length]);
    }
  } else {
    px(deskX + 35, deskY - 15, 2, 2, palette.cyan);
  }

  px(deskX + 54, deskY - 5, 4, 5, "#fff");
  px(deskX + 58, deskY - 4, 1, 3, "#fff");
  px(deskX, deskY, 68, 4, palette.deskTop);
  px(deskX, deskY + 4, 68, 3, palette.deskFront);
  px(deskX + 3, deskY + 7, 4, 29, palette.deskShadow);
  px(deskX + 61, deskY + 7, 4, 29, palette.deskShadow);
  px(deskX + 12, deskY - 1, 10, 1, "#c7b8a1");
}

function drawCharacter(context: CanvasRenderingContext2D, px: (x: number, y: number, w: number, h: number, color: string) => void, tick: number, phase: Phase) {
  const anchorX = 90;
  const anchorY = 72;
  context.save();
  context.translate(anchorX, anchorY);
  context.scale(1.12, 1.12);
  context.translate(-anchorX, -anchorY);
  drawCharacterBase(context, px, tick, phase);
  context.restore();
}

function drawCharacterBase(context: CanvasRenderingContext2D, px: (x: number, y: number, w: number, h: number, color: string) => void, tick: number, phase: Phase) {
  const cx = 80;
  const cy = 51;
  const chair = () => {
    px(cx, cy + 13, 20, 19, palette.chair);
    px(cx + 2, cy + 14, 16, 16, palette.chairLight);
    px(cx + 8, cy + 32, 5, 9, palette.chair);
    px(cx + 3, cy + 41, 15, 2, palette.chair);
  };
  const legs = (x: number, bodyY: number, step = 0) => {
    px(x + 4, bodyY + 27 + step, 5, 14, "#07100f");
    px(x + 5, bodyY + 27 + step, 4, 13, palette.pants);
    px(x + 12, bodyY + 27 - step, 5, 14, "#07100f");
    px(x + 12, bodyY + 27 - step, 4, 13, palette.pants);
    px(x + 3, bodyY + 41 + step, 7, 2, palette.shoes);
    px(x + 12, bodyY + 41 - step, 7, 2, palette.shoes);
  };

  if (phase.startsWith("CODING")) {
    const typing = Math.floor(tick / 4) % 2;
    legs(cx, cy - 1);
    drawBodyBack(px, cx, cy, typing);
    drawBackHead(px, cx, cy);
    px(cx + 1, cy + 19, 18, 10, palette.chair);
    px(cx + 7, cy + 29, 6, 12, palette.chair);
    px(cx + 2, cy + 41, 17, 2, palette.chair);
    return;
  }

  if (phase === "WALKING_TO_BED" || phase === "RETURNING_TO_DESK") {
    const goingToBed = phase === "WALKING_TO_BED";
    const progress = goingToBed ? (tick - 520) / 100 : (tick - 880) / 100;
    const travel = goingToBed ? 80 - progress * 49 : 31 + progress * 49;
    const step = Math.floor(tick / 5) % 2;
    legs(travel, cy, step);
    drawBodyFront(px, travel, cy);
    px(travel - 1, cy + 15 + step, 4, 10, palette.sweaterShadow);
    px(travel + 18, cy + 15 + (1 - step), 4, 10, palette.sweaterShadow);
    drawFrontFace(px, travel, cy);
    return;
  }

  chair();
  if (phase === "WAVING_NIGHT") {
    legs(cx, cy);
    drawBodyFront(px, cx, cy);
    px(cx - 2, cy + 15, 4, 11, palette.sweaterShadow);
    px(cx - 2, cy + 25, 4, 3, palette.skin);
    const wave = Math.floor(tick / 8) % 2;
    px(cx + 17, cy + 10, 4, 10, palette.sweaterShadow);
    px(cx + 18, cy + 6, 4, 5, palette.skin);
    px(cx + 17 + wave, cy + 3, 4, 4, palette.skin);
    drawFrontFace(px, cx, cy);
  } else if (phase === "SLEEPING") {
    px(21, 88, 23, 12, "#5a8fa3");
    px(34, 89, 11, 10, palette.skin);
    px(34, 87, 11, 5, palette.hair);
    px(44, 91, 5, 4, palette.beard);
    px(20, 91, 16, 8, palette.sweater);
    px(19, 88, 8, 5, palette.sweaterShadow);
  } else {
    const progress = Math.min(1, (tick - 780) / 40);
    const bedX = 31;
    const bodyY = 76 - Math.floor(progress * 25);
    legs(bedX, bodyY);
    drawBodyFront(px, bedX, bodyY);
    px(bedX - 2, bodyY + 3, 4, 13, palette.sweaterShadow);
    px(bedX + 19, bodyY + 3, 4, 13, palette.sweaterShadow);
    drawFrontFace(px, bedX, bodyY);
  }
}

function drawBodyFront(px: (x: number, y: number, w: number, h: number, color: string) => void, x: number, y: number) {
  px(x, y + 14, 20, 16, "#07100f");
  px(x + 2, y + 15, 16, 14, palette.sweater);
  px(x + 3, y + 17, 14, 2, "#f7efd8");
  px(x + 3, y + 27, 15, 2, palette.sweaterShadow);
  px(x + 7, y + 12, 6, 4, palette.skinShadow);
}

function drawBodyBack(px: (x: number, y: number, w: number, h: number, color: string) => void, x: number, y: number, typing: number) {
  px(x, y + 14, 20, 17, "#07100f");
  px(x + 2, y + 15, 16, 14, palette.sweater);
  px(x + 3, y + 28, 15, 2, palette.sweaterShadow);
  px(x - 1, y + 15 + typing, 5, 10, palette.sweaterShadow);
  px(x + 17, y + 16 - typing, 5, 10, palette.sweaterShadow);
  px(x + 1, y + 25 + typing, 3, 3, palette.skin);
  px(x + 19, y + 26 - typing, 3, 3, palette.skin);
  px(x + 8, y + 11, 5, 5, palette.skinShadow);
}

function drawBackHead(px: (x: number, y: number, w: number, h: number, color: string) => void, x: number, y: number) {
  px(x + 3, y - 3, 15, 3, "#07100f");
  px(x + 1, y, 19, 13, "#07100f");
  px(x + 3, y - 1, 14, 12, palette.hair);
  px(x + 5, y - 3, 9, 3, palette.hair);
  px(x + 2, y + 4, 2, 5, palette.skinShadow);
  px(x + 17, y + 4, 2, 5, palette.skinShadow);
  px(x + 6, y + 1, 3, 7, "#292b36");
  px(x + 10, y, 2, 8, "#292b36");
  px(x + 5, y + 11, 9, 3, palette.hair);
  px(x + 8, y + 12, 4, 2, palette.skinShadow);
}

function drawFrontFace(px: (x: number, y: number, w: number, h: number, color: string) => void, x: number, y: number) {
  px(x + 3, y - 3, 15, 3, "#07100f");
  px(x + 1, y, 19, 14, "#07100f");
  px(x + 3, y + 1, 15, 12, palette.skin);
  px(x + 2, y - 1, 17, 5, palette.hair);
  px(x + 5, y - 3, 8, 3, palette.hair);
  px(x + 4, y + 2, 3, 2, palette.hair);
  px(x + 3, y + 5, 6, 2, palette.glasses);
  px(x + 12, y + 5, 6, 2, palette.glasses);
  px(x + 9, y + 5, 3, 1, palette.glasses);
  px(x + 4, y + 7, 4, 2, "#e8e5d8");
  px(x + 13, y + 7, 4, 2, "#e8e5d8");
  px(x + 5, y + 7, 2, 2, palette.glasses);
  px(x + 14, y + 7, 2, 2, palette.glasses);
  px(x + 2, y + 10, 17, 5, palette.beard);
  px(x + 4, y + 9, 13, 3, palette.beard);
  px(x + 7, y + 11, 6, 1, palette.skin);
  px(x + 5, y + 13, 10, 2, palette.beard);
  px(x + 19, y + 4, 1, 3, "#d9a56d");
  px(x + 1, y + 4, 1, 3, "#d9a56d");
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let frame = 0;
    let tick = 0;
    let lastTime = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = (time: number) => {
      if (time - lastTime >= 1000 / 60) {
        tick = reducedMotion ? 120 : (tick + 1) % 1080;
        lastTime = time;
        if (canvasRef.current) drawScene(canvasRef.current, tick);
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="pixel-page">
      <canvas
        ref={canvasRef}
        className="pixel-scene"
        width={320}
        height={240}
        aria-label="Animación pixel art: programando de día, despidiéndose de noche, durmiendo, amaneciendo y volviendo a programar"
        role="img"
      />
    </main>
  );
}
