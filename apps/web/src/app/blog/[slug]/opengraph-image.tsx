import { OG_HEADERS, OG_SIZE } from "@web/lib/og/config";
import { getOGFonts } from "@web/lib/og/fonts";
import { Article } from "@web/lib/og/templates/article";
import { getAllPosts, getPostBySlug } from "@web/queries/posts";
import { ImageResponse } from "next/og";

interface Props {
  params: Promise<{ slug: string }>;
}

export const size = OG_SIZE;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

const Image = async ({ params }: Props) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const fonts = await getOGFonts();

  return new ImageResponse(<Article title={post.title} />, {
    ...size,
    fonts,
    headers: OG_HEADERS,
  });
};

export default Image;
