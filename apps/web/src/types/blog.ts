export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  author: string;
  tags: string[];
  readingTime: number;
  featured?: boolean;
  modelName?: string;
}

export interface BlogMetadata {
  title: string;
  excerpt: string;
  publishedDate: string;
  author: string;
  tags: string[];
  featured?: boolean;
}
