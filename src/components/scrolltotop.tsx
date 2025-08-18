'use client'

import { BsArrowUp, BsArrowUpCircle } from "react-icons/bs";
import styles from "@/styles/scrolltotop.module.scss";
import { useEffect, useState } from "react";
import { Blank } from "./blank";

export const ScrollToTopButton = ({
  scrollThreshold,
}: {
  scrollThreshold?: number;
}) => {
  const threshold = scrollThreshold || 0;

  const [show, setShow] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > threshold) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  return show ? (
    <button
      onClick={scrollToTop}
      className={styles.button}
      aria-label="Scroll to Top"
      data-nopico
    >
      <BsArrowUpCircle size={32} />
    </button>
  ) : (
    <Blank />
  );
};
