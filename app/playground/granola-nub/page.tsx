import type { Metadata } from "next";
import GranolaNub from "./GranolaNub";

export const metadata: Metadata = {
  title: "Granola Nub Exploration",
  description: "Dynamic Island-style interaction design prototype",
  robots: "noindex",
};

export default function GranolaNubPage() {
  return <GranolaNub />;
}
