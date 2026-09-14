import type { Metadata } from "next";
import { DemoFlow } from "@/components/demo/demo-flow";
import "./demo.css";
export const metadata: Metadata = {
  title: "Try UNUKAR — Keep this moment",
  description:
    "Experience UNUKAR in a minute. Keep a photo, your voice, and the connections that changed your journey.",
  alternates: { canonical: "https://unukar.vercel.app/demo" },
  openGraph: {
    title: "Try UNUKAR — Keep this moment",
    description:
      "One photo. Your voice. A connection that changes the journey.",
    url: "https://unukar.vercel.app/demo",
  },
  twitter: {
    card: "summary",
    title: "Try UNUKAR — Keep this moment",
    description: "Experience a small moment and its bigger story.",
  },
};
export default function DemoPage() {
  return <DemoFlow />;
}
