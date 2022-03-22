import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Section, Label } from "../components/Layout";
import { NewsSummary } from "../components/News";
import Link from "../components/Link";
import Seo from "../components/seo";

const NewsCard = (props) => {
  const {
    title,
    published_at,
    authors,
    canonical_url,
    slug,
    feature_image_local,
    tags,
    custom_excerpt,
    meta_description,
    excerpt,
  } = props;

  const { name, profile_image_local } = authors[0];
  const link = canonical_url ? { href: canonical_url } : { to: slug };

  const description = custom_excerpt || meta_description || excerpt;

  // TODO: limit description to x many characters.

  return (
    <div className="flex flex-col">
      <Link {...link} className="flex items-center">
        <GatsbyImage image={getImage(feature_image_local)} alt={title} />
      </Link>

      {tags && (
        <div className="mt-6">
          {tags.map((tag) => (
            <Label key={tag.slug}>{tag.name}</Label>
          ))}
        </div>
      )}

      <Link {...link} className="mt-6 text-xl">
        {title}
      </Link>

      {description && (
        <Link {...link} className="mt-4 font-content text-palette-400">
          {description}
        </Link>
      )}

      <div className="mt-6">
        <NewsSummary avatar={profile_image_local} author={name} date={published_at} />
      </div>
    </div>
  );
};

const NewsPage = ({ data }) => {
  return (
    <>
      <Seo title="News" />

      <Section className="bg-white" first={true}>
        {/* this is the gray box in the top left corner, 400px height is totally arbitrary but it works */}
        <div className="absolute top-0 left-0 right-0 hidden bg-white desktop:block" style={{ height: "320px" }} />

        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-x-8 gap-y-24">
          {data.allGhostPost.edges.map(({ node }) => (
            <NewsCard key={node.slug} {...node} />
          ))}
        </div>
      </Section>
    </>
  );
};

export const query = graphql`
  query BlogQuery {
    allGhostPost {
      edges {
        node {
          authors {
            name
            profile_image
            profile_image_local {
              childImageSharp {
                gatsbyImageData(
                  width: 40
                  height: 40
                  placeholder: BLURRED
                  formats: [AUTO, AVIF, WEBP]
                  transformOptions: { fit: COVER, cropFocus: CENTER }
                )
              }
            }
          }
          featured
          excerpt
          canonical_url
          published_at(formatString: "YYYY-MM-DD")
          slug
          tags {
            slug
            name
          }
          title
          custom_excerpt
          meta_description
          feature_image_local {
            childImageSharp {
              gatsbyImageData(
                width: 320
                height: 170
                placeholder: BLURRED
                formats: [AUTO, AVIF, WEBP]
                transformOptions: { fit: COVER, cropFocus: CENTER }
              )
            }
          }
        }
      }
    }
  }
`;

export default NewsPage;

// profile_image_local {
//   gatsbyImageData(
//     width: 40
//     placeholder: BLURRED
//     formats: [AUTO, AVIF, WEBP]
//     transformOptions: { fit: COVER, cropFocus: CENTER }
//   )
// }
