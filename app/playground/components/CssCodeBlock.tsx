'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CssCodeBlockProps {
  code: string;
}

export default function CssCodeBlock({ code }: CssCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative rounded-xl border border-border-muted bg-surface-default overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 rounded-md p-1.5 text-foreground-subtle hover:text-foreground-default hover:bg-surface-strong transition-colors"
        aria-label="Copy CSS"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed font-mono text-foreground-muted">
        <code>{code}</code>
      </pre>
    </div>
  );
}
