import NextLink, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes } from 'react';

type AppLinkProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export default function AppLink({ prefetch = false, ...props }: AppLinkProps) {
  return <NextLink prefetch={prefetch} {...props} />;
}
