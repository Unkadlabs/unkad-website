import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Notes from Dhig Labs on Somali language data, AI safety evaluation, and building open research infrastructure from Mogadishu.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Dhig Labs',
    description: 'Notes from Dhig Labs on Somali language data and AI safety research.',
    type: 'website',
    url: '/blog',
  },
};

export default function BlogIndexPage() {
  return (
    <div className="container">
      <h1>Blog</h1>

      <ul className="dated-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <time dateTime={post.date}>{post.dateDisplay}</time>
            <p className="title">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
