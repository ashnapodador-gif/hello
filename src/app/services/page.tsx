import type { Metadata } from "next";
import ServicesClient from "@/components/pages/ServicesClient";
export const metadata: Metadata = { title: "Our Services", description: "Professional services offered by JSunrise Marketing Office." };
export default function Page() { return <ServicesClient />; }
