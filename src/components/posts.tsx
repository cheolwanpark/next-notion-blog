import { PageMeta } from "@/services/notion/types";
import { PostsServer } from "./posts-server";

export const Posts = ({ posts, size }: { posts: PageMeta[]; size: number }) => {
  return <PostsServer posts={posts} size={size} currentPage={0} />;
};
