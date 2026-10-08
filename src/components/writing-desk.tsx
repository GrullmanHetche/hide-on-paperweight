"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { GlassDome } from "@/components/glass-dome";
import { sections } from "@/lib/navigation";
import { announceDeskObject, deskObjectOpenEvent, openedDeskObject } from "@/lib/desk-objects";

export function WritingDesk() {
  const [landed, setLanded] = useState(false);
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const settle = () => setLanded(true);
    // The hand-guided placement reaches the paper at 2.4s. Its event and this
    // fallback both start the coordinated glass, paper, and shadow press.
    const timer = window.setTimeout(settle, reduced.matches ? 0 : 2400);
    reduced.addEventListener("change", settle);
    return () => { window.clearTimeout(timer); reduced.removeEventListener("change", settle); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!scene.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    const dismissForPlaylist = (event: Event) => { if (openedDeskObject(event) === "playlist") setOpen(false); };
    window.addEventListener(deskObjectOpenEvent, dismissForPlaylist);
    return () => { document.removeEventListener("pointerdown", dismiss); window.removeEventListener(deskObjectOpenEvent, dismissForPlaylist); };
  }, [open]);
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false); button.current?.focus(); }
    const links = Array.from(navigation.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (open && ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 :
        (index + (["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1) + links.length) % links.length;
      links[next]?.focus();
    }
  }
  return <main className="writing-desk" onKeyDown={onKeyDown}>
    <div className="desk-light" aria-hidden="true" />
    <div className="human-shadow human-shadow-near" aria-hidden="true" />
    <div className="human-shadow human-shadow-far" aria-hidden="true" />
    <div className="desk-composition" data-landed={landed} data-open={open}>
      <div className="paper" aria-hidden="true"><div className="paper-corner" /></div>
      <h1 className="home-title">HIDE ON PAPERWEIGHT</h1>
      <div className="navigation-scene" ref={scene}>
        <svg className="placing-hand" viewBox="0 0 2000 420" aria-hidden="true" focusable="false">
          <path d="M2000-40V150C1460 150 920 176 480 244C415 254 374 258 342 286C320 310 287 330 250 331C218 330 194 316 185 298C174 276 166 257 148 247C133 239 112 242 100 235C79 223 75 211 70 199C72 174 94 160 118 155C150 143 176 124 211 117C248 109 281 116 314 128C336 136 366 127 395 113C650 60 1185 13 2000-40Z" />
        </svg>
        <div className="weight-shadow" aria-hidden="true" />
        <button ref={button} className="paperweight" disabled={!landed}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-keyshortcuts="Enter Space"
          aria-expanded={open} aria-controls="desk-navigation"
          onClick={() => { if (!open) announceDeskObject("paperweight"); setOpen(!open); }} onAnimationEnd={() => setLanded(true)}>
          <GlassDome />
        </button>
        <nav id="desk-navigation" aria-label="Writing desk" ref={navigation} inert={!open} className="radial-navigation">
          {sections.map(({ slug, title }, index) => <Link key={slug} href={`/${slug}`}
            className="radial-link" style={{ "--index": index } as CSSProperties} tabIndex={open ? 0 : -1}>
            <span>{title}</span>
          </Link>)}
        </nav>
      </div>
    </div>
  </main>;
}
