'use client'

import { PageMeta } from "@/services/notion/types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ElementRef, useRef, useCallback } from "react";
import { Posts } from "./posts";
import { TextField } from "./textfield";
import styles from "@/styles/posts.module.scss";

export const SearchablePosts = ({
  posts,
  size,
}: {
  posts: PageMeta[];
  size: number;
}) => {
  const searchFieldRef = useRef<ElementRef<typeof TextField>>(null);
  const inputTimeout = useRef<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const keyword = searchParams?.get('keyword') || '';
  const query = keyword.toLowerCase();

  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(query);
    const descMatch = post.description.toLowerCase().includes(query);
    return titleMatch || descMatch;
  });

  const onSearchKeywordChangeImpl = useCallback(() => {
    const newKeyword = searchFieldRef.current?.value() || "";
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    if (newKeyword) {
      params.set('keyword', newKeyword);
    } else {
      params.delete('keyword');
    }
    params.delete('page'); // Reset page when searching
    
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl);
  }, [router, searchParams, pathname]);

  const onSearchKeywordChange = useCallback(() => {
    if (inputTimeout.current) {
      clearTimeout(inputTimeout.current);
      inputTimeout.current = null;
    }
    inputTimeout.current = setTimeout(
      onSearchKeywordChangeImpl,
      300,
    ) as unknown as number;
  }, [onSearchKeywordChangeImpl]);

  return (
    <>
      <TextField
        id="searchfield"
        default={keyword}
        placeholder="Search Keyword"
        onInput={onSearchKeywordChange}
        ref={searchFieldRef}
        className={styles.searchfield}
      />
      <Posts posts={filteredPosts} size={size} />
    </>
  );
};
