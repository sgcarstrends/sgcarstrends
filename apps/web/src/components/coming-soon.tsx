import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

export const ComingSoon = ({ children }: Props) => (
  <div className="pointer-events-none relative inline-block rounded-sm">
    {children}
    <span className="-translate-y-1/2 absolute top-0 left-0 translate-x-1/2 rotate-3 transform text-nowrap rounded-sm bg-blue-100 px-2 py-1 font-bold text-blue-600 text-xs">
      Coming Soon
    </span>
  </div>
);
