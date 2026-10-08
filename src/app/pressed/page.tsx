import type { Metadata } from "next";
import { pressedWorks } from "@/content/pressed";
import { PressedDesk } from "@/components/pressed/pressed-desk";
import "./pressed.css";

export const metadata: Metadata = { title: "PRESSED" };
export default function PressedPage() { return <PressedDesk works={pressedWorks} />; }
