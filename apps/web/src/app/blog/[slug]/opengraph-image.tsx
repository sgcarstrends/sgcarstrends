import { getPostBySlug } from "@web/actions/blog";
import { ImageResponse } from "next/og";

type Props = {
  params: Promise<{ slug: string }>;
};

export const size = {
  width: 1200,
  height: 630,
};

const Image = async ({ params }: Props) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#ffffff",
      }}
    >
      {/* Visible background shapes */}
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 100,
          width: 200,
          height: 6,
          backgroundColor: "rgba(37, 99, 235, 0.3)",
          borderRadius: "3px",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 80,
          width: 150,
          height: 4,
          backgroundColor: "rgba(59, 130, 246, 0.25)",
          borderRadius: "2px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 50,
          width: 100,
          height: 100,
          backgroundColor: "rgba(147, 197, 253, 0.15)",
          borderRadius: "8px",
        }}
      />

      {/* Content */}
      <div
        style={{
          fontSize: 24,
          color: "#475569",
          marginBottom: 20,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        SG Cars Trends
      </div>
      <div
        style={{
          fontSize: 48,
          color: "#0f172a",
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: "80%",
          marginBottom: 30,
        }}
      >
        {post.title}
      </div>

      {/* Domain */}
      {/*<div*/}
      {/*  style={{*/}
      {/*    position: "absolute",*/}
      {/*    bottom: 40,*/}
      {/*    right: 40,*/}
      {/*    fontSize: 18,*/}
      {/*    color: "#475569",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  sgcarstrends.com*/}
      {/*</div>*/}

      {/* Blue line at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 8,
          backgroundColor: "#155dfc",
        }}
      />
    </div>,
    {
      ...size,
    },
  );
};

export default Image;
