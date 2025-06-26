import type { StaticPageData } from '@/lib/static-page-data';
import type { Language } from '@/contexts/language-context';
import type { FAQPage, Question, Answer, WithContext } from 'schema-dts';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import { customSchema as sanitizeSchema } from '@/lib/markdown-config';
import rehypeSanitize from 'rehype-sanitize';
import type { Root as MdastRoot, Content as MdastContent } from 'mdast';
import type { Root as HastRoot } from 'hast';

/**
 * @fileoverview Generates FAQPage schema markup from markdown content.
 */

interface QnaPair {
  question: string;
  answerNodes: MdastContent[];
}

// Function to convert a fragment of a remark AST to HTML
async function nodesToHtml(nodes: MdastContent[]): Promise<string> {
  if (!nodes || nodes.length === 0) {
    return '';
  }
  const tree: MdastRoot = { type: 'root', children: nodes };
  const processor = remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify);

  // processor.run transforms mdast to hast
  const hast = await processor.run(tree);
  // processor.stringify transforms hast to html
  const html = processor.stringify(hast as HastRoot);
  return html;
}

// Function to extract Q&A pairs from markdown
async function extractQnaPairs(markdown: string): Promise<QnaPair[]> {
  const pairs: QnaPair[] = [];
  if (!markdown) return pairs;

  const tree = remark().parse(markdown);

  let currentPair: QnaPair | null = null;

  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth === 3) { // This is a question heading (###)
      // If there was a previous question being built, push it.
      if (currentPair) {
        pairs.push(currentPair);
      }
      
      // Start a new question
      let questionText = '';
      visit(node, 'text', (textNode: any) => {
        questionText += textNode.value;
      });
      
      currentPair = {
        question: questionText.trim(),
        answerNodes: [],
      };
    } else if (currentPair) { // This is an answer node for the current question
      // Stop collecting if we hit a new section heading (## or #)
      if (node.type === 'heading' && node.depth <= 2) {
          // Finalize the current pair and push it
          pairs.push(currentPair);
          currentPair = null; // Stop collecting until a new question is found
      } else {
        currentPair.answerNodes.push(node as MdastContent);
      }
    }
  }

  // Push the last collected pair if it exists
  if (currentPair) {
    pairs.push(currentPair);
  }

  return pairs.filter(p => p.question && p.answerNodes.length > 0);
}

export async function generateFaqSchema(pageData: StaticPageData, lang: Language): Promise<WithContext<FAQPage> | null> {
  const markdownContent = pageData.markdown_content[lang];
  const qnaPairs = await extractQnaPairs(markdownContent);

  if (qnaPairs.length === 0) {
    return null;
  }

  const mainEntity: Question[] = await Promise.all(
    qnaPairs.map(async (pair) => {
      const answerHtml = await nodesToHtml(pair.answerNodes);
      const acceptedAnswer: Answer = {
        '@type': 'Answer',
        text: answerHtml,
      };
      const question: Question = {
        '@type': 'Question',
        name: pair.question,
        acceptedAnswer: acceptedAnswer,
      };
      return question;
    })
  );
  
  if (mainEntity.length === 0) {
    return null;
  }

  const schema: WithContext<FAQPage> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: mainEntity,
  };

  return schema;
}
