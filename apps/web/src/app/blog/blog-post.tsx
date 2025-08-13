"use client";

import type { SelectPost } from "@sgcarstrends/database";
import { AIBadge } from "@web/components/ai-badge";
import { Badge } from "@web/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Props = {
  post: SelectPost;
};

export const BlogPost = ({ post }: Props) => {
  const metadata = post.metadata as any;
  const publishedDate = post.publishedAt ?? post.createdAt;

  return (
    <motion.div
      key={post.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card>
          {/* Cover Image */}
          <div className="-mt-6 relative hidden aspect-video w-full md:block">
            <Image
              src={`/blog/${post.slug}/opengraph-image`}
              alt={`Cover image for ${post.title}`}
              fill
              sizes="100vw"
            />
          </div>

          <CardHeader>
            <div className="flex items-center">
              {metadata?.modelVersion && <AIBadge />}
            </div>
            <CardTitle className="text-xl">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">{metadata?.excerpt}</p>
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
              <span className="text-muted-foreground text-sm">
                {new Date(publishedDate).toLocaleDateString("en-SG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};
