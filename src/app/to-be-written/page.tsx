import type { Metadata } from "next";
import { toBeWrittenEntries } from "@/content/to-be-written";
import { pressedWorks } from "@/content/pressed";
import { WorkingSheet } from "@/components/to-be-written/working-sheet";
import "../pressed/pressed.css";
import "./to-be-written.css";
export const metadata: Metadata = { title: "TO BE WRITTEN" };
export default function ToBeWrittenPage() {
  return <WorkingSheet entries={toBeWrittenEntries} pressedReferences={pressedWorks.map(({ id, numeral, title }) => ({ id, numeral, title }))} />;
}
