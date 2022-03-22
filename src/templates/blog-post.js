import * as React from "react";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import Seo from "../components/seo";
import Link from "../components/Link";
import { Section, Label } from "../components/Layout";
import { ArrowUpCircle } from "../components/Icons";
import useSiteMetadata from "../services/useSiteMetadata";

import "../styles/news-post.css";

const useResponsiveEmbeds = (ref) => {
  React.useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const embeds = ref.current.querySelectorAll("figure iframe");

    embeds.forEach((embed) => {
      const { width, height } = embed;
      const ratio = Number(height) / Number(width);

      embed.setAttribute("width", "100%");
      embed.setAttribute("height", embed.offsetWidth * ratio);
    });
  });
};

const BlogPostMetadata = ({ post }) => (
  <div className="flex flex-row gap-4 items-center">
    <ul className="list-none flex flex-wrap pl-0">
      {post.authors.map(
        (author) =>
          author.profile_image_local && (
            <li key={author.slug} className="relative -mx-1.5">
              <GatsbyImage
                image={getImage(author.profile_image_local)}
                alt={author.name}
                className="rounded-full border-2 border-white"
              />
            </li>
          )
      )}
    </ul>
    <div>
      <div className="text-palette-500 text-md">
        {post.authors.map((author) => (
          <span key={author.slug} className="after:content-[',_'] after:last:content-none">
            {author.name}
          </span>
        ))}
      </div>
      <div className="text-palette-300 text-sm font-light">
        <span>{post.published_at_pretty}</span>
        <span className="px-3 text-xs">•</span>
        <span>{post.reading_time} min read</span>
      </div>
    </div>
  </div>
);

const PostTemplate = ({ data }) => {
  const { siteUrl } = useSiteMetadata();
  const post = data.ghostPost;
  const description = post.meta_description || post.custom_excerpt || post.excerpt;
  const tags = post.tags.map((tag) => tag.slug).join(" ");
  const contentRef = React.useRef();
  const ogUrl = post.canonical_url || `${siteUrl}/news/${post.slug}`;

  useResponsiveEmbeds(contentRef);

  return (
    <>
      <Seo title={post.meta_title || post.title} description={description} />
      <Helmet>
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.og_title || post.meta_title || post.title} />
        <meta property="og:description" content={post.og_description || description} />
        <meta property="og:image" content={post.og_image || post.feature_image} />
        <meta property="article:author" content={post.primary_author.name}></meta>

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SkynetLabs" />
        <meta name="twitter:creator" content={post.primary_author.twitter} />
        <meta name="twitter:title" content={post.twitter_title || post.meta_title || post.title} />
        <meta name="twitter:description" content={post.twitter_description || description} />
        <meta name="twitter:image" content={post.twitter_image || post.feature_image} />
        {/* <meta name="twitter:image:alt" content="" /> */}
        <style type="text/css">{`${post.codeinjection_styles}`}</style>
      </Helmet>
      <Section className="bg-white" width="prose" first>
        <Link
          to="/news"
          className="relative flex items-center space-x-2 transition-colors duration-200 -top-6 desktop:-top-10 hover:text-primary"
        >
          <ArrowUpCircle className="transform -rotate-90 fill-current" />
          <span className="relative text-lg font-semibold" style={{ top: 1 }}>
            Go back
          </span>
        </Link>

        {post.tags && (
          <div className="mb-4">
            {post.tags.map((tag) => (
              <Label key={tag.slug}>{tag.name}</Label>
            ))}
          </div>
        )}
        <article className={`blog-post ${tags}`} itemScope itemType="http://schema.org/Article">
          <h1>{post.title}</h1>
          {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
          <BlogPostMetadata post={post} />
          {post.feature_image_local && (
            <div className="my-4">
              <GatsbyImage image={getImage(post.feature_image_local)} alt="" className="w-full" />
            </div>
          )}

          <section
            ref={contentRef}
            className="content-body"
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
          />
        </article>

        <Link
          to="/news"
          className="relative flex items-center mt-12 space-x-2 transition-colors duration-200 hover:text-primary desktop:mt-0 desktop:-bottom-12"
        >
          <ArrowUpCircle className="transform -rotate-90 fill-current" />
          <span className="relative text-lg font-semibold" style={{ top: 1 }}>
            Go back
          </span>
        </Link>
      </Section>
    </>
  );
};

PostTemplate.propTypes = {
  data: PropTypes.shape({
    ghostPost: PropTypes.shape({
      codeinjection_styles: PropTypes.object,
      title: PropTypes.string.isRequired,
      html: PropTypes.string.isRequired,
      feature_image: PropTypes.string,
    }).isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
};

export default PostTemplate;

export const postQuery = graphql`
  query ($slug: String!) {
    ghostPost(slug: { eq: $slug }) {
      ...GhostPostFields
    }
  }
`;
