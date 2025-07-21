import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

export const ComingSoon = ({ children }: Props) => (
  <div className="pointer-events-none relative inline-block rounded-sm">
    {children}
    <span className="absolute left-0 top-0 -translate-y-1/2 translate-x-1/2 rotate-3 transform text-nowrap rounded-sm bg-blue-100 px-2 py-1 text-xs font-bold text-blue-600">
      Coming Soon
    </span>
  </div>
);
