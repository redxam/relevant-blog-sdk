export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function excerpt(markdown: string, maxLen = 200): string {
  const plain = markdown
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`~>-]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  return plain.length > maxLen ? plain.slice(0, maxLen) + '...' : plain;
}

export function wordCount(md: string): number {
  if (!md) return 0;
  return md
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_`~>\[\]()#\-]/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingTime(md: string): number {
  return Math.max(1, Math.round(wordCount(md) / 250));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
