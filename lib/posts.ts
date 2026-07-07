// The blog index is generated from this list.
// To add a post: create app/blog/<slug>/page.tsx (copy hello-world/page.tsx)
// and add an entry at the TOP of this array.

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO, used in <time datetime> and the sitemap
  dateDisplay: string; // short form shown in the index margin
};

export const posts: Post[] = [
  {
    slug: 'hello-world',
    title: 'Dhig Labs: write it down',
    date: '2026-07-07',
    dateDisplay: 'Jul 2026',
  },
];
