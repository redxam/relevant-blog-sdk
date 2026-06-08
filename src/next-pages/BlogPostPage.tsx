import Head from 'next/head';
import Link from 'next/link';
import type { BlogPost } from '../core/types';
import { excerpt, formatDate, wordCount, readingTime } from '../core/utils';
import styles from '../core/blog.module.css';

interface Props {
  post: BlogPost;
  /** Site name shown in meta tags and byline. */
  siteName?: string;
  /** Optional CTA block rendered below the article. */
  cta?: React.ReactNode;
}

export function BlogPostPage({ post, siteName, cta }: Props) {
  const words = wordCount(post.body);
  const readTime = readingTime(post.body);
  const plainDesc = excerpt(post.body || '', 160);

  return (
    <>
      <Head>
        <title>{post.title}{siteName ? ` — ${siteName}` : ''}</title>
        <meta name="description" content={plainDesc} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={plainDesc} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.created_at} />
        <meta property="article:modified_time" content={post.updated_at} />
      </Head>

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
            {siteName && <span>{siteName}</span>}
            {siteName && <span className={styles.metaDot}>&middot;</span>}
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            <span className={styles.metaDot}>&middot;</span>
            <span>{readTime} min read</span>
            <span className={styles.metaDot}>&middot;</span>
            <span>{words.toLocaleString()} words</span>
          </div>
        </div>

        <div className={styles.articleBody}>
          <BlogMarkdown body={post.body || ''} />
        </div>

        {cta}
      </div>
    </>
  );
}

function BlogMarkdown({ body }: { body: string }) {
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
