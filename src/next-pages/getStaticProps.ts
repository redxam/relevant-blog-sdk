import type { GetStaticProps } from 'next';
import type { BlogPost } from '../core/types';
import { fetchPosts } from '../core/fetcher';

export const getStaticProps: GetStaticProps<{ posts: BlogPost[] }> = async () => {
  const posts = await fetchPosts();
  return { props: { posts }, revalidate: 60 };
};
