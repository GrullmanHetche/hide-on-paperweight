"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { currentRevision, type ManuscriptWork } from "@/content/manuscript";
import { SquaredManuscript } from "./squared-manuscript";
import { LiteraryText } from "./literary-text";

export function WorkReader({ work, onClose }: { work: ManuscriptWork; onClose: () => void }) {
  const [revisionId, setRevisionId] = useState(work.currentRevision);
  const [sectionIndex, setSectionIndex] = useState(0);
  const revision = currentRevision(work, revisionId);
  const section = revision.sections[sectionIndex] ?? revision.sections[0];
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  function returnToHeading() { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: "start", behavior: "auto" }); }
  return <section className="manuscript-reader literary-reader" aria-labelledby="literary-title">
    <button className="manuscript-return" onClick={onClose}>← MANUSCRIPT</button>
    <header className="manuscript-heading">
      <h2 id="literary-title" ref={heading} tabIndex={-1} lang="ko">
        {work.title ?? work.index ?? <span className="sr-only">원고 읽기</span>}
      </h2>
      <div className="literary-notation">{work.form && <span>{work.form}</span>}{revision.date && <span>{revision.date}</span>}{revision.label && <span>{revision.label}</span>}{work.status && <span>{work.status}</span>}</div>
    </header>
    {revision.sections.length > 1 && <nav className="chapter-navigation" aria-label="원고의 장">
      {revision.sections.map((entry, index) => <button key={entry.id} aria-current={index === sectionIndex ? "page" : undefined}
        aria-controls="literary-section" onClick={() => { setSectionIndex(index); returnToHeading(); }}>
        {entry.title ?? <span aria-label={`${index + 1}번째 장`}>{index + 1}</span>}
      </button>)}
    </nav>}
    <article key={`${revision.id}-${section.id}`} id="literary-section" className="manuscript-chapter literary-section" lang="ko">
      {section.title && revision.sections.length > 1 && <h3>{section.title}</h3>}
      {work.layout === "squared" ? <SquaredManuscript content={section.content} /> : <div className={`manuscript-body literary-body${work.form === "poetry" ? " literary-poetry" : ""}`} tabIndex={work.form === "poetry" ? 0 : undefined}
        role={work.form === "poetry" ? "region" : undefined} aria-label={work.form === "poetry" ? "시 원문 — 긴 행은 가로로 읽을 수 있습니다" : undefined}>
        <LiteraryText content={section.content} sectionId={section.id} annotations={revision.annotations} />
      </div>}
      {revision.annotations?.filter(annotation => annotation.text && (!annotation.target || annotation.target.sectionId === section.id)).map(annotation =>
        <aside key={annotation.id} className="literary-annotation" data-type={annotation.type}>{annotation.text}</aside>)}
    </article>
    {work.note && <aside className="literary-work-note" lang="ko">{work.note}</aside>}
    {work.plate && <figure className="literary-plate"><Image src={work.plate.asset} alt={work.plate.alt} width={work.plate.width} height={work.plate.height} sizes="(max-width: 760px) 80vw, 620px" />{work.plate.caption && <figcaption>{work.plate.caption}</figcaption>}</figure>}
    {work.revisions.length > 1 && <nav className="literary-revisions" aria-label="원고 판본">
      {work.revisions.map(entry => <button key={entry.id} aria-current={entry.id === revision.id ? "page" : undefined}
        onClick={() => { setRevisionId(entry.id); setSectionIndex(0); returnToHeading(); }}>{entry.label ?? entry.date ?? entry.id}</button>)}
    </nav>}
  </section>;
}
