"use client";

import { useState } from "react";
import styles from "./page.module.css";
import IntroScreen from "@/components/IntroScreen";
import TetrisGame from "@/components/TetrisGame";
import StoryPage from "@/components/StoryPage";

type Screen = "intro" | "tetris" | "story";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");

  return (
    <div className={styles.root}>
      {screen === "intro" && (
        <div key="intro" className={styles.screenEnter}>
          <IntroScreen onStart={() => setScreen("tetris")} />
        </div>
      )}

      {screen === "tetris" && (
        <div key="tetris" className={styles.screenEnter}>
          <TetrisGame onWin={() => setScreen("story")} />
        </div>
      )}

      {screen === "story" && (
        <div key="story" className={styles.screenEnter}>
          <StoryPage />
        </div>
      )}
    </div>
  );
}
