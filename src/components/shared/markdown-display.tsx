
import React from "react";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import behead from "remark-behead";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import parse from "html-react-parser";
import { customSchema } from "@/lib/markdown-config";
import { parserOptions } from "@/lib/markdown-parser-options";

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

  return (
    <div className="markdown-content prose dark:prose-invert max-w-none">
      {parse(htmlContent, parserOptions)}
    </div>
  );
}
