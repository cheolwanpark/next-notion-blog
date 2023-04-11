import { PageMeta } from "@/services/notion/types";
import { useRouter } from "next/router";
import { ElementRef, useRef } from "react";
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
  const { keyword } = router.query;
  const query = keyword ? (keyword as string).toLowerCase() : "";

  posts = posts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(query);
    const descMatch = post.description.toLowerCase().includes(query);
    return titleMatch || descMatch;
  });

  const onSearchKeywordChangeImpl = () => {
    const keyword = searchFieldRef.current?.value() || "";
    router.replace(
      { query: { ...router.query, page: 0, keyword } },
      undefined,
      {
        shallow: true,
      },
    );
  };
  const onSearchKeywordChange = () => {
    if (inputTimeout.current) {
      clearTimeout(inputTimeout.current);
      inputTimeout.current = null;
    }
    inputTimeout.current = setTimeout(
      onSearchKeywordChangeImpl,
      300,
    ) as unknown as number;
  };

  return (
    <>
      <TextField
        id="searchfield"
        default={keyword ? (keyword as string) : ""}
        placeholder="Search Keyword"
        onInput={onSearchKeywordChange}
        ref={searchFieldRef}
        className={styles.searchfield}
      />
      <Posts posts={posts} size={size} />
    </>
  );
};
