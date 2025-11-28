"use client";

import { incrementPostView } from "@web/app/blog/_actions/views";
import { useEffect, useEffectEvent, useState } from "react";

interface ViewCounterProps {
  postId: string;
  initialCount?: number;
}

export const ViewCounter = ({ postId, initialCount = 0 }: ViewCounterProps) => {
  const [views, setViews] = useState(initialCount);

  const increasePostView = useEffectEvent(() => {
    incrementPostView(postId).then(setViews);
  });

  useEffect(() => {
    increasePostView();
  }, []);

  return (
    <span className="text-muted-foreground">
      {views.toLocaleString()} {views === 1 ? "view" : "views"}
    </span>
  );
};
