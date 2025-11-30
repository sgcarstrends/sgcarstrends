import { withRelatedProject } from "@vercel/related-projects";

export const WEB_URL = withRelatedProject({
  projectName: "web",
  defaultHost: "https://sgcarstrends.com",
});
