// src/lib/posts.ts
/**
 * Post management and fetching utilities.
 * Author: Tyler Mitton
 * Handles loading, parsing, and organizing markdown blog posts.
 */

import matter from 'front-matter';

// Define the structure of a Post object
export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  link?: string;
}

// Define the frontmatter structure in markdown files
interface PostFrontMatter {
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  link?: string;
}

// Fetch and parse all markdown posts
export const getPosts = async (): Promise<Post[]> => {
  // Use Vite's glob to dynamically import all markdown files
  const files = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' });

  const posts = await Promise.all(
    Object.entries(files).map(async ([path, resolver]) => {
      // Load raw markdown content
      const rawContent = await resolver() as string;
      // Parse frontmatter and body
      const parsed = matter(rawContent);
      const data = parsed.attributes as PostFrontMatter;
      const content = parsed.body;

      // Extract slug from filename
      const slug = path.split('/').pop()?.replace('.md', '') ?? '';

      return {
        slug,
        title: data.title,
        date: new Date(data.date).toISOString(),
        category: data.category,
        readTime: data.readTime,
        excerpt: data.excerpt,
        link: data.link,
        content,
      };
    })
  );

  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Fetch a single post by slug
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    // Check if post exists in all posts
    const allPosts = await getPosts();
    const existingPost = allPosts.find(post => post.slug === slug);
    
    if (!existingPost) {
      return null;
    }

    // Load and parse the specific post
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
      link: data.link,
      content,
    };
  } catch (error) {
    console.error(`Error fetching post by slug: ${slug}`, error);
    return null;
  }
};