"use client";

import { useState } from "react";
import styles from "./StoryPage.module.css";
import MusicPlayer from "./MusicPlayer";
import MemoryGallery from "./MemoryGallery";
import staticWishes from "@/data/wishes.json";
import storyData from "@/data/story.json";

const GLOW_CLASSES_MAP = ["glowPink", "glowGold", "glowViolet", "glowBlue"] as const;
const ROTATIONS = ["-2deg", "1.5deg", "-3deg", "2.5deg", "-1deg", "3deg"];

export default function StoryPage() {
  const [showWishes, setShowWishes] = useState(false);

  const wishes = staticWishes.map((w, i) => ({
    ...w,
    rotation: ROTATIONS[i % ROTATIONS.length],
    glowKey: GLOW_CLASSES_MAP[i % GLOW_CLASSES_MAP.length],
  }));

  return (
    <div className={styles.page}>
      {/* Floating music player */}
      <MusicPlayer playTriggered={true} />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroLabel}>{storyData.hero.label}</div>
        <h1 className={styles.heroTitle}>
          {storyData.hero.titleMain} <em>{storyData.hero.titleEm1}</em> {storyData.hero.titleAnd} <em>{storyData.hero.titleEm2}</em>
        </h1>
        <p className={styles.heroBody}>
          {storyData.hero.body}
        </p>
        <span className={styles.heroIcon} aria-hidden="true">✦</span>
      </section>

      {/* ── Two cards ── */}
      <section className={styles.section}>
        <div className={styles.cardsGrid}>
          {/* Card 1 */}
          <div className={styles.card} style={{ padding: (storyData.cards.card1 as any).image ? 0 : undefined }}>
            {(storyData.cards.card1 as any).image ? (
              <img src={(storyData.cards.card1 as any).image} alt="Memory 1" className={styles.cardImage} />
            ) : (
              <>
                <span className={styles.cardChip}>{storyData.cards.card1.chip}</span>
                <h2 className={styles.cardTitle}>
                  {storyData.cards.card1.titleMain} <em>{storyData.cards.card1.titleEm}</em>
                </h2>
                <p className={styles.cardBody}>
                  {storyData.cards.card1.body}
                </p>
                <div className={styles.cardMeta}>
                  <span>✦</span> {(storyData.cards.card1 as any).meta}
                </div>
              </>
            )}
          </div>

          {/* Card 2 */}
          <div className={styles.card} style={{ padding: (storyData.cards.card2 as any).image ? 0 : undefined }}>
            {(storyData.cards.card2 as any).image ? (
              <img src={(storyData.cards.card2 as any).image} alt="Memory 2" className={styles.cardImage} />
            ) : (
              <>
                <span className={styles.cardChip}>{storyData.cards.card2.chip}</span>
                <span className={styles.cardIcon}>{storyData.cards.card2.icon}</span>
                <h2 className={styles.cardTitle}>{storyData.cards.card2.title}</h2>
                <p className={styles.cardBody}>
                  {storyData.cards.card2.body}
                </p>
                {/* @ts-ignore */}
                {storyData.cards.card2.list && (
                  <ul className={styles.cardList}>
                    {/* @ts-ignore */}
                    {storyData.cards.card2.list.map((item: string, idx: number) => (
                      <li key={idx} className={styles.cardListItem}>{item}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteCard}>
          {/* @ts-ignore */}
          {storyData.quote.image && (
            // @ts-ignore
            <img src={storyData.quote.image} alt={storyData.quote.author} className={styles.quoteImage} />
          )}
          <div className={styles.quoteContent}>
            <blockquote className={styles.quoteText}>
              {storyData.quote.text}
            </blockquote>
            <p className={styles.quoteAuthor}>— {storyData.quote.author}</p>
          </div>
        </div>
      </section>

      {/* ── Memory Gallery ── */}
      <MemoryGallery />

      {/* ── Timeline ── */}
      <section className={styles.timelineSection}>
        <p className={styles.sectionLabel}>✦ Milestones ✦</p>
        <h2 className={styles.sectionTitle}>Milestones of Magic</h2>
        <div className={styles.timeline}>
          {storyData.timeline.map((item, i) => (
            <div key={i} className={styles.timelineItem}>
              {item.side === "left" ? (
                <>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDate}>{item.date}</div>
                    <div className={styles.timelineTitle}>{item.title}</div>
                    {/* @ts-ignore */}
                    {item.image && <img src={item.image} alt={item.title} className={styles.timelineImage} />}
                    <div className={styles.timelineBody}>{item.body}</div>
                  </div>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineEmpty} />
                </>
              ) : (
                <>
                  <div className={styles.timelineEmpty} />
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDate}>{item.date}</div>
                    <div className={styles.timelineTitle}>{item.title}</div>
                    {/* @ts-ignore */}
                    {item.image && <img src={item.image} alt={item.title} className={styles.timelineImage} />}
                    <div className={styles.timelineBody}>{item.body}</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Wish Wall ── */}
      <section className={styles.wishSection}>
        <p className={styles.sectionLabel}>✦ Wishes ✦</p>
        <h2 className={styles.sectionTitle}>Мэндчилгээний хана</h2>
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "24px",
              filter: showWishes ? "none" : "blur(12px)",
              transition: "filter 0.6s ease",
              pointerEvents: showWishes ? "auto" : "none",
              userSelect: showWishes ? "auto" : "none",
            }}
          >
            {wishes.map((w, i) => (
              <div
                key={w.id}
                style={{
                  gridColumn: i === 0 ? "1 / -1" : undefined,
                  background: "var(--bg-card)",
                  border: `1px solid rgba(255,45,107,0.12)`,
                  borderLeft: `4px solid ${
                    w.glowKey === "glowPink" ? "var(--accent-pink)"
                    : w.glowKey === "glowGold" ? "#e5c158"
                    : w.glowKey === "glowViolet" ? "#a855f7"
                    : "#4776e6"
                  }`,
                  borderRadius: "16px",
                  padding: "24px",
                  transform: `rotate(${w.rotation})`,
                  transition: "all 0.3s ease",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-cursive)",
                    fontSize: i === 0 ? "20px" : "18px",
                    color: "var(--text-main)",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                  }}
                >
                  {w.text}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "var(--text-dim)",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    paddingTop: "8px",
                  }}
                >
                  <span style={{ color: "#e5c158", fontWeight: 600 }}>{w.sender}</span>
                  <span>{w.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lock overlay */}
          {!showWishes && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                zIndex: 2,
                pointerEvents: "none",
              }}
            >
              <div style={{ fontSize: "48px" }}>🔒</div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 600 }}>
                Мэндчилгээ харах товч дарна уу
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>{storyData.cta.title}</h2>
          <p className={styles.ctaBody}>
            {storyData.cta.body}
          </p>
          <div className={styles.ctaBtns}>
            <button
              className="btn-ghost"
              onClick={() => {
                document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
                document.body.scrollTo({ top: 0, behavior: "smooth" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ↑ Эхнээс харах
            </button>
            <button
              className="btn-primary"
              onClick={() => setShowWishes(!showWishes)}
            >
              {showWishes ? "Нуух" : "Мэндчилгээ харах 🩷"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
