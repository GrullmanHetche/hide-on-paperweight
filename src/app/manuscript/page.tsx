import type { Metadata } from "next";
import { manuscriptWorks } from "@/content/manuscript";
import { ManuscriptDesk } from "@/components/manuscript/manuscript-desk";
import "../pressed/pressed.css";
import "./manuscript.css";
export const metadata: Metadata = { title: "MANUSCRIPT" };
export default function ManuscriptPage() { return <ManuscriptDesk works={manuscriptWorks} />; }
