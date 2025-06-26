
import deepmerge from "deepmerge";
import { defaultSchema } from "rehype-sanitize";

/**
 * @fileoverview markdown-config.ts centralizes the configuration for processing
 * and rendering Markdown content across the application. It exports a custom
 * sanitization schema for security.
 * This ensures that Markdown is handled consistently.
 */

// Create a custom sanitization schema to allow specific tags and attributes,
// extending the default schema for security.
export const customSchema = deepmerge(defaultSchema, {
  tagNames: [...(defaultSchema.tagNames ?? []), "sub", "sup", "iframe", "div"],
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    div: ["className", ...(defaultSchema.attributes?.div || [])],
    iframe: [
      "src",
      "frameborder",
      "allow",
      "allowfullscreen",
      "title",
      "referrerpolicy",
      "className",
    ],
  },
});
