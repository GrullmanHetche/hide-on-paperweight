import type { Metadata } from "next";
import { borrowedWorks } from "@/content/borrowed";
import { BorrowedDesk } from "@/components/borrowed/borrowed-desk";
import "../pressed/pressed.css";
import "./borrowed.css";
export const metadata: Metadata = { title: "BORROWED" };
export default function BorrowedPage() { return <BorrowedDesk works={borrowedWorks} />; }
