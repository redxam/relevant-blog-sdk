import type { BlogPost, BlogSDKConfig } from './types';
import { slugify } from './utils';

let _config: BlogSDKConfig | null = null;

/**
 * Call once at module level (e.g. in next.config.js or _app) to set credentials.
 * If not called, falls back to env vars:
 *   BLOG_SUPABASE_URL, BLOG_SUPABASE_KEY, BLOG_PROJECT_ID
 */
export function configureBlog(config: BlogSDKConfig): void {
  _config = config;
}

function getConfig(): BlogSDKConfig {
  if (_config) return _config;
  return {
    supabaseUrl: process.env.BLOG_SUPABASE_URL || process.env.SUPABASE_URL || '',
    supabaseKey: process.env.BLOG_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    projectId: process.env.BLOG_PROJECT_ID || '',
    revalidate: 60,
  };
}

type RawPost = Omit<BlogPost, 'slug'>;

function addSlug(post: RawPost): BlogPost {
  return { ...post, slug: slugify(post.title) };
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const cfg = getConfig();
  if (!cfg.supabaseUrl || !cfg.supabaseKey || !cfg.projectId) return [];

  const params = new URLSearchParams({
    project_id: `eq.${cfg.projectId}`,
    status: 'eq.ready',
    select: 'id,title,body,content_type_category,created_at,updated_at',
    order: 'created_at.desc',
  });

  try {
    const res = await fetch(
      `${cfg.supabaseUrl}/rest/v1/executing_contentitem?${params}`,
      {
        headers: {
          apikey: cfg.supabaseKey,
          Authorization: `Bearer ${cfg.supabaseKey}`,
        },
        next: { revalidate: cfg.revalidate ?? 60 } as any,
      },
    );
    if (!res.ok) return [];
    const rows: RawPost[] = await res.json();
    return rows.map(addSlug);
  } catch {
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await fetchPosts();
  return posts.find((p) => p.slug === slug) || null;
}
