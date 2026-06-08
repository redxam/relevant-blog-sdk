import type { BlogPost } from '../core/types';
import { excerpt, formatDate } from '../core/utils';

const CATEGORY_LABELS: Record<string, string> = {
  'opinion-piece': 'Opinion',
  'how-to-guide': 'Guide',
  'listicle': 'Listicle',
  'case-study': 'Case Study',
  'thought-leadership': 'Thought Leadership',
  'tutorial': 'Tutorial',
};

interface Props {
  posts: BlogPost[];
  onPostClick?: (post: BlogPost) => void;
  linkPrefix?: string;
}

export function BlogList({ posts, onPostClick, linkPrefix = '/blog' }: Props) {
  if (posts.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#9ca3af', padding: '80px 0' }}>
        No articles published yet. Check back soon!
      </p>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '0 24px',
    }}>
      {posts.map((post) => (
        <a
          key={post.id}
          href={`${linkPrefix}/${post.slug}`}
          onClick={(e) => {
            if (onPostClick) {
              e.preventDefault();
              onPostClick(post);
            }
          }}
          style={{
            background: 'var(--card, #fff)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'transform 0.15s',
          }}
        >
          {post.content_type_category && (
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent, #2563eb)',
              marginBottom: '14px',
            }}>
              {CATEGORY_LABELS[post.content_type_category] || post.content_type_category}
            </span>
          )}
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 10px' }}>
            {post.title}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.7, flex: 1, margin: '0 0 16px' }}>
            {excerpt(post.body || '', 180)}
          </p>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>
            {formatDate(post.created_at)}
          </p>
        </a>
      ))}
    </div>
  );
}
