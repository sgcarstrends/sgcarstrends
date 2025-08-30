"use client";

import useStore from "@web/app/store";

export const Banner = () => {
  const { bannerContent } = useStore();

  if (!bannerContent) {
    return null;
  }

  return (
    <div className="flex items-center justify-center border-b bg-gray-50">
      <div className="container mx-auto px-6 py-4">{bannerContent}</div>
    </div>
  );
};
