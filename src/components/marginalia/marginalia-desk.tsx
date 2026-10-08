"use client";
import Link from "next/link";
import { useState } from "react";
import { PaperweightNavigation } from "@/components/paperweight-navigation";
import type { MarginaliaEntry } from "@/content/marginalia";

function AnnotationCluster({ entry }: { entry: MarginaliaEntry }) {
  const [selected, setSelected] = useState(false);
  const noteId = `marginal-notes-${entry.id}`;
  return <li className="marginal-cluster" data-selected={selected}>
    <div className="marginal-language">
      <h2><button className="marginal-term" aria-controls={noteId} aria-expanded={selected}
        onFocus={() => setSelected(true)} onClick={() => setSelected(true)}
        onKeyDown={event => { if (event.key === "Escape") setSelected(false); }}>
        {entry.term}
      </button></h2>
      {entry.source && <span className="marginal-source">{entry.source}</span>}
      {entry.echoes?.map((echo, index) => <div className="marginal-echo" key={index}>
        <p>{echo.text}</p>{echo.source && <span className="marginal-source">{echo.source}</span>}
      </div>)}
    </div>
    <div className="marginal-leader" aria-hidden="true" />
    <ol id={noteId} className="marginal-notes" aria-label={`${entry.term}에 남은 기록`}>
      {entry.notes.map((note, index) => <li key={note.id} className="marginal-note" data-style={note.style ?? "ink"}
        data-secondary={index < entry.notes.length - 1} data-visible={selected || index === entry.notes.length - 1}
        aria-hidden={!selected && index < entry.notes.length - 1}>
        {note.date && <span className="marginal-date">{note.date}</span>}
        <p>{note.text}</p>{note.source && <span className="marginal-source">{note.source}</span>}
      </li>)}
    </ol>
  </li>;
}

export function MarginaliaDesk({ entries }: { entries: readonly MarginaliaEntry[] }) {
  return <main className="section-desk writing-desk pressed-desk marginalia-desk">
    <div className="desk-light" aria-hidden="true" />
    <div className="pressed-sheet-stack">
      <article className="section-paper pressed-paper marginalia-paper">
        <header className="pressed-header"><h1 className="section-title"><Link href="/" aria-label="MARGINALIA — HOME으로 돌아가기">MARGINALIA</Link></h1></header>
        <ul className="marginal-composition" lang="ko">{entries.map(entry => <AnnotationCluster key={entry.id} entry={entry} />)}</ul>
      </article>
    </div>
    <PaperweightNavigation currentSection="marginalia" />
  </main>;
}
