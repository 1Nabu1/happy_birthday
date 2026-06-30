"use client";

import { useEffect, useState } from "react";
import styles from "./WishWall.module.css";
import staticWishes from "@/data/wishes.json";

interface Wish {
  id: string;
  sender: string;
  text: string;
  date: string;
}

interface RenderedWish extends Wish {
  glowClass: string;
  rotation: string;
}

const GLOW_CLASSES = [styles.glowPink, styles.glowGold, styles.glowViolet, styles.glowBlue];
const ROTATIONS = ["-2deg", "1.5deg", "-3deg", "2.5deg", "-1deg", "3deg"];

export default function WishWall() {
  const [wishes, setWishes] = useState<RenderedWish[]>([]);

  useEffect(() => {
    // Generate styling only on client side to ensure random values do not cause hydration mismatch
    const formatted = staticWishes.map((wish, index) => {
      // Deterministic but cyclic styles based on index
      const glow = GLOW_CLASSES[index % GLOW_CLASSES.length];
      const rotation = ROTATIONS[index % ROTATIONS.length];
      return {
        ...wish,
        glowClass: glow,
        rotation: rotation,
      };
    });
    setWishes(formatted);
  }, []);

  return (
    <div className={styles.wallContainer}>
      <h2 className={styles.title}>Мэндчилгээний хана</h2>
      <p className={styles.description}>
        Танд зориулж дотны хүмүүсийн чинь илгээсэн халуун дулаан сэтгэлийн үгс, ерөөлүүд. ✨
      </p>

      <div className={styles.notesGrid}>
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className={`${styles.noteCard} ${wish.glowClass}`}
            style={{ transform: `rotate(${wish.rotation})` }}
          >
            <div className={styles.tape} />
            <div className={styles.noteText}>{wish.text}</div>
            <div className={styles.noteFooter}>
              <span className={styles.noteSender}>{wish.sender}</span>
              <span className={styles.noteDate}>{wish.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
