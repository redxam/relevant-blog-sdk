import Head from 'next/head';
import Link from 'next/link';
import type { BlogPost } from '../core/types';
import { excerpt, formatDate } from '../core/utils';
import styles from '../core/blog.module.css';

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
  title?: string;
  subtitle?: string;
}

export function BlogIndexPage({ posts, title, subtitle }: Props) {
  return (
    <>
      <Head>
        <title>{title || 'Blog'}</title>
        <meta
          name="description"
          content={subtitle || 'Latest articles, guides, and insights.'}
        />
      </Head>

      <div className={styles.blogPage}>
        <div className={styles.blogHero}>
          <h1 className={styles.blogTitle}>{title || 'Blog'}</h1>
          {subtitle && <p className={styles.blogSubtitle}>{subtitle}</p>}
        </div>

        {posts.length === 0 ? (
          <p className={styles.emptyState}>No articles published yet. Check back soon!</p>
        ) : (
          <div className={styles.postGrid}>
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className={styles.postCard}>
                {post.content_type_category && (
                  <span className={styles.postCategory}>
                    {CATEGORY_LABELS[post.content_type_category] || post.content_type_category}
                  </span>
                )}
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postExcerpt}>{excerpt(post.body || '', 180)}</p>
                <p className={styles.postDate}>{formatDate(post.created_at)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
