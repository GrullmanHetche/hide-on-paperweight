"use client";

import { useEffect, useRef, useState } from "react";
import type { PressedWork } from "@/content/pressed";

const chapterNumerals = ["Ⅰ", "Ⅱ", "Ⅲ"];

export function ManuscriptReader({ work, onClose }: { work: PressedWork; onClose: () => void }) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const title = useRef<HTMLHeadingElement>(null);
  const chapter = work.chapters[chapterIndex];
  useEffect(() => { title.current?.focus({ preventScroll: true }); }, []);

  function selectChapter(index: number) {
    setChapterIndex(index);
    title.current?.focus({ preventScroll: true });
    title.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }

  return <section className="manuscript-reader" aria-labelledby="manuscript-title">
    <button className="manuscript-return" onClick={onClose}>← PRESSED</button>
    <header className="manuscript-heading">
      <span className="manuscript-numeral" aria-hidden="true">{work.numeral}</span>
      <h2 id="manuscript-title" ref={title} tabIndex={-1} lang="ko">{work.title}</h2>
    </header>
    {work.chapters.length > 1 && <nav className="chapter-navigation" aria-label={`${work.title}의 원고`}>
      {work.chapters.map((entry, index) => <button key={entry.id} onClick={() => selectChapter(index)}
        aria-current={index === chapterIndex ? "page" : undefined} aria-controls="manuscript-chapter">
        <span>{chapterNumerals[index] ?? String(index + 1)}</span> <span lang="ko">{entry.title}</span>
      </button>)}
    </nav>}
    <article key={chapter.id} id="manuscript-chapter" className="manuscript-chapter" lang="ko"
      aria-label={work.chapters.length > 1 ? chapter.title : work.title}>
      {work.chapters.length > 1 && <h3>{chapter.title}</h3>}
      {chapter.body === null
        ? <p className="manuscript-pending">원문이 아직 제공되지 않았습니다.</p>
        : <div className="manuscript-body">{chapter.body}</div>}
    </article>
  </section>;
}
