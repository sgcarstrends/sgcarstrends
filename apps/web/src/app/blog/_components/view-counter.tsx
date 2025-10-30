import { incrementPostView } from "@web/app/blog/_actions/views";

interface ViewCounterProps {
  postId: string;
}

export const ViewCounter = async ({ postId }: ViewCounterProps) => {
  const views = await incrementPostView(postId);

  return (
    <span className="text-muted-foreground">
      {views.toLocaleString()} {views === 1 ? "view" : "views"}
    </span>
  );
};
