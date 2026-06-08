import type { BlogPost } from '../core/types';
import { excerpt, formatDate, wordCount, readingTime } from '../core/utils';

interface Props {
  post: BlogPost;
  onBack?: () => void;
  backHref?: string;
}

export function BlogArticle({ post, onBack, backHref = '/blog' }: Props) {
  const words = wordCount(post.body);
  const readTime = readingTime(post.body);

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '0 24px 80px' }}>
      <div style={{ padding: '48px 0 40px', borderBottom: '1px solid var(--border, #e5e7eb)', marginBottom: '40px' }}>
        <a
          href={backHref}
          onClick={(e) => {
            if (onBack) { e.preventDefault(); onBack(); }
          }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#6b7280', fontSize: '14px', fontWeight: 500, marginBottom: '24px',
            textDecoration: 'none',
          }}
        >
          &larr; All articles
        </a>

        <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 16px' }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          <span>&middot;</span>
          <span>{readTime} min read</span>
          <span>&middot;</span>
          <span>{words.toLocaleString()} words</span>
        </div>
      </div>

      <div
        style={{ color: '#374151', fontSize: '17px', lineHeight: 1.85 }}
        dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(post.body || '') }}
      />
    </div>
  );
}

function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
