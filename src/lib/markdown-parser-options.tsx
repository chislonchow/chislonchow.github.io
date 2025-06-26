import {
  domToReact,
  type HTMLReactParserOptions,
  type DOMNode,
  Element as HtmlParserElement,
} from "html-react-parser";
import Link from "next/link";

/**
 * @fileoverview This file exports parser options to handle link rendering for markdown.
 * Internal links use Next.js's <Link> component, while external links use a standard <a> tag.
 */
export const parserOptions: HTMLReactParserOptions = {
  replace: (domNode: DOMNode, index: number) => {
    if (
      domNode instanceof HtmlParserElement &&
      domNode.name === "a" &&
      domNode.attribs
    ) {
      const { href, ...attribs } = domNode.attribs;
      // The recursive call to domToReact with parserOptions ensures that nested elements
      // within the link are also processed correctly.
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
