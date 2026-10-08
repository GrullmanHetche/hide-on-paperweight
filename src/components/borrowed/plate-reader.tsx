"use client";
import { useEffect, useRef, useState } from "react";
import { plateNumber, type BorrowedWork } from "@/content/borrowed";
import { PlateCaption } from "./plate-caption";
import { PlateMedia } from "./plate-media";
export function PlateReader({ work, index, onClose }: { work: BorrowedWork; index: number; onClose: () => void }) {
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const heading = useRef<HTMLDivElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: "start" }); }, []);
  function turn(next: number) {
    setPage(next);
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }
  return <section className="plate-inspection" aria-label={`${work.title ?? plateNumber(index)} 감상`}>
    <button className="manuscript-return" onClick={onClose}>← BORROWED</button>
    <div className="plate-reading-heading" ref={heading} tabIndex={-1} aria-label={work.title ?? plateNumber(index)}>
      <PlateCaption work={work} index={index} detail />
    </div>
    {work.kind === "document" && <div className="plate-document-controls">
      <nav aria-label="문서 페이지"><button className="plate-text-control" disabled={page === 0} onClick={() => turn(page - 1)}>← 이전</button><span aria-live="polite">{page + 1} / {work.pages.length}</span><button className="plate-text-control" disabled={page === work.pages.length - 1} onClick={() => turn(page + 1)}>다음 →</button></nav>
      <button className="plate-text-control" aria-pressed={zoom} onClick={() => setZoom(value => !value)}>{zoom ? "전체 폭" : "확대"}</button>
    </div>}
    <div className="plate-reading-surface" data-zoom={zoom} tabIndex={zoom ? 0 : undefined} role={zoom ? "region" : undefined} aria-label={zoom ? "확대한 문서 — 가로로 이동하며 읽기" : undefined}>
      <div className="plate-reading-art"><PlateMedia key={work.id} work={work} detail page={page} /></div>
    </div>
    {work.kind === "document" && work.pages[page].text && <details className="plate-accessible-text"><summary>이 페이지의 텍스트</summary><div lang="ko">{work.pages[page].text}</div></details>}
    <a className="plate-original" href={work.file} target="_blank" rel="noopener noreferrer">원본 열기 ↗</a>
  </section>;
}
