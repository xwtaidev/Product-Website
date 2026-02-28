import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogToc from "@/components/blog-toc";
import CodeBlock from "@/components/code-block";
import SiteHeader from "@/components/site-header";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog-posts";

type Props = {
  params: Promise<{ slug: string }>;
};

type TocHeading = {
  id: string;
  text: string;
  level: number;
};

type HeadingIdState = {
  countByBaseId: Map<string, number>;
  headingIndex: number;
};

type MarkdownImage = {
  alt: string;
  src: string;
  title: string | null;
};

const BLOG_IMAGE_FALLBACK_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"];

export async function generateStaticParams() {
  const blogPosts = getBlogPosts();
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "文章不存在" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

async function getMarkdownBody(contentFile?: string) {
  if (!contentFile) {
    return null;
  }

  try {
    const filePath = join(process.cwd(), "content", "blog", contentFile);
    const rawMarkdown = await readFile(filePath, "utf8");
    return stripFrontmatter(rawMarkdown);
  } catch {
    return null;
  }
}

function stripFrontmatter(markdown: string) {
  const frontmatterMatch = markdown.match(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!frontmatterMatch) {
    return markdown;
  }

  return frontmatterMatch[1];
}

function stripInlineMarkdownSyntax(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&[A-Za-z0-9#]+;/g, " ")
    .trim();
}

function createHeadingId(rawValue: string, headingIdState: HeadingIdState) {
  headingIdState.headingIndex += 1;
  const plainText = stripInlineMarkdownSyntax(rawValue);
  const normalized = plainText
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const baseId = normalized || `section-${headingIdState.headingIndex}`;
  const currentCount = headingIdState.countByBaseId.get(baseId) ?? 0;
  headingIdState.countByBaseId.set(baseId, currentCount + 1);

  return currentCount === 0 ? baseId : `${baseId}-${currentCount + 1}`;
}

function extractTableOfContents(markdown: string) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const headings: TocHeading[] = [];
  const headingIdState: HeadingIdState = {
    countByBaseId: new Map(),
    headingIndex: 0,
  };
  let activeFence: FenceInfo | null = null;

  for (const line of lines) {
    if (activeFence) {
      if (isFenceClose(line, activeFence)) {
        activeFence = null;
      }
      continue;
    }

    const fenceOpen = getFenceOpen(line);
    if (fenceOpen) {
      activeFence = fenceOpen;
      continue;
    }

    const headingMatch = line.match(/^\s*(#{1,6})\s+(.*)$/);
    if (!headingMatch) {
      continue;
    }

    const level = headingMatch[1].length;
    const id = createHeadingId(headingMatch[2], headingIdState);
    const text = stripInlineMarkdownSyntax(headingMatch[2]);

    if (level >= 2 && level <= 4 && text) {
      headings.push({
        id,
        text,
        level,
      });
    }
  }

  return headings;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInlineMarkdown(value: string) {
  const escaped = escapeHtml(value);

  return escaped
    .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (_match, text: string, href: string) => {
      const safeHref = href.toLowerCase().startsWith("javascript:") ? "#" : href;
      const externalAttrs = /^https?:\/\//i.test(safeHref) ? ' target="_blank" rel="noreferrer"' : "";
      return `<a href="${safeHref}"${externalAttrs} class="underline decoration-zinc-400 underline-offset-4 transition hover:decoration-zinc-700 dark:decoration-zinc-500 dark:hover:decoration-zinc-200">${text}</a>`;
    })
    .replace(
      /`([^`]+)`/g,
      '<code class="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.95em] text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">$1</code>',
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function parseImageLine(line: string): MarkdownImage | null {
  const imageMatch = line.match(/^\s*!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/);
  if (!imageMatch) {
    return null;
  }

  return {
    alt: imageMatch[1].trim(),
    src: imageMatch[2].trim(),
    title: imageMatch[3]?.trim() || null,
  };
}

function resolveMarkdownImageSource(source: string, postSlug?: string) {
  const normalizedSource = source.trim();
  if (!normalizedSource || normalizedSource.toLowerCase().startsWith("javascript:")) {
    return "#";
  }

  if (normalizedSource.startsWith("http://") || normalizedSource.startsWith("https://") || normalizedSource.startsWith("/") || normalizedSource.startsWith("data:")) {
    return normalizedSource;
  }

  const cleanedRelativePath = normalizedSource
    .replace(/^(\.\/)+/, "")
    .replace(/^\/+/, "")
    .replace(/^(\.\.\/)+/, "");

  const blogRelativePath = cleanedRelativePath.replace(/^blog\//, "");
  const candidatePublicPath = join(process.cwd(), "public", "blog", blogRelativePath);
  if (existsSync(candidatePublicPath)) {
    return `/blog/${blogRelativePath}`;
  }

  // Common compatibility case: markdown uses nested "image/xxx.png"
  // while file is placed directly under public/blog/xxx.png.
  const fileName = basename(blogRelativePath);
  const flatCandidatePublicPath = join(process.cwd(), "public", "blog", fileName);
  if (existsSync(flatCandidatePublicPath)) {
    return `/blog/${fileName}`;
  }

  if (postSlug) {
    for (const extension of BLOG_IMAGE_FALLBACK_EXTENSIONS) {
      const fallbackPublicPath = join(process.cwd(), "public", "blog", `${postSlug}${extension}`);
      if (existsSync(fallbackPublicPath)) {
        return `/blog/${postSlug}${extension}`;
      }
    }
  }

  return `/blog/${blogRelativePath}`;
}

type FenceInfo = {
  marker: "`" | "~";
  markerCount: number;
  language: string | null;
};

function getFenceOpen(line: string): FenceInfo | null {
  const match = line.match(/^\s*(`{3,}|~{3,})([^\n]*)$/);
  if (!match) {
    return null;
  }

  const marker = match[1][0] as FenceInfo["marker"];
  const markerCount = match[1].length;
  const infoString = match[2].trim();
  if (infoString.includes(marker)) {
    return null;
  }

  const language = infoString ? infoString.split(/\s+/)[0].toLowerCase() : null;
  return { marker, markerCount, language };
}

function isFenceClose(line: string, fence: FenceInfo) {
  const trimmed = line.trim();
  if (!trimmed) {
    return false;
  }

  if (!trimmed.startsWith(fence.marker.repeat(fence.markerCount))) {
    return false;
  }

  const closeRegExp = fence.marker === "`" ? new RegExp(`^\`{${fence.markerCount},}$`) : new RegExp(`^~{${fence.markerCount},}$`);
  return closeRegExp.test(trimmed);
}

function stripCommonIndent(lines: string[]) {
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  if (nonEmptyLines.length === 0) {
    return lines;
  }

  const minIndent = nonEmptyLines.reduce((currentMin, line) => {
    const leadingSpaces = line.match(/^\s*/)?.[0].length ?? 0;
    return Math.min(currentMin, leadingSpaces);
  }, Number.POSITIVE_INFINITY);

  if (!Number.isFinite(minIndent) || minIndent <= 0) {
    return lines;
  }

  return lines.map((line) => {
    if (!line.trim()) {
      return "";
    }
    return line.slice(minIndent);
  });
}

type CodeToken = {
  kind: "text" | "string" | "comment";
  value: string;
};

const PYTHON_KEYWORDS = new Set([
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "False",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "None",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "True",
  "try",
  "while",
  "with",
  "yield",
]);

function tokenizePython(code: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let index = 0;
  let textBuffer = "";

  const flushText = () => {
    if (textBuffer) {
      tokens.push({ kind: "text", value: textBuffer });
      textBuffer = "";
    }
  };

  const codeLength = code.length;
  while (index < codeLength) {
    const rest = code.slice(index);
    const prefixMatch = rest.match(/^([rRuUbBfF]{1,2})(?="""|'''|"|')/);
    if (prefixMatch) {
      const prefixLength = prefixMatch[1].length;
      const quoteStart = index + prefixLength;
      const tripleQuote = code.slice(quoteStart, quoteStart + 3);
      const isTriple = tripleQuote === '"""' || tripleQuote === "'''";
      const quoteToken = isTriple ? tripleQuote : code[quoteStart];

      flushText();
      let cursor = quoteStart + quoteToken.length;
      while (cursor < codeLength) {
        if (isTriple) {
          if (code.startsWith(quoteToken, cursor)) {
            cursor += quoteToken.length;
            break;
          }
          cursor += 1;
          continue;
        }

        if (code[cursor] === "\\" && cursor + 1 < codeLength) {
          cursor += 2;
          continue;
        }
        if (code[cursor] === quoteToken) {
          cursor += 1;
          break;
        }
        if (code[cursor] === "\n") {
          break;
        }
        cursor += 1;
      }

      tokens.push({ kind: "string", value: code.slice(index, cursor) });
      index = cursor;
      continue;
    }

    const char = code[index];
    const tripleQuote = code.slice(index, index + 3);
    const isTripleQuote = tripleQuote === '"""' || tripleQuote === "'''";

    if (char === "#") {
      flushText();
      let cursor = index;
      while (cursor < codeLength && code[cursor] !== "\n") {
        cursor += 1;
      }
      tokens.push({ kind: "comment", value: code.slice(index, cursor) });
      index = cursor;
      continue;
    }

    if (isTripleQuote || char === '"' || char === "'") {
      const quoteToken = isTripleQuote ? tripleQuote : char;
      flushText();

      let cursor = index + quoteToken.length;
      while (cursor < codeLength) {
        if (isTripleQuote) {
          if (code.startsWith(quoteToken, cursor)) {
            cursor += quoteToken.length;
            break;
          }
          cursor += 1;
          continue;
        }

        if (code[cursor] === "\\" && cursor + 1 < codeLength) {
          cursor += 2;
          continue;
        }
        if (code[cursor] === quoteToken) {
          cursor += 1;
          break;
        }
        if (code[cursor] === "\n") {
          break;
        }
        cursor += 1;
      }

      tokens.push({ kind: "string", value: code.slice(index, cursor) });
      index = cursor;
      continue;
    }

    textBuffer += char;
    index += 1;
  }

  flushText();
  return tokens;
}

function highlightPythonText(text: string) {
  const tokenRegExp = /@\w+|\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b/g;
  let cursor = 0;
  let html = "";
  let match = tokenRegExp.exec(text);

  while (match) {
    const token = match[0];
    const tokenStart = match.index;
    const tokenEnd = tokenStart + token.length;
    html += escapeHtml(text.slice(cursor, tokenStart));

    if (token.startsWith("@")) {
      html += `<span class="text-sky-700 dark:text-sky-300">${escapeHtml(token)}</span>`;
    } else if (/^\d/.test(token)) {
      html += `<span class="text-amber-700 dark:text-amber-300">${escapeHtml(token)}</span>`;
    } else if (PYTHON_KEYWORDS.has(token)) {
      html += `<span class="font-medium text-indigo-700 dark:text-indigo-300">${escapeHtml(token)}</span>`;
    } else {
      html += escapeHtml(token);
    }

    cursor = tokenEnd;
    match = tokenRegExp.exec(text);
  }

  html += escapeHtml(text.slice(cursor));
  return html;
}

function highlightPythonCode(code: string) {
  return tokenizePython(code)
    .map((token) => {
      if (token.kind === "comment") {
        return `<span class="italic text-zinc-500 dark:text-zinc-400">${escapeHtml(token.value)}</span>`;
      }

      if (token.kind === "string") {
        return `<span class="text-emerald-700 dark:text-emerald-300">${escapeHtml(token.value)}</span>`;
      }

      return highlightPythonText(token.value);
    })
    .join("");
}

function highlightCode(code: string, language: string | null) {
  if (language === "python" || language === "py") {
    return highlightPythonCode(code);
  }

  return escapeHtml(code);
}

type ParsedListLine = {
  indent: number;
  ordered: boolean;
  text: string;
};

function normalizeIndent(line: string) {
  return line.replaceAll("\t", "    ");
}

function getIndentLevel(line: string) {
  const normalizedLine = normalizeIndent(line);
  return normalizedLine.match(/^\s*/)?.[0].length ?? 0;
}

function parseListLine(line: string): ParsedListLine | null {
  const normalizedLine = normalizeIndent(line);
  const unorderedMatch = normalizedLine.match(/^(\s*)[-*+]\s+(.*)$/);
  if (unorderedMatch) {
    return {
      indent: unorderedMatch[1].length,
      ordered: false,
      text: unorderedMatch[2].trim(),
    };
  }

  const orderedMatch = normalizedLine.match(/^(\s*)\d+[.)]\s+(.*)$/);
  if (orderedMatch) {
    return {
      indent: orderedMatch[1].length,
      ordered: true,
      text: orderedMatch[2].trim(),
    };
  }

  return null;
}

function parseTableRow(line: string) {
  const trimmedLine = line.trim();
  if (!trimmedLine.includes("|")) {
    return null;
  }

  const rowText = trimmedLine.replace(/^\|/, "").replace(/\|$/, "");
  const cells = rowText.split("|").map((cell) => cell.trim());
  if (cells.length < 2) {
    return null;
  }

  return cells;
}

function isTableSeparatorLine(line: string) {
  const cells = parseTableRow(line);
  if (!cells) {
    return false;
  }

  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isTableStarter(lines: string[], index: number) {
  if (index + 1 >= lines.length) {
    return false;
  }

  const headerCells = parseTableRow(lines[index]);
  if (!headerCells) {
    return false;
  }

  const separatorCells = parseTableRow(lines[index + 1]);
  if (!separatorCells) {
    return false;
  }

  return headerCells.length === separatorCells.length && isTableSeparatorLine(lines[index + 1]);
}

function renderTableBlock(lines: string[], startIndex: number, key: string) {
  const headerCells = parseTableRow(lines[startIndex]) || [];
  let index = startIndex + 2;
  const bodyRows: string[][] = [];

  while (index < lines.length) {
    const currentLine = lines[index];
    if (!currentLine.trim()) {
      break;
    }

    if (getFenceOpen(currentLine) || /^\s*(#{1,6})\s+/.test(currentLine) || parseListLine(currentLine)) {
      break;
    }

    const rowCells = parseTableRow(currentLine);
    if (!rowCells || rowCells.length !== headerCells.length) {
      break;
    }

    bodyRows.push(rowCells);
    index += 1;
  }

  const tableNode = (
    <div key={key} className="mt-8 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-zinc-100/80 dark:bg-zinc-800/70">
          <tr>
            {headerCells.map((cell, cellIndex) => (
              <th
                key={`${key}-head-${cellIndex}`}
                className="border-b border-zinc-200 px-4 py-3 text-left font-medium text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell) }}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((rowCells, rowIndex) => (
            <tr key={`${key}-row-${rowIndex}`} className="bg-white/80 dark:bg-zinc-900/60">
              {rowCells.map((cell, cellIndex) => (
                <td
                  key={`${key}-cell-${rowIndex}-${cellIndex}`}
                  className="border-t border-zinc-200 px-4 py-3 leading-7 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell) }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return {
    nextIndex: index,
    node: tableNode,
  };
}

function findNextNonEmptyLine(lines: string[], startIndex: number) {
  let index = startIndex;
  while (index < lines.length) {
    if (lines[index].trim()) {
      return index;
    }
    index += 1;
  }
  return -1;
}

function renderListBlock(
  lines: string[],
  startIndex: number,
  keyPrefix: string,
  headingIdState: HeadingIdState,
  postSlug?: string,
) {
  const firstListLine = parseListLine(lines[startIndex]);
  if (!firstListLine) {
    return {
      nextIndex: startIndex + 1,
      node: null as ReactNode,
    };
  }

  const baseIndent = firstListLine.indent;
  const ordered = firstListLine.ordered;
  const items: Array<{ text: string; children: ReactNode[] }> = [];
  let index = startIndex;

  while (index < lines.length) {
    const currentLine = lines[index];

    if (!currentLine.trim()) {
      const nextNonEmptyLine = findNextNonEmptyLine(lines, index + 1);
      if (nextNonEmptyLine === -1) {
        index = lines.length;
        break;
      }

      const nextListLine = parseListLine(lines[nextNonEmptyLine]);
      if (!nextListLine || nextListLine.indent < baseIndent || (nextListLine.indent === baseIndent && nextListLine.ordered !== ordered)) {
        index = nextNonEmptyLine;
        break;
      }

      index = nextNonEmptyLine;
      continue;
    }

    const parsedLine = parseListLine(currentLine);
    if (!parsedLine) {
      break;
    }

    if (parsedLine.indent < baseIndent || parsedLine.indent > baseIndent || parsedLine.ordered !== ordered) {
      break;
    }

    index += 1;
    const childLines: string[] = [];
    let activeFence: FenceInfo | null = null;

    while (index < lines.length) {
      const candidateLine = lines[index];
      if (activeFence) {
        childLines.push(candidateLine);
        if (isFenceClose(candidateLine, activeFence)) {
          activeFence = null;
        }
        index += 1;
        continue;
      }

      const candidateFence = getFenceOpen(candidateLine);
      if (candidateFence) {
        activeFence = candidateFence;
        childLines.push(candidateLine);
        index += 1;
        continue;
      }

      const candidateListLine = parseListLine(candidateLine);

      if (candidateListLine && candidateListLine.indent <= baseIndent) {
        break;
      }

      if (!candidateLine.trim()) {
        const nextNonEmptyLine = findNextNonEmptyLine(lines, index + 1);
        if (nextNonEmptyLine === -1) {
          childLines.push(candidateLine);
          index += 1;
          break;
        }

        const nextListLine = parseListLine(lines[nextNonEmptyLine]);
        if (nextListLine && nextListLine.indent <= baseIndent) {
          index = nextNonEmptyLine;
          break;
        }

        if (!nextListLine && getIndentLevel(lines[nextNonEmptyLine]) <= baseIndent) {
          index = nextNonEmptyLine;
          break;
        }
      }

      if (candidateLine.trim() && !candidateListLine && getIndentLevel(candidateLine) <= baseIndent) {
        break;
      }

      childLines.push(candidateLine);
      index += 1;
    }

    const normalizedChildLines = stripCommonIndent(childLines);
    const childMarkdown = normalizedChildLines.join("\n").trim();
    const childNodes = childMarkdown ? renderMarkdown(childMarkdown, postSlug, headingIdState) : [];
    items.push({
      text: parsedLine.text,
      children: childNodes,
    });
  }

  const listClassName = ordered
    ? "mt-6 ml-6 list-decimal space-y-2 text-base leading-8 text-zinc-700 dark:text-zinc-300"
    : "mt-6 ml-6 list-disc space-y-2 text-base leading-8 text-zinc-700 dark:text-zinc-300";

  const listItems = items.map((item, itemIndex) => (
    <li key={`${keyPrefix}-item-${itemIndex}`}>
      <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.text) }} />
      {item.children.length > 0 ? <div className="mt-2">{item.children}</div> : null}
    </li>
  ));

  const listNode = ordered ? (
    <ol key={`${keyPrefix}-list`} className={listClassName}>
      {listItems}
    </ol>
  ) : (
    <ul key={`${keyPrefix}-list`} className={listClassName}>
      {listItems}
    </ul>
  );

  return {
    nextIndex: index,
    node: listNode,
  };
}

function isBlockStarter(line: string) {
  return /^\s*(#{1,6})\s+/.test(line) || getFenceOpen(line) !== null || parseListLine(line) !== null || parseTableRow(line) !== null;
}

function renderHeading(level: number, value: string, key: string, headingId?: string) {
  const headingLevel = Math.min(Math.max(level, 1), 6);
  const classByLevel: Record<number, string> = {
    1: "font-display mt-10 scroll-mt-28 text-4xl leading-tight font-semibold tracking-tight text-zinc-950 dark:text-zinc-100",
    2: "font-display mt-9 scroll-mt-28 text-3xl leading-tight font-semibold tracking-tight text-zinc-950 dark:text-zinc-100",
    3: "font-display mt-8 scroll-mt-28 text-2xl leading-tight font-semibold tracking-tight text-zinc-950 dark:text-zinc-100",
    4: "font-display mt-7 scroll-mt-28 text-xl leading-tight font-semibold tracking-tight text-zinc-950 dark:text-zinc-100",
    5: "mt-6 scroll-mt-28 text-lg leading-tight font-semibold text-zinc-950 dark:text-zinc-100",
    6: "mt-5 scroll-mt-28 text-base leading-tight font-semibold text-zinc-950 dark:text-zinc-100",
  };
  const html = renderInlineMarkdown(value.trim());

  if (headingLevel === 1) {
    return <h1 id={headingId} key={key} className={classByLevel[1]} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  if (headingLevel === 2) {
    return <h2 id={headingId} key={key} className={classByLevel[2]} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  if (headingLevel === 3) {
    return <h3 id={headingId} key={key} className={classByLevel[3]} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  if (headingLevel === 4) {
    return <h4 id={headingId} key={key} className={classByLevel[4]} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  if (headingLevel === 5) {
    return <h5 id={headingId} key={key} className={classByLevel[5]} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return <h6 id={headingId} key={key} className={classByLevel[6]} dangerouslySetInnerHTML={{ __html: html }} />;
}

function renderMarkdown(
  markdown: string,
  postSlug?: string,
  headingIdState: HeadingIdState = {
    countByBaseId: new Map(),
    headingIndex: 0,
  },
): ReactNode[] {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  let blockKey = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const fenceOpen = getFenceOpen(line);
    if (fenceOpen) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !isFenceClose(lines[index], fenceOpen)) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length && isFenceClose(lines[index], fenceOpen)) {
        index += 1;
      }

      const normalizedCodeLines = stripCommonIndent(codeLines);
      const normalizedCode = normalizedCodeLines.join("\n");
      const highlightedCode = highlightCode(normalizedCode, fenceOpen.language);
      blocks.push(
        <CodeBlock
          key={`block-${blockKey++}`}
          rawCode={normalizedCode}
          highlightedCode={highlightedCode}
          language={fenceOpen.language}
        />,
      );
      continue;
    }

    const headingMatch = line.match(/^\s*(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const headingId = createHeadingId(headingMatch[2], headingIdState);
      blocks.push(renderHeading(headingMatch[1].length, headingMatch[2], `block-${blockKey++}`, headingId));
      index += 1;
      continue;
    }

    if (parseListLine(line)) {
      const listBlock = renderListBlock(lines, index, `block-${blockKey++}`, headingIdState, postSlug);
      if (listBlock.node) {
        blocks.push(listBlock.node);
      }
      index = listBlock.nextIndex;
      continue;
    }

    if (isTableStarter(lines, index)) {
      const tableBlock = renderTableBlock(lines, index, `block-${blockKey++}`);
      blocks.push(tableBlock.node);
      index = tableBlock.nextIndex;
      continue;
    }

    const imageLine = parseImageLine(trimmed);
    if (imageLine) {
      const resolvedImageSource = resolveMarkdownImageSource(imageLine.src, postSlug);
      blocks.push(
        <figure key={`block-${blockKey++}`} className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/60">
          <img
            src={resolvedImageSource}
            alt={imageLine.alt || "Article image"}
            loading="lazy"
            className="h-auto w-full object-cover"
          />
          {imageLine.title ? (
            <figcaption className="border-t border-zinc-200 px-4 py-2 text-xs leading-6 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              {imageLine.title}
            </figcaption>
          ) : null}
        </figure>,
      );
      index += 1;
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && lines[index].trim() && !isBlockStarter(lines[index])) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push(
        <p
          key={`block-${blockKey++}`}
          className="mt-6 text-base leading-8 text-zinc-700 dark:text-zinc-300"
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(paragraphLines.join(" ")) }}
        />,
      );
      continue;
    }

    // Fallback for single-line markdown that is not matched by rules above.
    blocks.push(
      <p
        key={`block-${blockKey++}`}
        className="mt-6 text-base leading-8 text-zinc-700 dark:text-zinc-300"
        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line) }}
      />,
    );
    index += 1;
  }

  return blocks;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const markdownBody = await getMarkdownBody(post.contentFile);
  const tocHeadings = markdownBody ? extractTableOfContents(markdownBody) : [];
  const hasTableOfContents = tocHeadings.length > 0;
  const paragraphs = [post.excerpt];

  return (
    <div className="min-h-[100dvh] bg-background text-zinc-950 dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hero-glow hero-glow-top" />
        <div className="hero-glow hero-glow-bottom" />
      </div>

      <SiteHeader />

      <main className="mx-auto w-full max-w-[82rem] px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-18">
        <Link
          href="/blog"
          className="text-xs tracking-[0.12em] uppercase text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to blog
        </Link>

        <div
          className={
            hasTableOfContents
              ? "mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_19rem]"
              : "mt-6"
          }
        >
          <article className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/82 dark:border-zinc-800 dark:bg-zinc-900/72">
            <div className="relative aspect-[16/9] overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1280px) 980px, (min-width: 1024px) 72vw, 100vw"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase text-white">
                {post.category}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.1em] uppercase text-zinc-500 dark:text-zinc-400">
                <span>{post.publishedAt}</span>
                <span className="text-zinc-300 dark:text-zinc-600">•</span>
                <span>{post.readTime}</span>
              </div>

              <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                {post.title}
              </h1>

              {markdownBody ? (
                <div className="mt-1">{renderMarkdown(markdownBody, post.slug)}</div>
              ) : (
                <div className="mt-6 space-y-5 text-base leading-8 text-zinc-700 dark:text-zinc-300">
                  {paragraphs.map((paragraph, index) => (
                    <p key={`${post.slug}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </article>

          {hasTableOfContents ? <BlogToc headings={tocHeadings} /> : null}
        </div>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-xs tracking-[0.08em] uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        © {new Date().getFullYear()} Wayne Xu
      </footer>
    </div>
  );
}
