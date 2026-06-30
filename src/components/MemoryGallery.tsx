"use client";

import { useState, useEffect } from "react";
import styles from "./MemoryGallery.module.css";

interface Memory {
  id: number;
  url: string;
  caption: string;
  rotation: string;
}

const MEMORIES: Memory[] = [
  {
    id: 1,
    url: "/baby2.jpg",
    caption: "Аз жаргалтай мөчүүд",
    rotation: "-3deg",
  },
  {
    id: 2,
    url: "/huurhun.HEIC",
    caption: "Төгсөлт",
    rotation: "2deg",
  },
  {
    id: 3,
    url: "/200.jpg",
    caption: "200 хоног",
    rotation: "-1.5deg",
  },
  {
    id: 4,
    url: "/kiss.HEIC",
    caption: "Амар тайван цаг хугацаа",
    rotation: "3.5deg",
  },
  {
    id: 5,
    url: "/huurhn1.HEIC",
    caption: "Амар тайван цаг хугацаа",
    rotation: "-3.5deg",
  },
  {
    id: 6,
    url: "/huurhn3.HEIC",
    caption: "Амар тайван цаг хугацаа",
    rotation: "3.5deg",
  },
  {
    id: 7,
    url: "/huurhn4.HEIC",
    caption: "Амар тайван цаг хугацаа",
    rotation: "3.5deg",
  },
];

export default function MemoryGallery() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMemory(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={styles.galleryContainer}>
      <h2 className={styles.title}>Хамтдаа бүтээсэн дурсамжууд</h2>
      <div className={styles.galleryGrid}>
        {MEMORIES.map((memory) => (
          <div
            key={memory.id}
            className={styles.polaroidCard}
            style={{ transform: `rotate(${memory.rotation})` }}
            onClick={() => setSelectedMemory(memory)}
          >
            <div className={styles.imageWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={memory.url}
                alt={memory.caption}
                className={styles.polaroidImage}
                loading="lazy"
              />
            </div>
            <div className={styles.polaroidCaption}>{memory.caption}</div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMemory && (
        <div
          className={styles.lightbox}
          onClick={() => setSelectedMemory(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className={styles.closeBtn}
            onClick={() => setSelectedMemory(null)}
            aria-label="Хаах"
          >
            &times;
          </button>
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedMemory.url}
              alt={selectedMemory.caption}
              className={styles.lightboxImage}
            />
            <div className={styles.lightboxCaption}>{selectedMemory.caption}</div>
          </div>
        </div>
      )}
    </div>
  );
}
