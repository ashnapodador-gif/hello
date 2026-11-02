import type { Metadata } from "next";
import GalleryClient from "@/components/pages/GalleryClient";
export const metadata: Metadata = { title: "Gallery", description: "Photo gallery of the JSunrise store — interior, exterior and promotions." };
export default function Page() { return <GalleryClient />; }
