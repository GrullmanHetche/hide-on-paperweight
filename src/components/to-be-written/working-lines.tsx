import Link from "next/link";
import type { ToBeWrittenEntry } from "@/content/to-be-written";
export type PressedReference = Readonly<{ id: string; numeral: string; title: string }>;

export function WorkingLines({ entries, pressedReferences }: {
  entries: readonly ToBeWrittenEntry[];
  pressedReferences: readonly PressedReference[];
}) {
  if (entries.length === 0) return null;
  return <ol className="working-lines" lang="ko" aria-label="아직 쓰이고 있는 기록">
    {entries.map(entry => {
      const status = entry.status ?? entry.kind;
      const related = entry.kind === "unwritten" && status === "written" && entry.relatedPressedWorkId
        ? pressedReferences.find(work => work.id === entry.relatedPressedWorkId) : undefined;
      return <li key={entry.id} className="working-line" data-kind={entry.kind} data-status={status}>
        <div className="working-record">
          {(entry.date || entry.when) && <div className="working-time">{entry.date && <span>{entry.date}</span>}{entry.when && <span>{entry.when}</span>}</div>}
          <h2>{entry.title}</h2>
          {entry.kind === "given" && (entry.medium || entry.from || entry.to) && <div className="working-direction">
            {entry.medium && <span lang="en">{entry.medium}</span>}
            {entry.from && entry.to ? <span aria-label={`${entry.from}에서 ${entry.to}에게`}>{entry.from}<span aria-hidden="true"> → </span>{entry.to}</span>
              : entry.from ? <span><span lang="en">from </span>{entry.from}</span>
              : entry.to ? <span><span lang="en">to </span>{entry.to}</span> : null}
          </div>}
          {entry.note && <p className="working-note">{entry.note}</p>}
        </div>
        <div className="working-notation">
          <span lang="en">{status}.</span>
          {related && <Link href={`/pressed#pressed-work-${related.id}`} aria-label={`PRESSED — ${related.title}의 기록으로 이동`}><span aria-hidden="true"> → </span>{related.numeral}</Link>}
        </div>
      </li>;
    })}
  </ol>;
}
