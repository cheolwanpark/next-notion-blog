'use client'

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import styles from "@/styles/components/posts.module.scss";

interface PaginationControlsProps {
  currentPage: number;
  prevButtonExists: boolean;
  nextButtonExists: boolean;
}

export const PaginationControls = ({ 
  currentPage, 
  prevButtonExists, 
  nextButtonExists 
}: PaginationControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
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
    setPageIdx(currentPage - 1);
  }, [currentPage, setPageIdx]);

  const next = useCallback(() => {
    scrollToTop();
    setPageIdx(currentPage + 1);
  }, [currentPage, setPageIdx]);

  return (
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
  );
};