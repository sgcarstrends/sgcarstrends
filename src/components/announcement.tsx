import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

export const Announcement = ({ children }: Props) => (
  <div className="bg-primary p-4 text-center text-primary-foreground">
    {children}
  </div>
);
