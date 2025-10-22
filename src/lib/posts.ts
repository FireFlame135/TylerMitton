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
  link?: string; // Add optional link property
}

// Define the frontmatter structure
interface PostFrontMatter {
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  link?: string;
}

// Fetches and parses all posts
export const getPosts = async (): Promise<Post[]> => {
  // Correct the glob path to be relative to the current file
  const files = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' });

  const posts = await Promise.all(
    Object.entries(files).map(async ([path, resolver]) => {
      const rawContent = await resolver() as string;
      const parsed = matter(rawContent);
      const data = parsed.attributes as PostFrontMatter;
      const content = parsed.body;

      const slug = path.split('/').pop()?.replace('.md', '') ?? '';

      return {
        slug,
        title: data.title,
        date: new Date(data.date).toISOString(),
        category: data.category,
        readTime: data.readTime,
        excerpt: data.excerpt,
        link: data.link, // Extract link from frontmatter
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
    const data = parsed.attributes as PostFrontMatter;
    const content = parsed.body;

    return {
      slug,
      title: data.title,
      date: new Date(data.date).toISOString(),
      category: data.category,
      readTime: data.readTime,
      excerpt: data.excerpt,
      link: data.link, // Extract link from frontmatter
      content,
    };
  } catch (error) {
    console.error(`Error fetching post by slug: ${slug}`, error);
    return null;
  }
};