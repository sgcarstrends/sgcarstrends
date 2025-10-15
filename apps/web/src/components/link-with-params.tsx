"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type ComponentType, type PropsWithChildren, Suspense } from "react";

interface Props extends PropsWithChildren {
  href: string;
}

const withSuspense = <P extends object>(Component: ComponentType<P>) => {
  return function WithSuspenseWrapper(props: P) {
    return (
      <Suspense fallback={null}>
        <Component {...props} />
      </Suspense>
    );
  };
};

export const LinkWithParams = withSuspense(({ href, ...props }: Props) => {
  const searchParams = useSearchParams();
  return (
    <Link
      href={{ pathname: href, query: searchParams.toString() }}
      {...props}
    />
  );
});
