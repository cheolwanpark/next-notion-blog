'use client'

import { config } from "@/config";
import { useDarkMode } from "@/components/providers";
import { ModernThemeToggle } from "@/components/modern-theme-toggle";
import Link from "next/link";
import styles from "@/styles/navigation.module.scss";
import classNames from "classnames";

export const Navigation = () => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <nav className={classNames("container", styles.navigation)}>
      <ul>
        <li className={styles.title}>
          <Link href="/" aria-label="Link to Main page" data-nopico>
            <strong>{config.blogTitle}</strong>
          </Link>
        </li>
      </ul>
      <ul className={styles.buttons}>
        <li>
          <Link
            href="/post"
            className={styles.button}
            aria-label="Link to Posts page"
            data-nopico
          >
            <strong>POSTS</strong>
          </Link>
        </li>
        <li style={{ position: 'relative' }}>
          <ModernThemeToggle initialTheme={isDarkMode === true ? 'dark' : 'light'} />
        </li>
      </ul>
    </nav>
  );
};
