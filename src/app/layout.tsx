import type { Metadata } from "next";
import localFont from "next/font/local";
import { PlaylistSlip } from "@/components/playlist/playlist-slip";
import { playlistTracks } from "@/content/playlist";
import "@fontsource/noto-serif-kr/400.css";
import "./globals.css";

const literary = localFont({
  src: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  display: "block",
  adjustFontFallback: "Times New Roman",
  preload: true,
  variable: "--font-literary",
});
export const metadata: Metadata = {
  title: { default: "HIDE ON PAPERWEIGHT", template: "%s — HIDE ON PAPERWEIGHT" },
  description: "A quiet writing desk. Paper, glass, and the traces of two people.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko" className={literary.variable}><body>{children}<PlaylistSlip tracks={playlistTracks.map(({ id, title, artist }) => ({ id, title, artist }))} /></body></html>;
}
