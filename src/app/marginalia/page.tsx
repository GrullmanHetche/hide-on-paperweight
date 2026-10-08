import type { Metadata } from "next";
import { marginaliaEntries } from "@/content/marginalia";
import { MarginaliaDesk } from "@/components/marginalia/marginalia-desk";
import "../pressed/pressed.css";
import "./marginalia.css";
export const metadata: Metadata = { title: "MARGINALIA" };
export default function MarginaliaPage() { return <MarginaliaDesk entries={marginaliaEntries} />; }
