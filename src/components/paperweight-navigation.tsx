"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { GlassDome } from "@/components/glass-dome";
import { sections } from "@/lib/navigation";
import { announceDeskObject, deskObjectOpenEvent, openedDeskObject } from "@/lib/desk-objects";
import "./paperweight-navigation.css";

// The HOME glass, link registry, ink feedback, and staggered radial styles are
// reused here. Only the orbit changes to stay inside the top-right viewport.
export function PaperweightNavigation({ currentSection = "pressed" }: { currentSection?: string }) {
  const [open, setOpen] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
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
    if (event.key === "Escape" && open) {
      event.preventDefault(); event.stopPropagation(); setOpen(false); button.current?.focus();
    }
    if (!open || !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const links = Array.from(navigation.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 :
      (current + (["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1) + links.length) % links.length;
    links[next]?.focus();
  }
  return <div className="peripheral-navigation" ref={scene} data-open={open} onKeyDown={onKeyDown}>
    <div className="weight-shadow" aria-hidden="true" />
    <button ref={button} className="paperweight" aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open} aria-controls="peripheral-menu" onClick={() => { if (!open) announceDeskObject("paperweight"); setOpen(!open); }}>
      <GlassDome />
    </button>
    <nav id="peripheral-menu" className="radial-navigation" aria-label="Writing desk" ref={navigation} inert={!open}>
      {sections.map(({ slug, title }, index) => <Link key={slug} href={`/${slug}`} aria-current={slug === currentSection ? "page" : undefined}
        className="radial-link" style={{ "--index": index } as CSSProperties} tabIndex={open ? 0 : -1}>
        <span>{title}</span>
      </Link>)}
      <Link href="/" className="peripheral-home" tabIndex={open ? 0 : -1}>← HIDE ON PAPERWEIGHT</Link>
    </nav>
  </div>;
}
