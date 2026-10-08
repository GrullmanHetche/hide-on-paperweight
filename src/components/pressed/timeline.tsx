import type { CSSProperties } from "react";
import type { PressedWork } from "@/content/pressed";

export function PressedTimeline({ works, onSelect }: {
  works: readonly PressedWork[];
  onSelect: (id: string) => void;
}) {
  return <div className="pressed-timeline-scroll" role="region" aria-label="쓰여진 기억의 타임라인" tabIndex={0}>
    <div className="pressed-timeline-track" style={{ "--work-count": works.length } as CSSProperties}>
      <div className="timeline-written-line" aria-hidden="true" />
      <ol className="timeline-works" aria-label="작품">
        {works.map(work => <li key={work.id}>
          <button id={`pressed-work-${work.id}`} className="timeline-point" onClick={() => onSelect(work.id)} aria-label={`${work.numeral}. ${work.title} 읽기`}>
            <span className="point-numeral">{work.numeral}</span>
            <span className="point-mark" aria-hidden="true" />
            <span className="point-title" lang="ko">{work.title}</span>
          </button>
        </li>)}
      </ol>
      <div className="timeline-future">
        <div className="future-line" aria-hidden="true" />
        <span className="future-first" tabIndex={0} role="note" aria-label="아직 쓰이지 않았습니다.">
          <span className="future-ring" aria-hidden="true" />
          <span className="future-note" lang="ko">아직 쓰이지 않았습니다.</span>
        </span>
        <svg className="future-traces" viewBox="0 0 260 132" aria-hidden="true">
          <circle cx="143" cy="55" r="4" fill="none" stroke="currentColor" opacity=".2" />
          <circle cx="201" cy="55" r="4" fill="none" stroke="currentColor" strokeDasharray="9 7 3 6" opacity=".12" />
          <circle cx="232" cy="55" r="1" fill="currentColor" opacity=".12" />
          <circle cx="245" cy="55" r=".8" fill="currentColor" opacity=".07" />
          <circle cx="255" cy="55" r=".6" fill="currentColor" opacity=".035" />
        </svg>
      </div>
    </div>
  </div>;
}
