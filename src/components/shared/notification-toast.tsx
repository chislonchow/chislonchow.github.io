
"use client";

import { useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { toast as sonnerToast } from 'sonner';
import type { NotificationConfig } from '@/lib/notification-data';
import parse, { domToReact, type HTMLReactParserOptions, type DOMNode, Element as HtmlParserElement } from 'html-react-parser';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NotificationToastProps {
  notificationConfig: NotificationConfig | null;
}

const parserOptions: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    if (domNode instanceof HtmlParserElement && domNode.attribs) {
      const children = domNode.children ? domToReact(domNode.children as DOMNode[], parserOptions) : null;

      if (domNode.name === "a") {
        const { href, ...attribs } = domNode.attribs;
        if (href) {
          const isInternal = href.startsWith("/") && !href.startsWith("//");
          const isAnchorLink = href.startsWith("#");

          if (isAnchorLink) {
            const { target, rel, ...safeAttribs } = attribs;
            return <a href={href} {...safeAttribs}>{children}</a>;
          }
          if (isInternal) {
            const { target, rel, ...safeAttribs } = attribs;
            return <Link href={href} {...safeAttribs} legacyBehavior={false}>{children}</Link>;
          } else {
            return <a href={href} target="_blank" rel="noopener noreferrer" {...attribs}>{children}</a>;
          }
        }
      } else if (domNode.name === "p") {
        // Apply text size classes directly to the paragraph
        const existingClasses = domNode.attribs.class || '';
        const newClasses = cn(existingClasses, 'text-sm xs:text-base');
        return (
          <p {...domNode.attribs} className={newClasses}>
            {children}
          </p>
        );
      }
    }
    return undefined;
  },
};

export default function NotificationToast({ notificationConfig }: NotificationToastProps) {
  const { language, translations } = useLanguage();
  const pathname = usePathname();
  const activeToastIdRef = useRef<string | number | undefined>();

  const localizedContent = useMemo(() => {
    if (!notificationConfig) return null;
    return notificationConfig[language] || notificationConfig.en; // Fallback to English
  }, [notificationConfig, language]);

  useEffect(() => {
    let showTimeoutId: NodeJS.Timeout | undefined;
    let dismissTimeoutId: NodeJS.Timeout | undefined;

    const cleanup = () => {
      if (showTimeoutId) clearTimeout(showTimeoutId);
      if (dismissTimeoutId) clearTimeout(dismissTimeoutId);
      if (activeToastIdRef.current) {
        sonnerToast.dismiss(activeToastIdRef.current);
        activeToastIdRef.current = undefined;
      }
    };

    if (pathname !== '/' && pathname !== '/zh/') {
      cleanup();
      return;
    }

    if (notificationConfig && notificationConfig.isEnabled && localizedContent && localizedContent.descriptionHtml) {
      const { durationSeconds } = notificationConfig;

      if (durationSeconds > 0) {
        const descriptionNode = localizedContent.descriptionHtml.trim()
          ? parse(localizedContent.descriptionHtml, parserOptions)
          : null;

        if (descriptionNode) {
          showTimeoutId = setTimeout(() => {
            if (activeToastIdRef.current) {
              sonnerToast.dismiss(activeToastIdRef.current);
            }
            
            const sonnerGeneratedId = sonnerToast(descriptionNode, {
              duration: Infinity, 
            });
            activeToastIdRef.current = sonnerGeneratedId;

            dismissTimeoutId = setTimeout(() => {
              if (activeToastIdRef.current) {
                sonnerToast.dismiss(activeToastIdRef.current);
                activeToastIdRef.current = undefined;
              }
            }, durationSeconds * 1000);

          }, 500); 
        }
      } else {
        cleanup();
      }
    } else {
      cleanup();
    }

    return cleanup;
  }, [notificationConfig, localizedContent, language, pathname, translations]);

  return null;
}
