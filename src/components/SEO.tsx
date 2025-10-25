// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    author?: string;
    tags?: string[];
  };
  jsonLd?: object;
}

const SEO = ({
  title = 'Tyler Mitton',
  description = 'Personal Portfolio',
  image = 'https://tylermitton.com/assets/WebsiteOGImage.jpg',
  url = 'https://tylermitton.com',
  type = 'website',
  article,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title === 'Tyler Mitton' ? title : `${title} | Tyler Mitton`;
  
  // Ensure canonical URL is always absolute and properly formatted
  const canonicalUrl = url.startsWith('http') ? url : `https://tylermitton.com${url}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />

      {/* Article specific OG tags */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

