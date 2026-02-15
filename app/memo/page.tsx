import { learningNotes } from "../data/learning-notes";
import { MemoDemo } from "../components/ui/MemoDemo";

export const metadata = {
  title: "Learning Memo",
  robots: "noindex",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

export default function MemoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground-default px-6 py-12 sm:px-10">
      {/* Mobile section navigation */}
      <nav className="sticky top-0 z-10 -mx-6 px-6 sm:-mx-10 sm:px-10 py-3 mb-8 glass border-b border-border-subtle">
        <div className="mx-auto max-w-2xl">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {learningNotes.map((cat) => (
              <a
                key={cat.category}
                href={`#${slugify(cat.category)}`}
                className="shrink-0 px-3 py-1 text-xs rounded-full bg-surface text-foreground-muted hover:text-foreground-strong transition-colors"
              >
                {cat.category}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl text-foreground-strong mb-2">Learning Memo</h1>
        <p className="text-foreground-muted text-sm mb-10">
          Quick reference for concepts from our coding sessions.
        </p>

        <div className="space-y-10">
          {learningNotes.map((cat) => (
            <section
              key={cat.category}
              id={slugify(cat.category)}
              className="scroll-mt-16"
            >
              <h2 className="text-lg text-foreground-strong mb-4">
                {cat.category}
              </h2>

              <div className="space-y-6">
                {cat.subcategories.map((sub) => (
                  <div key={sub.name}>
                    <h3 className="text-sm text-foreground-muted uppercase tracking-wide mb-3">
                      {sub.name}
                    </h3>

                    <dl className="space-y-4">
                      {sub.notes.map((note) => (
                        <div
                          key={note.title}
                          className="border-l-2 border-border-muted pl-4"
                        >
                          <dt className="text-foreground-strong text-sm">
                            {note.title}
                          </dt>
                          <dd className="text-foreground-muted text-sm mt-1">
                            {note.explanation}
                          </dd>

                          {note.illustration && (
                            <div className="mt-3">
                              {note.illustration.label && (
                                <p className="text-[10px] text-foreground-subtle mb-1.5 uppercase tracking-wider">
                                  {note.illustration.label}
                                </p>
                              )}

                              {note.illustration.type === "code" && (
                                <pre className="bg-surface rounded-lg p-3 overflow-x-auto">
                                  <code className="text-xs text-foreground-default font-mono whitespace-pre">
                                    {note.illustration.content}
                                  </code>
                                </pre>
                              )}

                              {note.illustration.type === "diagram" && (
                                <pre className="bg-surface rounded-lg p-3 overflow-x-auto">
                                  <code className="text-xs text-foreground-muted font-mono whitespace-pre leading-relaxed">
                                    {note.illustration.content}
                                  </code>
                                </pre>
                              )}

                              {note.illustration.type === "demo" &&
                                note.illustration.demoId && (
                                  <MemoDemo
                                    demoId={note.illustration.demoId}
                                  />
                                )}
                            </div>
                          )}
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
