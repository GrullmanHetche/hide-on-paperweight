"use client";
import { useEffect, useRef, useState } from "react";
import type { PlaylistTrack } from "@/content/playlist";
import { announceDeskObject, deskObjectOpenEvent, openedDeskObject } from "@/lib/desk-objects";
import "./playlist-slip.css";

export function PlaylistSlip({ tracks }: { tracks: readonly PlaylistTrack[] }) {
  const [open, setOpen] = useState(false);
  const object = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!open) return;
    // Visibility must settle before a freshly revealed sheet can take focus.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
    });
    const dismissOutside = (event: Event) => {
      if (!object.current?.contains(event.target as Node)) setOpen(false);
    };
    const dismissForNavigation = (event: Event) => {
      if (openedDeskObject(event) !== "playlist") setOpen(false);
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    window.addEventListener(deskObjectOpenEvent, dismissForNavigation);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
      window.removeEventListener(deskObjectOpenEvent, dismissForNavigation);
    };
  }, [open]);
  function close() { setOpen(false); control.current?.focus({ preventScroll: true }); }
  return <div className="playlist-object" ref={object} data-open={open} onKeyDown={event => {
    if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); close(); }
  }}>
    <button className="playlist-tab" ref={control} aria-expanded={open} aria-controls="playlist-sheet"
      aria-label={open ? "플레이리스트 접기" : "플레이리스트 펼치기"} onClick={() => {
        if (open) close(); else { announceDeskObject("playlist"); setOpen(true); }
      }}><span>PLAYLIST</span><span className="playlist-count" aria-label={`${tracks.length}곡`}>{String(tracks.length).padStart(2, "0")}</span></button>
    <aside id="playlist-sheet" className="playlist-sheet" aria-labelledby="playlist-heading" aria-hidden={!open} inert={!open}>
      <header><h2 id="playlist-heading" ref={heading} tabIndex={-1}>PLAYLIST</h2><button className="playlist-fold" onClick={close} aria-label="목록 접기">접기</button></header>
      <div className="playlist-scroll" role="region" tabIndex={0} aria-label="곡 목록 — 스크롤하여 모든 곡 읽기">
        <ol>{tracks.map((track, index) => <li key={track.id}>
          <span className="playlist-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div><p className="playlist-title">{track.title}</p><p className="playlist-artist">{track.artist}</p></div>
        </li>)}</ol>
      </div>
    </aside>
  </div>;
}
