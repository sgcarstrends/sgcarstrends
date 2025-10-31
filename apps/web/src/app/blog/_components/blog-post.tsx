"use client";

import type { SelectPost } from "@sgcarstrends/database";
import Typography from "@web/components/typography";
import { Badge } from "@web/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type Props = {
  post: SelectPost;
};

export const BlogPost = ({ post }: Props) => {
  const metadata = post.metadata as any;
  const publishedDate = post.publishedAt ?? post.createdAt;

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full">
        {/* Cover Image */}
        <div className="-mt-6 relative hidden aspect-video w-full md:block">
          <Image
            src={`/blog/${post.slug}/opengraph-image`}
            alt={`Cover image for ${post.title}`}
            fill
            sizes="100vw"
            unoptimized
          />
        </div>

        <CardHeader>
          <CardTitle className="text-xl">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-col gap-4">
            <Typography.Body className="text-muted-foreground">
              {metadata?.excerpt}
            </Typography.Body>
            <div className="flex gap-2">
              {metadata?.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-small">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between">
            <Typography.BodySmall className="text-muted-foreground">
              {new Date(publishedDate).toLocaleDateString("en-SG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography.BodySmall>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
