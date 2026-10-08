import { plateNumber, type BorrowedWork } from "@/content/borrowed";
export function PlateCaption({ work, index, detail = false }: { work: BorrowedWork; index: number; detail?: boolean }) {
  return <div className="plate-caption" lang="ko">
    <span className="plate-number" lang="en">{plateNumber(index)}</span>
    {work.title && (detail ? <h2>{work.title}</h2> : <h3>{work.title}</h3>)}
    {work.subtitle && <p className="plate-subtitle">{work.subtitle}</p>}
    {detail && work.note && <p className="plate-note">{work.note}</p>}
    {detail && (work.creator || work.received) && <p className="plate-provenance">{work.creator && <span>{work.creator}</span>}{work.received && <span>{work.received}</span>}</p>}
  </div>;
}
