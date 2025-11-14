import { QuotaPremiumTicker } from "@web/components/quota-premium-ticker";
import { getLatestCoeResults } from "@web/queries/coe";
import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

const Layout = async ({ children }: Props) => {
  const data = await getLatestCoeResults();

  return (
    <>
      <QuotaPremiumTicker data={data} />
      {children}
    </>
  );
};

export default Layout;
