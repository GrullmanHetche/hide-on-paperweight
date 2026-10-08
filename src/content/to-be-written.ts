type WorkingEntry = Readonly<{
  id: string;
  title: string;
  date?: string;
  when?: string; // User-provided fuzzy time; never inferred or parsed as a date.
  note?: string;
}>;
export type ToBeWrittenEntry = WorkingEntry & (
  | Readonly<{
      kind: "given";
      medium?: "read" | "watch" | "listen" | "play" | "visit" | "other";
      from?: string;
      to?: string;
      status?: "given" | "kept";
    }>
  | Readonly<{
      kind: "unwritten";
      status?: "unwritten" | "written";
      relatedPressedWorkId?: string;
    }>
);

// Explicit editorial order. Only records supplied by the user belong here.
// Kept/written entries remain in the array; no automatic deletion or migration.
export const toBeWrittenEntries: readonly ToBeWrittenEntry[] = [];
