import Link from 'next/link';
import { fetchPosts, fetchPostBySlug } from '../core/fetcher';
import { excerpt, formatDate, wordCount, readingTime } from '../core/utils';
import styles from '../core/blog.module.css';

export const dynamic = 'force-static';
export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: excerpt(post.body || '', 160),
    openGraph: {
      title: post.title,
      description: excerpt(post.body || '', 160),
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    const { notFound } = await import('next/navigation');
    notFound();
    return null;
  }

  const words = wordCount(post.body);
  const readTime = readingTime(post.body);

  return (
    <div className={styles.article}>
      <div className={styles.articleHeader}>
        <Link href="/blog" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All articles
        </Link>

        <h1 className={styles.articleTitle}>{post.title}</h1>

        <div className={styles.articleMeta}>
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          <span className={styles.metaDot}>&middot;</span>
          <span>{readTime} min read</span>
          <span className={styles.metaDot}>&middot;</span>
          <span>{words.toLocaleString()} words</span>
        </div>
      </div>

      <div className={styles.articleBody}>
        <MarkdownBody body={post.body || ''} />
      </div>
    </div>
  );
}

function MarkdownBody({ body }: { body: string }) {
  try {
    const ReactMarkdown = require('react-markdown');
    const remarkGfm = require('remark-gfm');
    return (
      <div className={styles.prose}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    );
  } catch {
    return (
      <div
        className={styles.prose}
        dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, '<br/>') }}
      />
    );
  }
}
