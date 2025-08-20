import { config } from "@/config";
import { SimpleThemeToggle } from "@/components/simple-theme-toggle";
import Link from "next/link";
import styles from "@/styles/components/navigation.module.scss";
import classNames from "classnames";

export const Navigation = () => {
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
          <SimpleThemeToggle />
        </li>
      </ul>
    </nav>
  );
};
