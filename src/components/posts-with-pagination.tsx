import { PageMeta } from "@/services/notion/types";
import { PostsServer } from "./posts-server";
import { Suspense } from "react";

interface PostsWithPaginationProps {
  posts: PageMeta[];
  size: number;
  searchParams?: { page?: string };
}

export const PostsWithPagination = ({ posts, size, searchParams }: PostsWithPaginationProps) => {
  const page = searchParams?.page || '0';
  const pageIdx = Number.parseInt(page) || 0;

  return (
    <Suspense fallback={<div>Loading posts...</div>}>
      <PostsServer posts={posts} size={size} currentPage={pageIdx} />
    </Suspense>
  );
};