import type { Metadata } from "next";
import ProductsClient from "@/components/pages/ProductsClient";
export const metadata: Metadata = { title: "Our Products", description: "Browse the J-Sunrise Store product catalogue with search and categories." };
export default function Page() { return <ProductsClient />; }
