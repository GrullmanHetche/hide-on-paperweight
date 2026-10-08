"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { PressedWork } from "@/content/pressed";
import { PaperweightNavigation } from "@/components/paperweight-navigation";
import { ManuscriptReader } from "./manuscript-reader";
import { PressedTimeline } from "./timeline";

export function PressedDesk({ works }: { works: readonly PressedWork[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = works.find(work => work.id === selectedId);
  const paper = useRef<HTMLDivElement>(null);
  const returnPoint = useRef<string | null>(null);
  function closeReader() {
    const id = returnPoint.current;
    setSelectedId(null);
    window.requestAnimationFrame(() => {
      const buttons = paper.current?.querySelectorAll<HTMLButtonElement>(".timeline-point");
      const index = works.findIndex(work => work.id === id);
      buttons?.[index]?.focus({ preventScroll: true });
      buttons?.[index]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
      paper.current?.scrollIntoView({ block: "start", behavior: "auto" });
    });
  }
  return <main className="section-desk writing-desk pressed-desk">
    <div className="desk-light" aria-hidden="true" />
    <div className="pressed-sheet-stack" data-sheets={selected?.chapters.length ?? 1} ref={paper}>
      <article className="section-paper pressed-paper">
        <header className="pressed-header">
          <h1 className="section-title"><Link href="/" aria-label="PRESSED — HOME으로 돌아가기">PRESSED</Link></h1>
        </header>
        {selected
          ? <ManuscriptReader key={selected.id} work={selected} onClose={closeReader} />
          : <section className="pressed-timeline-space" aria-label="PRESSED 작품">
            <PressedTimeline works={works} onSelect={id => { returnPoint.current = id; setSelectedId(id); }} />
          </section>}
      </article>
    </div>
    <PaperweightNavigation />
  </main>;
}
