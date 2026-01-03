"use client";

import { Tab, Tabs } from "@heroui/tabs";
import type { SelectPost } from "@sgcarstrends/database";
import { Post } from "@web/app/blog/_components/post";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

interface PostCounts {
  total: number;
  category: Record<string, number>;
}

interface BlogListClientProps {
  posts: SelectPost[];
  counts: PostCounts;
}

interface PostsGridProps {
  posts: SelectPost[];
}

const tabLabels: Record<string, string> = {
  all: "All Posts",
  coe: "COE",
  cars: "Cars",
};

const PostsGrid = ({ posts }: PostsGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut",
          }}
        >
          <Post.Card post={post} />
        </motion.div>
      ))}
    </div>
  );
};

export function BlogListClient({ posts, counts }: BlogListClientProps) {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredPosts = useMemo(() => {
    if (selectedTab === "all") {
      return posts;
    }
    return posts.filter((post) => post.dataType === selectedTab);
  }, [posts, selectedTab]);

  const heroPost = filteredPosts[0];
  const secondPost = filteredPosts[1];
  const remainingPosts = filteredPosts.slice(2);

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No blog posts available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Tabs
        selectedKey={selectedTab}
        variant="underlined"
        onSelectionChange={(key) => setSelectedTab(key as string)}
        classNames={{
          tabList: "gap-6",
          tab: "px-0 h-10",
          tabContent: "group-data-[selected=true]:font-semibold",
        }}
      >
        <Tab key="all" title={`${tabLabels.all} (${counts.total})`} />
        {Object.keys(counts.category)
          .sort()
          .map((cat) => (
            <Tab
              key={cat}
              title={`${tabLabels[cat] || cat} (${counts.category[cat]})`}
            />
          ))}
      </Tabs>

      {heroPost && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Post.Hero post={heroPost} />
          </motion.div>

          {secondPost && (
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <Post.Card post={secondPost} />
            </motion.div>
          )}
        </div>
      )}

      {remainingPosts.length > 0 && <PostsGrid posts={remainingPosts} />}
    </div>
  );
}
