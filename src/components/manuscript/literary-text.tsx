import type { RevisionAnnotation } from "@/content/manuscript";

// Index the original string; never trim, split lines, reflow or replace words.
// Invalid/overlapping ranges remain plain text rather than corrupting a work.
export function LiteraryText({ content, sectionId, annotations = [] }: {
  content: string;
  sectionId: string;
  annotations?: readonly RevisionAnnotation[];
}) {
  const ranges = annotations.filter(annotation => annotation.target?.sectionId === sectionId &&
    ["strike", "underline"].includes(annotation.type) && Number.isInteger(annotation.target.start) &&
    Number.isInteger(annotation.target.end) && annotation.target.start! >= 0 &&
    annotation.target.end! > annotation.target.start! && annotation.target.end! <= content.length)
    .toSorted((a, b) => a.target!.start! - b.target!.start!);
  let offset = 0;
  const parts = [];
  for (const annotation of ranges) {
    const { start, end } = annotation.target!;
    if (start! < offset) continue;
    parts.push(content.slice(offset, start));
    parts.push(<span key={annotation.id} className={`literary-mark literary-mark-${annotation.type}`}>{content.slice(start, end)}</span>);
    offset = end!;
  }
  parts.push(content.slice(offset));
  return <>{parts}</>;
}
