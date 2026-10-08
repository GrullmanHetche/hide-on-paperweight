import type { Metadata } from "next";
import { portraits } from "@/content/portrait";
import { PortraitDesk } from "@/components/portrait/portrait-desk";
// Reuse the canonical internal sheet, lighting, arrival and typography rules.
import "../pressed/pressed.css";
import "./portrait.css";
export const metadata: Metadata = { title: "PORTRAIT" };
export default function PortraitPage() { return <PortraitDesk portraits={portraits} />; }
