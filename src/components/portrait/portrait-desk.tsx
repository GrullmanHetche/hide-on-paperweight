"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Belonging, PortraitData } from "@/content/portrait";
import { PaperweightNavigation } from "@/components/paperweight-navigation";
import { constrainObjectPosition } from "@/lib/object-position";

function BelongingObject({ item, available, selected, onSelect, onTake }: { item: Belonging; available: boolean; selected: boolean; onSelect: (id: string | null) => void; onTake: () => void }) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const object = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  function start(event: PointerEvent<HTMLButtonElement>) {
    // Touch remains ordinary tap/scroll; dragging is a mouse/pen enhancement.
    if (event.pointerType === "touch" || event.button !== 0) return;
    const element = object.current;
    if (!element) return;
    const parent = element.parentElement!.getBoundingClientRect();
    const bounds = element.getBoundingClientRect();
    gesture.current = { x: event.clientX, y: event.clientY, left: bounds.left - parent.left, top: bounds.top - parent.top, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent<HTMLButtonElement>) {
    const initial = gesture.current;
    const element = object.current;
    if (!initial || !element) return;
    const dx = event.clientX - initial.x, dy = event.clientY - initial.y;
    if (!initial.moved && Math.hypot(dx, dy) < 4) return;
    initial.moved = true;
    setDragging(true); onSelect(item.id); onTake();
    const parent = element.parentElement!.getBoundingClientRect();
    setPosition(constrainObjectPosition(initial.left + dx, initial.top + dy,
      parent.width - element.offsetWidth, parent.height - element.offsetHeight));
  }
  function end() {
    if (!gesture.current) return;
    suppressClick.current = gesture.current?.moved ?? false;
    gesture.current = null; setDragging(false);
  }
  const style = {
    "--x": position?.x ?? item.initialPosition.x, "--y": position?.y ?? item.initialPosition.y,
    "--mobile-x": position?.x ?? item.mobilePosition.x, "--mobile-y": position?.y ?? item.mobilePosition.y,
  } as CSSProperties;
  return <div ref={object} className="belonging-object" style={style} hidden={!available} data-selected={selected} data-dragging={dragging}>
    <button className="belonging-control" aria-label={item.name} aria-expanded={selected} aria-controls={`note-${item.id}`}
      onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}
      onMouseEnter={() => onSelect(item.id)} onFocus={() => onSelect(item.id)}
      onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } onSelect(item.id); onTake(); }}
      onKeyDown={event => { if (event.key === "Escape") onSelect(null); }}>
      <Image src={item.asset} width={item.imageSize.width} height={item.imageSize.height} alt={item.name} draggable={false} sizes="96px" />
    </button>
    <div id={`note-${item.id}`} className="belonging-note" aria-live="polite">
      {selected && <><span>{item.name}</span><p>{item.desc}</p></>}
    </div>
  </div>;
}

export function PortraitDesk({ portraits }: { portraits: readonly PortraitData[] }) {
  const [personIndex, setPersonIndex] = useState(0);
  const [hasChosen, setHasChosen] = useState(false);
  const data = portraits[personIndex];
  return <PortraitSheet key={data.name} data={data} portraits={portraits} focusSelection={hasChosen} onChange={index => { setHasChosen(true); setPersonIndex(index); }} />;
}

function PortraitSheet({ data, portraits, onChange, focusSelection }: { data: PortraitData; portraits: readonly PortraitData[]; onChange: (index: number) => void; focusSelection: boolean }) {
  const selector = useRef<HTMLElement>(null);
  useEffect(() => { if (focusSelection) selector.current?.querySelector<HTMLButtonElement>("[aria-current]")?.focus({ preventScroll: true }); }, [focusSelection]);
  const [open, setOpen] = useState(false);
  const [taken, setTaken] = useState<ReadonlySet<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  function take(id: string) { setTaken(previous => previous.has(id) ? previous : new Set([...previous, id])); }
  return <main className="section-desk writing-desk pressed-desk portrait-desk">
    <div className="desk-light" aria-hidden="true" />
    <div className="pressed-sheet-stack">
      <article className="section-paper pressed-paper portrait-paper">
        <header className="pressed-header"><h1 className="section-title"><Link href="/" aria-label="PORTRAIT — HOME으로 돌아가기">PORTRAIT</Link></h1></header>
        <nav ref={selector} className="portrait-selector" aria-label="초상의 주인공">{portraits.map((person, index) => <button key={person.name} aria-current={person.name === data.name ? "page" : undefined} onClick={() => onChange(index)}>{person.name.replace("LEE ", "")}</button>)}</nav>
        <section className="portrait-person" aria-label={data.name}>
          <div className="portrait-identity"><h2>{data.name}</h2><time dateTime={data.birthDate.replaceAll(".", "-")}>{data.birthDate}</time></div>
          <Image className="portrait-token" src={data.tokenAsset} width={500} height={500} sizes="140px" alt={`${data.name}의 작은 인물 토큰`} />
          <div className="portrait-observations">{data.observations.map(observation => <p key={observation.id} lang="ko">{observation.text}</p>)}</div>
        </section>
        {data.artwork && <figure className="portrait-artwork"><Image src={data.artwork.asset} width={data.artwork.width} height={data.artwork.height} alt={data.artwork.alt} sizes="(max-width: 760px) 80vw, 600px" />{data.artwork.caption && <figcaption>{data.artwork.caption}</figcaption>}</figure>}
        <section className="portrait-belongings" aria-label="가방과 소지품" data-open={open} data-many={data.belongings.length > 6}>
          <button className="portrait-bag" aria-label={open ? "가방 닫기" : "가방 열기"} aria-expanded={open} aria-controls="bag-belongings" onClick={() => setOpen(value => !value)}>
            <Image src={data.bagAsset} width={474} height={474} sizes="180px" loading="eager" alt={`${data.name}의 가방`} draggable={false} />
          </button>
          <div id="bag-belongings" className="belongings-stage">{data.belongings.map(item => <BelongingObject key={item.id} item={item} available={open || taken.has(item.id)} selected={selectedId === item.id} onSelect={setSelectedId} onTake={() => take(item.id)} />)}</div>
        </section>
      </article>
    </div>
    <PaperweightNavigation currentSection="portrait" />
  </main>;
}
