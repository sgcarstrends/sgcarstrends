declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_SITE_URL: string;
    /**
     * Optional: API base URL override
     * When not set, automatically resolved via Vercel Related Projects
     * in Vercel deployments, or defaults to https://api.sgcarstrends.com
     */
    NEXT_PUBLIC_API_URL?: string;
  }
}
