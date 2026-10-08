"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { currentRevision, type ManuscriptWork } from "@/content/manuscript";
import { PaperweightNavigation } from "@/components/paperweight-navigation";
import { WorkReader } from "./work-reader";

export function ManuscriptDesk({ works }: { works: readonly ManuscriptWork[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = works.find(work => work.id === selectedId);
  const composition = useRef<HTMLDivElement>(null);
  function closeReader() {
    const id = selectedId;
    setSelectedId(null);
    requestAnimationFrame(() => {
      const buttons = composition.current?.querySelectorAll<HTMLButtonElement>(".literary-bundle");
      buttons?.[works.findIndex(work => work.id === id)]?.focus();
    });
  }
  return <main className="section-desk writing-desk pressed-desk literary-desk">
    <div className="desk-light" aria-hidden="true" />
    <div className="pressed-sheet-stack" ref={composition}>
      <article className="section-paper pressed-paper literary-paper">
        <header className="pressed-header"><h1 className="section-title"><Link href="/" aria-label="MANUSCRIPT — HOME으로 돌아가기">MANUSCRIPT</Link></h1></header>
        {selected ? <WorkReader key={selected.id} work={selected} onClose={closeReader} /> : works.length === 0
          ? <div className="blank-manuscript" aria-hidden="true"><div /></div>
          : <ul className="literary-composition">{works.map(work => {
            const revision = currentRevision(work);
            return <li key={work.id}><button className="literary-bundle" onClick={() => setSelectedId(work.id)} aria-label={`${work.title ?? work.index ?? work.id} 읽기`}>
              <span className="manuscript-ruling" aria-hidden="true" />
              {(work.title || work.index) && <span className="literary-cover-title" lang="ko">{work.title ?? work.index}</span>}
              <span className="literary-notation">{work.form && <span>{work.form}</span>}{(revision.date || work.createdAt) && <span>{revision.date ?? work.createdAt}</span>}{revision.label && <span>{revision.label}</span>}</span>
            </button></li>;
          })}</ul>}
      </article>
    </div>
    <PaperweightNavigation currentSection="manuscript" />
  </main>;
}
