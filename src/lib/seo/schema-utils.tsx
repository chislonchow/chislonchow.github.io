import type { Thing, WithContext } from 'schema-dts';

/**
 * @fileoverview schema-utils.tsx provides a helper component to render
 * JSON-LD structured data scripts in a Next.js application.
 */

/**
 * Renders a JSON-LD script tag for Schema.org structured data.
 * This component is intended to be used within a page or layout component.
 * Next.js will correctly place the script tag in the document's <head>.
 *
 * @param schema The structured data object, conforming to schema-d-ts types.
 *               It must include the '@context' property.
 */
export function JsonLd<T extends Thing>({ schema }: { schema: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
      key="jsonld-schema"
    />
  );
}
