import { useState, useEffect } from 'react';
import type { BlogPost } from '../core/types';
import { slugify } from '../core/utils';

interface UseBlogConfig {
  /** Public URL that proxies to Supabase. e.g. /api/blog or https://yoursite.com/api/blog */
  apiUrl: string;
}

export function useBlogPosts({ apiUrl }: UseBlogConfig) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`${apiUrl}?type=list`)
      .then((r) => {
        if (!r.ok) throw new Error(`Blog API returned ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setPosts(data as BlogPost[]);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [apiUrl]);

  return { posts, loading, error };
}

export function useBlogPost({ apiUrl }: UseBlogConfig & { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const slug = (apiUrl as any).slug; // handled via URL param

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(apiUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`Blog API returned ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setPost(data as BlogPost | null);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [apiUrl]);

  return { post, loading, error };
}
