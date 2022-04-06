import * as React from "react";
import { Helmet } from "react-helmet";
import useSiteMetadata from "../services/useSiteMetadata";

export default function ArticleMeta({ post }) {
  const { siteUrl, image: orgImage } = useSiteMetadata();

  const ogUrl = `${siteUrl}/news/${post.slug}`;
  const canonicalUrl = post.canonical_url;

  const title = `${post.og_title || post.meta_title || post.title} | Skynet Labs`;
  const description = post.og_description || post.meta_description || post.custom_excerpt || post.excerpt;
  const primaryAuthor = post.primary_author || post.authors[0];
  const primaryAuthorName = primaryAuthor?.name || "Skynet Labs";
  const primaryAuthorUrl = `https://twitter.com/${primaryAuthor?.twitter || "SkynetLabs"}`;
  const publisherUrl = `https://twitter.com/SkynetLabs`;

  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      <meta name="title" content={title} />
      <meta name="article:headline" content={title} />
      <meta name="description" content={description} />
      <meta name="author" content={primaryAuthorName} />
      <meta property="article:modified_time" content={post.updated_at} />
      <meta property="article:published_time" content={post.published_at} />
      <meta property="article:image" content={post.feature_image} />
      <meta property="article:author" content={primaryAuthorUrl} />
      <meta property="article:publisher" content={publisherUrl} />

      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.og_title || post.meta_title || post.title} />
      <meta property="og:description" content={post.og_description || description} />
      <meta property="og:image" content={post.og_image || post.feature_image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SkynetLabs" />
      <meta name="twitter:creator" content={post.primary_author.twitter} />
      <meta name="twitter:title" content={post.twitter_title || post.meta_title || post.title} />
      <meta name="twitter:description" content={post.twitter_description || description} />
      <meta name="twitter:image" content={post.twitter_image || post.feature_image} />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://google.com/article",
              "url": "${ogUrl}"
            },
            "headline": "${post.title}",
            "image": ["${post.feature_image}"],
            "datePublished": "${post.published_at}",
            "dateModified": "${post.updated_at}",
            "author": {
              "@type": "Person",
              "name": "${primaryAuthorName}",
              "url": "${primaryAuthorUrl}"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Skynet Labs",
              "url": "${siteUrl}",
              "logo": {
                "@type": "ImageObject",
                "url": "${orgImage}"
              }
            }
          }
        `}
      </script>
    </Helmet>
  );
}
