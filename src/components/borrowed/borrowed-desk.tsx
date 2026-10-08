"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { plateNumber, type BorrowedWork } from "@/content/borrowed";
import { PaperweightNavigation } from "@/components/paperweight-navigation";
import { PlateMedia } from "./plate-media";
import { PlateCaption } from "./plate-caption";
import { PlateReader } from "./plate-reader";

export function BorrowedDesk({ works }: { works: readonly BorrowedWork[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastInspectedId, setLastInspectedId] = useState<string | null>(null);
  const composition = useRef<HTMLDivElement>(null);
  const selectedIndex = works.findIndex(work => work.id === selectedId);
  const selected = works[selectedIndex];
  function closeReader() {
    const index = selectedIndex;
    setSelectedId(null);
    requestAnimationFrame(() => {
      const button = composition.current?.querySelectorAll<HTMLButtonElement>(".plate-select")[index];
      button?.focus({ preventScroll: true });
      button?.scrollIntoView({ block: "center", behavior: "auto" });
    });
  }
  return <main className="section-desk writing-desk pressed-desk borrowed-desk">
    <div className="desk-light" aria-hidden="true" />
    <div className="pressed-sheet-stack" ref={composition}>
      <article className="section-paper pressed-paper borrowed-paper">
        <header className="pressed-header"><h1 className="section-title"><Link href="/" aria-label="BORROWED — HOME으로 돌아가기">BORROWED</Link></h1></header>
        {selected ? <PlateReader key={selected.id} work={selected} index={selectedIndex} onClose={closeReader} /> : <ol className="plate-composition" aria-label="보관된 도판과 문서">
          {works.map((work, index) => <li key={work.id} data-kind={work.kind} data-orientation={work.width > work.height ? "landscape" : "portrait"}>
            <figure>
              <button className="plate-select" aria-label={`${plateNumber(index)} ${work.title ?? "도판"} 열기`} onClick={() => { setLastInspectedId(work.id); setSelectedId(work.id); }}>
                <span className="plate-print"><PlateMedia work={work} eager={index === 0 || work.id === lastInspectedId} /></span>
              </button>
              <figcaption><PlateCaption work={work} index={index} /></figcaption>
            </figure>
          </li>)}
        </ol>}
      </article>
    </div>
    <PaperweightNavigation currentSection="borrowed" />
  </main>;
}
