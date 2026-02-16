import { withRelatedProject } from "@vercel/related-projects";

const baseUrl = withRelatedProject({
  projectName: "web",
  defaultHost: "https://sgcarstrends.com",
});
const apiToken = process.env.SG_CARS_TRENDS_API_TOKEN;

export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data: T;
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  if (!apiToken) {
    throw new Error("SG_CARS_TRENDS_API_TOKEN environment variable is not set");
  }

  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data: data as T,
  };
}
