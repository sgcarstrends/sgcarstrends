// import { PremiumBanner } from "@web/components/premium-banner";
// import { getLatestCoeResults } from "@web/queries/coe";
import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

const Layout = async ({ children }: Props) => {
  // const data = await getLatestCoeResults();

  return (
    <>
      {/*TODO: Temporary disable*/}
      {/*<PremiumBanner data={data} />*/}
      {children}
    </>
  );
};

export default Layout;
