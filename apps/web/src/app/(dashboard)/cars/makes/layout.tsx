import type { ReactNode } from "react";

export default function Layout({
  children,
  drawer,
}: {
  children: ReactNode;
  drawer: ReactNode;
}) {
  return (
    <>
      {children}
      {drawer}
    </>
  );
}
