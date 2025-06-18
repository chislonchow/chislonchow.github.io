
import React from "react";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import behead from "remark-behead";
import deepmerge from "deepmerge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import parse, {
  domToReact,
  type HTMLReactParserOptions,
  type DOMNode,
  Element as HtmlParserElement,
} from "html-react-parser";
import Link from "next/link";

// Create a custom sanitization schema.
const customSchema = deepmerge(defaultSchema, {
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

interface MarkdownDisplayProps {
  content: string;
  errorLoadingTitle: string;
  errorInvalidContentMessage: string;
  errorProcessingFailedMessage: string;
}

const markdownCache = new Map<string, string>();

async function getProcessedMarkdown(rawContent: string): Promise<string> {
  if (markdownCache.has(rawContent)) {
    return markdownCache.get(rawContent)!;
  }

  const processor = remark()
    .use(behead, { depth: 1 })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, customSchema)
    .use(rehypeStringify);

  const result = await processor.process(rawContent);
  const html = result.toString();
  markdownCache.set(rawContent, html);
  return html;
}

export default async function MarkdownDisplay({
  content,
  errorLoadingTitle,
  errorInvalidContentMessage,
  errorProcessingFailedMessage,
}: MarkdownDisplayProps) {
  let htmlContent = "";
  let errorOccurred = false;
  let displayedErrorMessage = "An unexpected error occurred.";
  let displayedErrorTitle = "Error";

  if (typeof content !== "string") {
    console.error('MarkdownDisplay: "content" prop must be a string.');
    errorOccurred = true;
    displayedErrorTitle = errorLoadingTitle;
    displayedErrorMessage = errorInvalidContentMessage;
  } else {
    try {
      htmlContent = await getProcessedMarkdown(content);
    } catch (processingError) {
      console.error("Failed to process markdown content:", processingError);
      errorOccurred = true;
      displayedErrorTitle = errorLoadingTitle;
      displayedErrorMessage = errorProcessingFailedMessage;
    }
  }

  if (errorOccurred) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>{displayedErrorTitle}</AlertTitle>
        <AlertDescription>{displayedErrorMessage}</AlertDescription>
      </Alert>
    );
  }

  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (
        domNode instanceof HtmlParserElement &&
        domNode.name === "a" &&
        domNode.attribs
      ) {
        const { href, ...attribs } = domNode.attribs;
        const children = domNode.children
          ? domToReact(domNode.children as DOMNode[], parserOptions)
          : null;

        if (href) {
          const isInternal = href.startsWith("/") && !href.startsWith("//");
          const isAnchorLink = href.startsWith("#");

          if (isAnchorLink) {
            const { target, rel, ...safeAttribs } = attribs;
            return (
              <a href={href} {...safeAttribs}>
                {children}
              </a>
            );
          }

          if (isInternal) {
            const { target, rel, ...safeAttribs } = attribs;
            return (
              <Link href={href} {...safeAttribs} legacyBehavior={false}>
                {children}
              </Link>
            );
          } else {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...attribs}
              >
                {children}
              </a>
            );
          }
        }
      }
      return undefined;
    },
  };

  return (
    <div className="markdown-content prose dark:prose-invert max-w-none">
      {parse(htmlContent, parserOptions)}
    </div>
  );
}
