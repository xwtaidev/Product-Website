import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  coverImage: string;
  contentFile?: string;
};

const CONTENT_BLOG_DIR = join(process.cwd(), "content", "blog");
const PUBLIC_BLOG_DIR = join(process.cwd(), "public", "blog");
const COVER_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"];

function stripMarkdownExtension(value: string) {
  return value.replace(/\.(md|markdown)$/i, "");
}

function hashString(value: string) {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  }
  return hash.toString(36);
}

function toSlug(value: string, fallbackSeed: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^\p{Letter}\p{Number}-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (slug) {
    return slug;
  }

  return `post-${hashString(fallbackSeed)}`;
}

function formatPublishedAt(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function parsePublishedTimestamp(value: string) {
  const dotted = value.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (dotted) {
    return new Date(`${dotted[1]}-${dotted[2]}-${dotted[3]}T00:00:00`).getTime();
  }

  const nativeTime = new Date(value).getTime();
  return Number.isNaN(nativeTime) ? 0 : nativeTime;
}

function parsePublishedAt(value: string | undefined, fallbackDate: Date) {
  if (!value) {
    return formatPublishedAt(fallbackDate);
  }

  const nativeTime = new Date(value).getTime();
  if (!Number.isNaN(nativeTime)) {
    return formatPublishedAt(new Date(nativeTime));
  }

  if (/^\d{4}\.\d{2}\.\d{2}$/.test(value.trim())) {
    return value.trim();
  }

  return formatPublishedAt(fallbackDate);
}

function stripQuotes(value: string) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function parseFrontmatter(markdown: string) {
  const frontmatterMatch = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!frontmatterMatch) {
    return { data: {} as Record<string, string>, body: markdown };
  }

  const data: Record<string, string> = {};
  const lines = frontmatterMatch[1].split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.+)$/);
    if (!match) {
      continue;
    }
    data[match[1]] = stripQuotes(match[2].trim());
  }

  return { data, body: frontmatterMatch[2] };
}

function extractTitle(body: string, slug: string) {
  const headingMatch = body.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function extractExcerpt(body: string) {
  const lines = body.replaceAll("\r\n", "\n").split("\n");
  let inFence = false;
  const sentenceParts: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (sentenceParts.length > 0) {
        break;
      }
      continue;
    }

    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }

    if (
      /^#/.test(trimmed) ||
      /^[-*+]\s+/.test(trimmed) ||
      /^\d+[.)]\s+/.test(trimmed) ||
      trimmed.startsWith(">") ||
      /^\[.+\]\(.+\)$/.test(trimmed)
    ) {
      continue;
    }

    sentenceParts.push(trimmed);
    if (sentenceParts.join(" ").length >= 120) {
      break;
    }
  }

  const excerpt = sentenceParts.join(" ").trim();
  if (!excerpt) {
    return "A new post from content/blog.";
  }

  return excerpt.length > 140 ? `${excerpt.slice(0, 140)}...` : excerpt;
}

function estimateReadTime(body: string) {
  const cjkCount = (body.match(/[\u4e00-\u9fff]/g) || []).length;
  const latinWordCount = (body.replace(/[\u4e00-\u9fff]/g, " ").match(/[A-Za-z0-9_]+/g) || []).length;
  const minutes = Math.max(1, Math.ceil(cjkCount / 350 + latinWordCount / 220));
  return `${minutes} min`;
}

function resolveCoverImage(slug: string, frontmatterCoverImage: string | undefined) {
  if (frontmatterCoverImage) {
    if (frontmatterCoverImage.startsWith("http://") || frontmatterCoverImage.startsWith("https://") || frontmatterCoverImage.startsWith("/")) {
      return frontmatterCoverImage;
    }
    return `/blog/${frontmatterCoverImage}`;
  }

  for (const extension of COVER_EXTENSIONS) {
    const filePath = join(PUBLIC_BLOG_DIR, `${slug}${extension}`);
    if (existsSync(filePath)) {
      return `/blog/${slug}${extension}`;
    }
  }

  return `https://picsum.photos/seed/blog-${slug}/1200/800`;
}

function getFilePosts(): BlogPost[] {
  if (!existsSync(CONTENT_BLOG_DIR)) {
    return [];
  }

  const files = readdirSync(CONTENT_BLOG_DIR).filter((file) => /\.(md|markdown)$/i.test(file));
  const posts = files.map((fileName) => {
    const filePath = join(CONTENT_BLOG_DIR, fileName);
    const markdown = readFileSync(filePath, "utf8");
    const { data, body } = parseFrontmatter(markdown);
    const slugSource = data.slug?.trim() || data.title?.trim() || stripMarkdownExtension(fileName);
    const slug = toSlug(slugSource, fileName);
    const fileStats = statSync(filePath);

    const title = data.title?.trim() || extractTitle(body, slug);
    const excerpt = data.excerpt?.trim() || extractExcerpt(body);
    const category = data.category?.trim() || "Blog";
    const readTime = data.readTime?.trim() || estimateReadTime(body);
    const publishedAt = parsePublishedAt(data.publishedAt?.trim(), fileStats.mtime);
    const coverImage = resolveCoverImage(slug, data.coverImage?.trim());

    return {
      slug,
      title,
      excerpt,
      category,
      readTime,
      publishedAt,
      coverImage,
      contentFile: fileName,
    } satisfies BlogPost;
  });

  return posts.sort((a, b) => parsePublishedTimestamp(b.publishedAt) - parsePublishedTimestamp(a.publishedAt));
}

export function getBlogPosts() {
  return getFilePosts();
}

export function getBlogPostBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = decodedSlug.toLowerCase();

  return getBlogPosts().find((post) => post.slug === decodedSlug || post.slug.toLowerCase() === normalizedSlug);
}
