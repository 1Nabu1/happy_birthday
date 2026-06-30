"use client";

import { useMemo } from "react";
import styles from "./IntroScreen.module.css";
import InteractiveCake from "./InteractiveCake";

interface IntroScreenProps {
  onStart: () => void;
}

const SHAPES = [
  { size: 10, color: "#ff2d6b", type: "diamond" },
  { size: 8, color: "#a855f7", type: "square" },
  { size: 6, color: "#38bdf8", type: "triangle" },
  { size: 12, color: "#ff6b95", type: "circle" },
  { size: 7, color: "#fbbf24", type: "diamond" },
  { size: 9, color: "#a855f7", type: "square" },
  { size: 5, color: "#ff2d6b", type: "triangle" },
  { size: 11, color: "#38bdf8", type: "circle" },
  { size: 8, color: "#ff6b95", type: "diamond" },
  { size: 6, color: "#fbbf24", type: "square" },
  { size: 10, color: "#a855f7", type: "triangle" },
  { size: 7, color: "#ff2d6b", type: "circle" },
  { size: 9, color: "#38bdf8", type: "diamond" },
  { size: 5, color: "#ff6b95", type: "square" },
  { size: 13, color: "#fbbf24", type: "triangle" },
  { size: 6, color: "#ff2d6b", type: "circle" },
  { size: 8, color: "#a855f7", type: "diamond" },
  { size: 10, color: "#38bdf8", type: "square" },
  { size: 7, color: "#ff6b95", type: "triangle" },
  { size: 11, color: "#fbbf24", type: "circle" },
  { size: 6, color: "#ff2d6b", type: "diamond" },
  { size: 9, color: "#a855f7", type: "square" },
  { size: 5, color: "#38bdf8", type: "triangle" },
  { size: 12, color: "#ff6b95", type: "circle" },
  { size: 8, color: "#fbbf24", type: "diamond" },
  { size: 10, color: "#ff2d6b", type: "square" },
  { size: 7, color: "#a855f7", type: "triangle" },
  { size: 6, color: "#38bdf8", type: "circle" },
  { size: 9, color: "#ff6b95", type: "diamond" },
  { size: 11, color: "#fbbf24", type: "square" },
];

function getShapeElement(type: string, size: number, color: string) {
  const style: React.CSSProperties = { display: "block" };
  switch (type) {
    case "diamond":
      return (
        <div
          style={{
            width: size,
            height: size,
            background: color,
            transform: "rotate(45deg)",
            ...style,
          }}
        />
      );
    case "triangle":
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`,
          }}
        />
      );
    case "circle":
      return (
        <div
          style={{
            width: size,
            height: size,
            background: color,
            borderRadius: "50%",
            ...style,
          }}
        />
      );
    case "square":
    default:
      return (
        <div style={{ width: size, height: size, background: color, ...style }} />
      );
  }
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const shapes = useMemo(
    () =>
      SHAPES.map((s, i) => ({
        ...s,
        left: `${(i * 37 + 5) % 96}%`,
        duration: `${6 + (i * 1.3) % 10}s`,
        delay: `${(i * 0.8) % 8}s`,
      })),
    []
  );

  return (
    <div className={styles.screen}>
      {/* Floating shapes */}
      <div className={styles.shapes} aria-hidden="true">
        {shapes.map((s, i) => (
          <div
            key={i}
            className={styles.shape}
            style={{
              left: s.left,
              bottom: `-${s.size * 2}px`,
              animationDuration: s.duration,
              animationDelay: s.delay,
            }}
          >
            {getShapeElement(s.type, s.size, s.color)}
          </div>
        ))}
      </div>

      {/* Center card */}
      <div className={styles.card}>
        <div className={styles.label}>✦ Birthday Special ✦</div>
        <h1 className={styles.title}>
          Төрсөн өдрийн мэнд,<br />My Baby!
        </h1>
        <InteractiveCake onAllBlownOut={onStart} />
        <button
          className={styles.btn}
          onClick={onStart}
          id="intro-start-btn"
        >
          Явцгааяа! ✨
        </button>
      </div>
    </div>
  );
}
