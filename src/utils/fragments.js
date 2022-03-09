import { graphql } from "gatsby";

/**
 * These so called fragments are the fields we query on each template.
 * A fragment make queries a bit more reuseable, so instead of typing and
 * remembering every possible field, you can just use
 *   ...GhostPostFields
 * for example to load all post fields into your GraphQL query.
 *
 * Further info 👉🏼 https://www.gatsbyjs.org/docs/graphql-reference/#fragments
 *
 */

// Used for single posts
export const ghostPostFields = graphql`
  fragment GhostPostFields on GhostPost {
    # Main fields
    id
    title
    slug
    featured
    feature_image
    feature_image_local {
      childImageSharp {
        gatsbyImageData(
          width: 800
          quality: 80
          placeholder: BLURRED
          formats: [AUTO, AVIF, WEBP]
          transformOptions: { fit: COVER, cropFocus: CENTER }
        )
      }
    }
    excerpt
    custom_excerpt
    visibility
    # Dates formatted
    created_at_pretty: created_at(formatString: "DD MMMM, YYYY")
    published_at_pretty: published_at(formatString: "MMMM DD, YYYY")
    updated_at_pretty: updated_at(formatString: "DD MMMM, YYYY")
    # Dates unformatted
    created_at
    published_at
    updated_at
    # SEO
    meta_title
    meta_description
    og_description
    og_image
    og_title
    twitter_description
    twitter_image
    twitter_title
    # Authors
    authors {
      name
      slug
      bio
      # email
      profile_image
      profile_image_local {
        childImageSharp {
          gatsbyImageData(
            width: 40
            quality: 80
            placeholder: BLURRED
            formats: [AUTO, AVIF, WEBP]
            transformOptions: { fit: COVER, cropFocus: CENTER }
          )
        }
      }
      twitter
      facebook
      website
    }
    primary_author {
      name
      slug
      bio
      # email
      profile_image
      twitter
      facebook
      website
    }
    # Tags
    primary_tag {
      name
      slug
      description
      feature_image
      meta_description
      meta_title
      visibility
    }
    tags {
      name
      slug
      description
      feature_image
      meta_description
      meta_title
      visibility
    }
    # Content
    plaintext
    html
    # Additional fields
    url
    canonical_url
    uuid
    page
    codeinjection_foot
    codeinjection_head
    codeinjection_styles
    comment_id
    reading_time
  }
`;
