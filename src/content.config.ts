import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const hubs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/hubs' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    topics: z.array(z.string()).optional(),
    lastUpdated: z.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    parentHub: z.string().optional(),
    category: z.string().optional(),
    pubDate: z.date().optional(),
    lastUpdated: z.date().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, hubs, articles };
