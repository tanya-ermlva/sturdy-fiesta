import { learningNotes } from "../data/learning-notes";
import { MemoCardStack } from "./MemoCardStack";

export const metadata = {
  title: "Learning Memo",
  robots: "noindex",
};

export default function MemoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground-default px-4 py-8">
      <MemoCardStack notes={learningNotes} />
    </main>
  );
}
