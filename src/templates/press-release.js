import * as React from "react";
import { graphql } from "gatsby";
import { TwitterShareButton, LinkedinShareButton, FacebookShareButton } from "react-share";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import Seo from "../components/seo";
import Link from "../components/Link";
import { NewsSummary } from "../components/News";
import { Section, SectionTitle, Label } from "../components/Layout";
import { TwitterSmall, LinkedinSmall, FacebookSmall, ArrowUpCircle } from "../components/Icons";
import useSiteMetadata from "../services/useSiteMetadata";

import "../styles/news-post.css";
import ArticleMeta from "../components/ArticleMeta";

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

const PressReleaseTemplate = ({ data, location }) => {
  const post = data.ghostPost;
  const author = post.authors[0];
  const tags = post.tags.map((tag) => tag.slug).join(" ");
  const contentRef = React.useRef();

  useResponsiveEmbeds(contentRef);

  return (
    <>
      <ArticleMeta post={post} />
      <Helmet>
        <style type="text/css">{`${post.codeinjection_styles}`}</style>
      </Helmet>
      <Section className="bg-white desktop:bg-column" first={true}>
        <Link
          to="/news"
          className="relative flex items-center space-x-2 transition-colors duration-200 -top-6 desktop:-top-10 hover:text-primary"
        >
          <ArrowUpCircle className="transform -rotate-90 fill-current" />
          <span className="relative text-lg font-semibold" style={{ top: 1 }}>
            Go back
          </span>
        </Link>

        <article className={`press-release ${tags}`} itemScope itemType="http://schema.org/Article">
          {post.tags && (
            <div className="mb-4">
              {post.tags.map((tag) => (
                <Label key={tag.slug}>{tag.name}</Label>
              ))}
            </div>
          )}

          <SectionTitle itemProp="headline" className="mb-16">
            {post.title}
          </SectionTitle>

          <div className="grid grid-cols-1 desktop:grid-cols-3 gap-y-8 desktop:gap-x-8">
            <aside className="space-y-5">
              <NewsSummary avatar={author.profile_image_local} author={author.name} date={post.published_at_pretty} />

              <hr className="text-palette-200" />

              <div className="flex items-center">
                <div className="mr-4 text-xs uppercase">Share</div>

                <TwitterShareButton url={location.href} title={post.title} hashtags={[]}>
                  <TwitterSmall className="transition-colors duration-200 fill-current hover:text-palette-400" />
                </TwitterShareButton>

                <LinkedinShareButton url={location.href} title={post.title} summary={post.description}>
                  <LinkedinSmall className="transition-colors duration-200 fill-current hover:text-palette-400" />
                </LinkedinShareButton>

                <FacebookShareButton url={location.href} quote={post.title}>
                  <FacebookSmall className="transition-colors duration-200 fill-current hover:text-palette-400" />
                </FacebookShareButton>
              </div>
            </aside>

            <div className="col-span-2 space-y-12">
              {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
              <section
                ref={contentRef}
                className="content-body"
                dangerouslySetInnerHTML={{ __html: post.html }}
                itemProp="articleBody"
              />
            </div>
          </div>
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

PressReleaseTemplate.propTypes = {
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

export default PressReleaseTemplate;

export const postQuery = graphql`
  query ($slug: String!) {
    ghostPost(slug: { eq: $slug }) {
      ...GhostPostFields
    }
  }
`;
