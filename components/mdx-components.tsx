import type { MDXComponents } from 'mdx/types';
import MDXImage from './MDXImage';

/**
 * Custom MDX component map. Passed to `<MDXRemote components={...} />` so
 * `![alt](path)` markdown lands in our `MDXImage` (next/image wrapper)
 * instead of a bare `<img>` tag.
 */
export const mdxComponents: MDXComponents = {
  img: (props) => <MDXImage {...(props as Parameters<typeof MDXImage>[0])} />,
};
