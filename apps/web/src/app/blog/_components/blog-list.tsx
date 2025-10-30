"use client";

import { Tab, Tabs } from "@heroui/tabs";
import type { SelectPost } from "@sgcarstrends/database";
import { BlogPost } from "@web/app/blog/_components/blog-post";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

interface Props {
  posts: SelectPost[];
}

export const BlogList = ({ posts }: Props) => {
  const [selectedTab, setSelectedTab] = useState("all");

  // Extract unique tags from posts metadata
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();

    posts.forEach((post) => {
      const metadata = post.metadata as any;
      if (metadata?.dataType) {
        tagSet.add(metadata.dataType);
      }
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts based on selected tab
  const filteredPosts = useMemo(() => {
    if (selectedTab === "all") {
      return posts;
    }

    return posts.filter((post) => {
      const metadata = post.metadata as any;
      return metadata?.dataType?.includes(selectedTab);
    });
  }, [posts, selectedTab]);

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No blog posts available.</p>
      </div>
    );
  }

  return (
    <Tabs
      selectedKey={selectedTab}
      variant="underlined"
      onSelectionChange={(key) => setSelectedTab(key as string)}
    >
      <Tab key="all" title="all">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <BlogPost post={post} />
            </motion.div>
          ))}
        </div>
      </Tab>
      {availableTags.map((tag) => (
        <Tab key={tag} title={tag}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <BlogPost post={post} />
              </motion.div>
            ))}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
};
