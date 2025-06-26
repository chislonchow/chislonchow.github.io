
"use client";

import { useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { toast as sonnerToast } from 'sonner';
import type { NotificationConfig } from '@/lib/notification-data';
import parse, { domToReact, type HTMLReactParserOptions, type DOMNode, Element as HtmlParserElement } from 'html-react-parser';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { parserOptions } from '@/lib/markdown-parser-options';

interface NotificationToastProps {
  notificationConfig: NotificationConfig | null;
}

const localParserOptions: HTMLReactParserOptions = {
  replace: (domNode: DOMNode, index: number) => {
    if (domNode instanceof HtmlParserElement && domNode.attribs) {
      const baseResult = parserOptions.replace?.(domNode, index);
      if(baseResult) return baseResult;

      const children = domNode.children ? domToReact(domNode.children as DOMNode[], localParserOptions) : null;

      if (domNode.name === "p") {
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

    if (notificationConfig && localizedContent && localizedContent.descriptionHtml) {
      const { durationSeconds } = notificationConfig;

      if (durationSeconds > 0) {
        const descriptionNode = localizedContent.descriptionHtml.trim()
          ? parse(localizedContent.descriptionHtml, localParserOptions)
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
