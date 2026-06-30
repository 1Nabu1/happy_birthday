"use client";

import { useState, useEffect } from "react";
import styles from "./InteractiveCake.module.css";

interface InteractiveCakeProps {
  onAllBlownOut: () => void;
}

export default function InteractiveCake({ onAllBlownOut }: InteractiveCakeProps) {
  const [candles, setCandles] = useState([false, false, false, false, false]);
  const [showSuccess, setShowSuccess] = useState(false);

  const playPuffSound = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const bufferSize = ctx.sampleRate * 0.15; // 150ms puff
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate white noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter white noise to create air puff sound
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start();
    } catch (e) {
      console.warn("Web Audio API not fully supported or blocked:", e);
    }
  };

  const handleCandleClick = (index: number) => {
    if (candles[index]) return; // Already blown out
    
    playPuffSound();
    
    const newCandles = [...candles];
    newCandles[index] = true;
    setCandles(newCandles);
  };

  useEffect(() => {
    if (candles.every((c) => c === true)) {
      setShowSuccess(true);
      // Wait a short moment to play confetti and transition
      const timer = setTimeout(() => {
        onAllBlownOut();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [candles, onAllBlownOut]);

  // Candle positions on the top tier: x-coordinate mapping
  const candleConfigs = [
    { x: 95, colorClass: styles.candleColor1 },
    { x: 115, colorClass: styles.candleColor2 },
    { x: 135, colorClass: styles.candleColor3 },
    { x: 155, colorClass: styles.candleColor4 },
    { x: 175, colorClass: styles.candleColor5 },
  ];

  return (
    <div className={styles.cakeContainer}>
      {!showSuccess ? (
        <div className={styles.instructions}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          Лаа бүр дээр дарж үлээгээрэй! 🎂
        </div>
      ) : (
        <div className={styles.instructions} style={{ color: "var(--color-gold)" }}>
          ✨ Хүслээ шивнээрэй... ✨
        </div>
      )}

      <svg className={styles.cakeSvg} viewBox="0 0 280 220" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Radiant gold/orange gradient for the flames */}
          <radialGradient id="flameGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="25%" stopColor="#ffea00" />
            <stop offset="70%" stopColor="#ff7b00" />
            <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Cake Stand / Plate */}
        <ellipse cx="135" cy="180" rx="100" ry="18" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <path d="M 65 180 Q 135 190 205 180 L 195 195 Q 135 205 75 195 Z" fill="rgba(255,255,255,0.08)" />

        {/* Lower Tier */}
        <path d="M 50 135 C 50 135, 50 165, 50 165 C 50 178, 135 178, 135 178 C 135 178, 220 178, 220 165 C 220 165, 220 135, 220 135 Z" fill="#6c33c3" />
        <ellipse cx="135" cy="135" rx="85" ry="15" fill="#8e54e9" />
        {/* Frosting drips on lower tier */}
        <path d="M 50 135 Q 60 145 70 135 T 90 135 T 110 137 T 130 135 T 150 135 T 170 138 T 190 135 T 210 135 T 220 135 L 220 139 C 220 146, 210 152, 190 148 C 180 146, 170 155, 160 150 C 150 145, 140 155, 130 147 C 120 140, 110 152, 100 145 C 90 138, 80 148, 70 144 C 60 140, 50 148, 50 139 Z" fill="#ffffff" opacity="0.9" />

        {/* Upper Tier */}
        <path d="M 75 90 C 75 90, 75 120, 75 120 C 75 130, 135 130, 135 130 C 135 130, 195 130, 195 120 C 195 120, 195 90, 195 90 Z" fill="#e03b75" />
        <ellipse cx="135" cy="90" rx="60" ry="11" fill="#ff5e97" />
        {/* Frosting drips on upper tier */}
        <path d="M 75 90 Q 82 98 90 90 T 105 90 T 120 92 T 135 90 T 150 90 T 165 92 T 180 90 T 195 90 L 195 93 C 195 98, 185 104, 175 100 C 168 97, 160 106, 152 101 C 145 96, 138 104, 130 99 C 122 94, 115 103, 108 97 C 100 92, 92 100, 85 96 C 78 92, 75 97, 75 93 Z" fill="#ffffff" opacity="0.95" />

        {/* Candles */}
        {candleConfigs.map((config, index) => {
          const isBlownOut = candles[index];
          return (
            <g
              key={index}
              className={styles.candleGroup}
              onClick={() => handleCandleClick(index)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleCandleClick(index);
                }
              }}
            >
              {/* Flame */}
              <path
                className={`${styles.flame} ${isBlownOut ? styles.extinguished : ""}`}
                d={`M ${config.x} ${53} C ${config.x - 7} ${43}, ${config.x - 7} ${33}, ${config.x} ${23} C ${config.x + 7} ${33}, ${config.x + 7} ${43}, ${config.x} ${53} Z`}
              />

              {/* Smoke when blown out */}
              <g className={`${styles.smoke} ${isBlownOut ? styles.active : ""}`}>
                <path
                  d={`M ${config.x} ${50} Q ${config.x - 4} ${40}, ${config.x} ${30} T ${config.x + 2} ${15}`}
                  stroke="rgba(200, 200, 200, 0.4)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="2, 2"
                />
              </g>

              {/* Wick */}
              <line x1={config.x} y1="53" x2={config.x} y2="58" stroke="#111" strokeWidth="1.5" />

              {/* Candle Body */}
              <rect
                className={`${styles.candleBody} ${config.colorClass}`}
                x={config.x - 3}
                y="58"
                width="6"
                height="28"
                rx="1"
              />
            </g>
          );
        })}
      </svg>

      {showSuccess && (
        <div className={styles.messageReveal}>
          Амжилттай үлээлээ! 🌟
        </div>
      )}
    </div>
  );
}
