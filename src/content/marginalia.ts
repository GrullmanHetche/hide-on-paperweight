export type MarginaliaNote = Readonly<{
  id: string;
  text: string;
  date?: string;
  source?: string;
  style?: "ink" | "pencil";
}>;
export type MarginaliaEntry = Readonly<{
  id: string;
  term: string;
  source?: string;
  echoes?: readonly { text: string; source?: string }[];
  type?: string;
  firstObserved?: string;
  notes: readonly MarginaliaNote[];
  status?: "undefined" | "evolving";
  relatedWorkId?: string;
  relatedPortraitObservationId?: string;
}>;

// Only supplied language belongs here. Dates remain as supplied, without an
// inferred year. Append notes in observation order; do not replace old notes.
export const marginaliaEntries: readonly MarginaliaEntry[] = [
  {
    id: "slept-nyang",
    term: "잘 잤느냥?",
    source: "유현",
    echoes: [{ text: "잘 잤냥.", source: "상혁" }],
    status: "evolving",
    notes: [{ id: "meaning", date: "10.05.", text: "잘 잤다는 뜻이라고 한다. 냥은… 고양이 울음소리인가?" }],
  },
];
