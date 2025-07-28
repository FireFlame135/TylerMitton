// src/lib/posts.ts
import matter from 'front-matter';

// Define the structure of a Post object with TypeScript
export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
}

// Fetches and parses all posts
export const getPosts = async (): Promise<Post[]> => {
  const files = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default' });
  console.log('Files found by glob:', Object.keys(files));

  const posts = await Promise.all(
    Object.entries(files).map(async ([path, resolver]) => {
      const rawContent = await resolver();
      const parsed = matter(rawContent as string);
      const data = parsed.attributes as Record<string, any>;
      const content = parsed.body;

      const slug = path.split('/').pop()?.replace('.md', '') ?? '';

      return {
        slug,
        title: data.title,
        date: new Date(data.date).toISOString(),
        category: data.category,
        readTime: data.readTime,
        excerpt: data.excerpt,
        content,
      };
    })
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// For getPostBySlug:
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const rawContent = await import(`../posts/${slug}.md?raw`);
    const parsed = matter(rawContent.default);
    const data = parsed.attributes as Record<string, any>;
    const content = parsed.body;

    return {
      slug,
      title: data.title,
      date: new Date(data.date).toISOString(),
      category: data.category,
      readTime: data.readTime,
      excerpt: data.excerpt,
      content,
    };
  } catch (error) {
    console.error(`Error fetching post by slug: ${slug}`, error);
    return null;
  }
};