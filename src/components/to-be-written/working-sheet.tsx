import Link from "next/link";
import type { ToBeWrittenEntry } from "@/content/to-be-written";
import { PaperweightNavigation } from "@/components/paperweight-navigation";
import { WorkingLines, type PressedReference } from "./working-lines";

export function WorkingSheet({ entries, pressedReferences }: {
  entries: readonly ToBeWrittenEntry[];
  pressedReferences: readonly PressedReference[];
}) {
  return <main className="section-desk writing-desk pressed-desk working-desk">
    <div className="desk-light" aria-hidden="true" />
    <div className="pressed-sheet-stack">
      <article className="section-paper pressed-paper working-paper">
        <header className="pressed-header"><h1 className="section-title"><Link href="/" aria-label="TO BE WRITTEN — HOME으로 돌아가기">TO BE WRITTEN</Link></h1></header>
        <WorkingLines entries={entries} pressedReferences={pressedReferences} />
      </article>
    </div>
    <PaperweightNavigation currentSection="to-be-written" />
  </main>;
}
