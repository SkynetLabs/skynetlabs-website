const { defaultIcons } = require("gatsby-plugin-manifest/common");

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const {
  NODE_ENV,
  URL: NETLIFY_SITE_URL = `https://skynetlabs.com`,
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV,
} = process.env;
const isNetlifyProduction = NETLIFY_ENV === "production";
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;

module.exports = {
  siteMetadata: {
    title: `Skynet Labs`,
    description: `Skynet Labs is a company behind Skynet - decentralized file sharing and content distribution protocol`,
    author: `Skynet Labs`,
    siteUrl,
    image: `https://skynetlabs.com/icons/icon-512x512.png`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data/`,
      },
    },
    {
      resolve: `gatsby-source-ghost`,
      options: {
        apiUrl: `https://cms.skynetlabs.com`,
        contentApiKey: process.env.GHOST_API_KEY,
        version: `v3`, // Ghost API version, optional, defaults to "v3".
      },
    },
    {
      resolve: `gatsby-plugin-remote-images`,
      options: {
        nodeType: "GhostAuthor",
        imagePath: "profile_image",
        name: "profile_image_local",
      },
    },
    {
      resolve: `gatsby-plugin-remote-images`,
      options: {
        nodeType: "GhostPost",
        imagePath: "feature_image",
        name: "feature_image_local",
      },
    },
    `gatsby-plugin-netlify`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-svgr`,
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        resolveEnv: () => NETLIFY_ENV,
        env: {
          production: {
            policy: [{ userAgent: "*" }],
            sitemap: `${siteUrl}/sitemap-index.xml`,
            host: siteUrl,
          },
          "deploy-preview": {
            policy: [{ userAgent: "*" }], // TODO: disallow on previews.
            sitemap: `${siteUrl}/sitemap-index.xml`,
            host: siteUrl,
          },
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-classes`,
            options: {
              classMap: {
                heading: "font-semibold text-palette-600",
                paragraph: "font-content text-base text-palette-400",
                strong: "font-semibold",
                link: "text-primary hover:underline transition-colors duration-200",
                "heading[depth=1]": "text-4xl",
                "heading[depth=2]": "text-3xl",
                "paragraph + paragraph": "mt-8",
                "paragraph + heading": "mt-20",
                "heading + paragraph": "mt-12",
              },
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Skynet`,
        short_name: `Skynet`,
        start_url: `/`,
        background_color: `#f1f7f2`,
        theme_color: `#f1f7f2`,
        display: `minimal-ui`,
        icon: `src/images/logo-sq.svg`, // This path is relative to the root of the site.
        icons: [
          ...defaultIcons,
          // when we're serving content from the portal on our pathnames that do not have
          // favicon defined (basically all non-html content), we want the browsers to be
          // able to fall back to favicon.ico (firefox does that)
          {
            src: `favicon.ico`,
            sizes: `32x32`,
            type: `image/x-icon`,
          },
        ],
        description: `Skynet portal homepage and upload widget`,
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        output: "/",
        createLinkInHead: true,
        excludes: ["/using-typescript/", "/news-archived/"],
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
            allGhostPost {
              nodes {
                  slug,
                  published_at
              }
            }
          }
        `,
        resolvePages: ({ allSitePage: { nodes: allPages }, allGhostPost: { nodes: allNews } }) => {
          const pathToDateMap = {};

          allNews.map((post) => {
            pathToDateMap[`/news/${post.slug}/`] = { date: post.published_at };
          });

          // modify pages to filter out hidden news items and add date
          const pages = allPages.map((page) => {
            return { ...page, ...pathToDateMap[page.path] };
          });

          return pages;
        },
        serialize: ({ path, date }) => {
          let entry = {
            url: path,
            changefreq: "daily",
            priority: 0.5,
          };

          if (date) {
            entry.priority = 0.7;
            entry.lastmod = date;
          }

          return entry;
        },
      },
    },
  ],
  // mapping: {
  //   "MarkdownRemark.frontmatter.author": `teamYaml`,
  // },
};
