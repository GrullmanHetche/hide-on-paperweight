"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { BorrowedWork } from "@/content/borrowed";

export function PlateMedia({ work, detail = false, page = 0, eager = false }: { work: BorrowedWork; detail?: boolean; page?: number; eager?: boolean }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (work.kind !== "animated" || !detail) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPlaying(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, [work.kind, detail]);
  const documentPage = work.kind === "document" ? work.pages[page] ?? work.pages[0] : undefined;
  const file = documentPage?.file ?? (work.kind === "animated" && !playing ? work.still : work.file);
  return <>
    <Image src={file} width={documentPage?.width ?? work.width} height={documentPage?.height ?? work.height}
      alt={documentPage ? `${work.title ?? work.alt} — ${page + 1}쪽` : work.alt}
      sizes={detail ? "(max-width: 760px) 90vw, 950px" : "(max-width: 760px) 80vw, 480px"}
      quality={detail ? 95 : 80} unoptimized={work.kind === "animated" && playing}
      loading={detail || eager ? "eager" : "lazy"} />
    {work.kind === "animated" && detail && <button className="plate-text-control" aria-pressed={playing} onClick={() => setPlaying(value => !value)}>{playing ? "움직임 멈추기" : "움직임 보기"}</button>}
  </>;
}
