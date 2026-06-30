"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MusicPlayer.module.css";

interface MusicPlayerProps {
  playTriggered: boolean;
}

export default function MusicPlayer({ playTriggered }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  // Try autoplay on mount; if blocked, start on first user interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      // Autoplay blocked — wait for first user interaction
      const tryPlay = () => {
        audio.play().then(() => {
          setIsPlaying(true);
          document.removeEventListener("click", tryPlay);
          document.removeEventListener("touchstart", tryPlay);
        }).catch(() => {});
      };
      document.addEventListener("click", tryPlay, { once: true });
      document.addEventListener("touchstart", tryPlay, { once: true });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => console.log(err));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  return (
    <div className={styles.playerContainer}>
      <audio
        ref={audioRef}
        src="/HBD.m4a"
        loop
      />
      <div className={styles.discWrapper}>
        <div className={`${styles.vinylDisc} ${isPlaying ? styles.playing : ""}`}>
          <div className={styles.vinylCenter} />
        </div>
      </div>
      <div className={styles.info}>
        <span className={styles.title}>HAPPY BIRTHDAY PIANO 🩷</span>
        <span className={styles.artist}>Онцгой дуу</span>
      </div>
      <button onClick={togglePlay} className={styles.btn} aria-label={isPlaying ? "Pause music" : "Play music"}>
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <div className={styles.volumeContainer}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-secondary)' }}>
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          className={styles.volumeSlider}
          aria-label="Volume slider"
        />
      </div>
    </div>
  );
}
