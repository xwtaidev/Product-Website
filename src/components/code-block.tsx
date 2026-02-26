"use client";

import { useEffect, useRef, useState } from "react";

type CodeBlockProps = {
  rawCode: string;
  highlightedCode: string;
  language: string | null;
};

export default function CodeBlock({ rawCode, highlightedCode, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const markCopied = () => {
    setCopied(true);
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      markCopied();
      return;
    } catch {
      // Fallback for browsers where clipboard API is unavailable.
      const textArea = document.createElement("textarea");
      textArea.value = rawCode;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      markCopied();
    }
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
        <span className="text-[11px] tracking-[0.08em] uppercase text-zinc-500 dark:text-zinc-400">{language ?? "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-xs text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          {copied ? "已复制" : "复制"}
        </button>
      </div>

      <pre className="overflow-x-auto bg-zinc-100 p-4 text-sm leading-7 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
        <code className="block whitespace-pre" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  );
}
