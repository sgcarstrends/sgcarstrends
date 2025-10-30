import { QuotaPremiumTicker } from "@web/components/quota-premium-ticker";
import { getLatestCOEResults } from "@web/lib/coe/queries";
import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

const Layout = async ({ children }: Props) => {
  const data = await getLatestCOEResults();

  return (
    <>
      <QuotaPremiumTicker data={data} />
      {children}
    </>
  );
};

export default Layout;
