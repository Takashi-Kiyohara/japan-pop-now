import type { MDXComponents } from 'mdx/types';
import MDXImage from './MDXImage';
import GoogleMap from './GoogleMap';
import ResponsiveTable from './ResponsiveTable';
import AffiliateCTA from './AffiliateCTA';

/**
 * Custom MDX component map. Passed to `<MDXRemote components={...} />` so
 * `![alt](path)` markdown lands in our `MDXImage` (next/image wrapper)
 * instead of a bare `<img>` tag.
 *
 * Also registers:
 * - GoogleMap: lazy-loaded Google Maps embed
 * - ResponsiveTable: mobile-friendly stacked card layout for tables
 * - AffiliateCTA: 3-position affiliate card (inline/mid/end variants)
 */
export const mdxComponents: MDXComponents = {
  img: (props) => <MDXImage {...(props as Parameters<typeof MDXImage>[0])} />,
  GoogleMap: GoogleMap as unknown as React.ComponentType,
  ResponsiveTable: ResponsiveTable as unknown as React.ComponentType,
  AffiliateCTA: AffiliateCTA as unknown as React.ComponentType,
  // Wrap all markdown tables in ResponsiveTable automatically
  table: (props) => <ResponsiveTable>{<table {...props} />}</ResponsiveTable>,
};
