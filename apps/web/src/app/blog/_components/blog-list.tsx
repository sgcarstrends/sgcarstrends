"use client";

import { Tab, Tabs } from "@heroui/tabs";
import type { SelectPost } from "@sgcarstrends/database";
import { BlogPost } from "@web/app/blog/_components/blog-post";
import { HeroPost } from "@web/app/blog/_components/hero-post";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

interface Props {
  posts: SelectPost[];
}

interface PostsGridProps {
  posts: SelectPost[];
}

// Tab label mapping for more descriptive names
const tabLabels: Record<string, string> = {
  all: "All Posts",
  coe: "COE Trends",
  cars: "Electric Vehicles",
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
          <BlogPost post={post} />
        </motion.div>
      ))}
    </div>
  );
};

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
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
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

  // Extract posts for magazine layout
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
      {/* Tabs */}
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
        <Tab key="all" title={tabLabels.all} />
        {availableTags.map((tag) => (
          <Tab key={tag} title={tabLabels[tag] || tag} />
        ))}
      </Tabs>

      {/* Magazine Layout: Hero + Second Post side by side */}
      {heroPost && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Hero Post - 60% width */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <HeroPost post={heroPost} />
          </motion.div>

          {/* Second Post - 40% width */}
          {secondPost && (
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <BlogPost post={secondPost} />
            </motion.div>
          )}
        </div>
      )}

      {/* Remaining Posts Grid */}
      {remainingPosts.length > 0 && <PostsGrid posts={remainingPosts} />}
    </div>
  );
};
