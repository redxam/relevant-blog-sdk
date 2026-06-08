import type { GetStaticPaths, GetStaticProps } from 'next';
import type { BlogPost } from '../core/types';
import { fetchPosts, fetchPostBySlug } from '../core/fetcher';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchPosts();
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<{ post: BlogPost }> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await fetchPostBySlug(slug);
  if (!post) return { notFound: true };
  return { props: { post }, revalidate: 60 };
};
