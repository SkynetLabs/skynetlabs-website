const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

const BlogPostTemplate = path.resolve(`./src/templates/blog-post.js`);
const PressReleaseTemplate = path.resolve(`./src/templates/press-release.js`);

/* Tags and their names are defined in Ghost CMS */
const isBlogPost = (node) => node.primary_tag?.name === "Blog";
const isPressRelease = (node) => node.primary_tag?.name === "Press Release";

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Get all markdown news posts sorted by date and all possible authors
  const result = await graphql(
    `
      {
        allGhostPost(sort: { order: ASC, fields: published_at }) {
          edges {
            node {
              slug
              primary_tag {
                name
              }
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    reporter.panicOnBuild(`There was an error loading your news posts`, result.errors);
    return;
  }

  const posts = result.data.allGhostPost.edges;

  // Create post pages
  posts.forEach(({ node }) => {
    // This part here defines, that our posts will use
    // a `/news/:slug/` permalink.
    const url = `/news/${node.slug}/`;
    const component = isBlogPost(node) ? BlogPostTemplate : isPressRelease(node) ? PressReleaseTemplate : null;

    if (component === null) {
      // NOTE: should we throw here?
      reporter.error(`Don't know which template to use for "${node.slug}" - did you add a primary tag to the article?`);
      return;
    }

    createPage({
      path: url,
      component,
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.slug,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // news posts are stored inside "/data/news" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: String
      siteUrl: String
      social: Social
    }
    type Author {
      name: String
      summary: String
    }
    type Social {
      twitter: String
    }
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }
    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      author: String
      external: String
      hidden: Boolean
      categories: [String]
      avatar: File! @fileByRelativePath
    }
    type Fields {
      slug: String
    }
  `);
};
