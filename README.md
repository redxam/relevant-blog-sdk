# relevant-blog-sdk

Drop-in blog pages for Next.js and React apps, powered by [Relevant](https://relevant.business)'s content engine.

Add a fully-styled `/blog` to any website with 2 files and 3 environment variables.

## Installation

```bash
npm install relevant-blog-sdk
```

## Environment Variables

Add to `.env.local`:

```env
BLOG_SUPABASE_URL=https://relevant-db.maxawad.com
BLOG_SUPABASE_KEY=<provided by Relevant>
BLOG_PROJECT_ID=<your project ID>
```

## Next.js App Router

**next.config.js:**

```js
module.exports = {
  transpilePackages: ['relevant-blog-sdk'],
};
```

**app/blog/page.tsx:**

```tsx
export { default, generateMetadata, revalidate } from 'relevant-blog-sdk/next-app';
```

**app/blog/[slug]/page.tsx:**

```tsx
export { default, generateMetadata, generateStaticParams, revalidate } from 'relevant-blog-sdk/next-app/post';
```

## Next.js Pages Router

**next.config.js:**

```js
module.exports = {
  transpilePackages: ['relevant-blog-sdk'],
};
```

**pages/blog/index.js:**

```js
export { default, getStaticProps } from 'relevant-blog-sdk/next-pages';
```

**pages/blog/[slug].js:**

```js
export { default, getStaticProps, getStaticPaths } from 'relevant-blog-sdk/next-pages/post';
```

## React + Vite

```tsx
import { useBlogPosts, BlogList } from 'relevant-blog-sdk/react';

function BlogPage() {
  const { posts, loading } = useBlogPosts();
  if (loading) return <p>Loading...</p>;
  return <BlogList posts={posts} />;
}
```

## Programmatic Config

Instead of env vars, configure directly:

```ts
import { configureBlog } from 'relevant-blog-sdk';

configureBlog({
  supabaseUrl: 'https://relevant-db.maxawad.com',
  supabaseKey: 'your-key',
  projectId: 'your-project-id',
});
```

## CSS Customization

Override these CSS variables:

```css
:root {
  --blog-primary: #0070f3;
  --blog-text: #333;
  --blog-bg: #fff;
  --blog-card-bg: #f9f9f9;
  --blog-max-width: 1200px;
}
```

## License

MIT
