'use client'

import { PageMeta } from "@/services/notion/types";
import styles from "@/styles/posts.module.scss";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { NewLineAppliedText } from "./newlinetext";
import { useCallback } from "react";

export const Posts = ({ posts, size }: { posts: PageMeta[]; size: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const page = searchParams?.get('page') || '0';
  const pageIdx = Number.parseInt(page) || 0;
  const startIdx = pageIdx * size;
  const prevButtonExists = pageIdx > 0;
  const nextButtonExists = startIdx + size < posts.length;
  const currentPosts = posts.slice(startIdx, startIdx + size);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "auto" });
  
  const setPageIdx = useCallback((idx: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    if (idx > 0) {
      params.set('page', idx.toString());
    } else {
      params.delete('page');
    }
    
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl);
  }, [router, searchParams, pathname]);

  const prev = useCallback(() => {
    scrollToTop();
    setPageIdx(pageIdx - 1);
  }, [pageIdx, setPageIdx]);

  const next = useCallback(() => {
    scrollToTop();
    setPageIdx(pageIdx + 1);
  }, [pageIdx, setPageIdx]);

  return (
    <>
      <section className={styles.posts}>
        {currentPosts.map((post, idx) => {
          const published = dayjs(post.published).format("MMMM DD, YYYY");
          return (
            <article key={idx} className={styles.post}>
              <Link
                aria-label={`link to the ${post.title}`}
                href={`/post/${post.path}`}
                className={styles.link}
                data-nopico
              ></Link>
              <hgroup>
                <h1>{post.title}</h1>
                <h2>
                  <NewLineAppliedText content={post.description} />
                </h2>
              </hgroup>
              <ul className={styles.tags}>
                {post.tags.map((tag) => {
                  return (
                    <li key={tag}>
                      <Link
                        href={`/tag/${tag}`}
                        aria-label={`Link to #${tag} page`}
                        data-nopico
                      >
                        #{tag}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className={styles.additional}>
                {`${published} · ${post.author}`}
              </p>
            </article>
          );
        })}
        <div className={styles.navigator}>
          {prevButtonExists && (
            <button
              aria-label="previous page"
              className={styles.button}
              style={{ float: "left" }}
              onClick={prev}
              data-nopico
            >
              « PREV
            </button>
          )}
          {nextButtonExists && (
            <button
              aria-label="next page"
              className={styles.button}
              style={{ float: "right" }}
              onClick={next}
              data-nopico
            >
              NEXT »
            </button>
          )}
        </div>
      </section>
    </>
  );
};
