import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Link from "../Link";
import { ArrowRight, DiscordSmall } from "../Icons";

const NewsHeader = () => {
  const { allGhostPost } = useStaticQuery(graphql`
    query LatestFeaturedNewsQuery {
      allGhostPost(limit: 1, sort: { fields: published_at, order: DESC }, filter: { featured: { eq: true } }) {
        edges {
          node {
            title
            slug
          }
        }
      }
    }
  `);

  const [latestNews] = allGhostPost.edges;

  if (!latestNews) return null; // no featured news

  const { title, slug } = latestNews.node;
  const link = { to: `/news/${slug}` };

  return (
    <div className="p-3 px-8 bg-palette-500">
      <div className="mx-auto max-w-layout">
        <div className="flex justify-between">
          <Link
            {...link}
            className="flex items-center overflow-hidden text-base leading-8 transition-colors duration-200 text-palette-300 font-content hover:text-primary"
          >
            <ArrowRight className="flex-shrink-0 mr-2 fill-current text-primary" />
            <span className="truncate">{title}</span>
          </Link>

          <div className="items-center hidden pl-8 ml-auto desktop:block">
            <Link
              href="https://discord.gg/skynetlabs"
              className="flex items-center flex-shrink-0 space-x-2 leading-8 transition-colors duration-200 text-palette-300 font-content whitespace-nowrap hover:text-palette-200"
            >
              <DiscordSmall className="fill-current" />
              <span>Join our Discord</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

NewsHeader.propTypes = {};

NewsHeader.defaultProps = {};

export default NewsHeader;
