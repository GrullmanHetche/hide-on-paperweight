// Keep the original string available as one continuous reading experience.
// Cell wrapping is presentation only; explicit newlines start a new row.
export function SquaredManuscript({ content }: { content: string }) {
  return <div className="squared-manuscript">
    <div className="sr-only squared-original">{content}</div>
    <div aria-hidden="true">{content.split("\n").map((line, index) =>
      <div className="squared-line" key={index}>
        {Array.from(line).map((character, position) => <span className="squared-cell" key={position}>{character}</span>)}
      </div>
    )}</div>
  </div>;
}
