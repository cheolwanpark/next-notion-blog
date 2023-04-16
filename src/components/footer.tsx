import { config } from "@/config";
import Link from "next/link";
import styles from "@/styles/footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <span>{`© 2023 ${config.owner}`}</span>
      <span className={styles.powered_by}>
        Powered by&nbsp;
        <Link
          href="https://nextjs.org/"
          target="_blank"
          aria-label="Link to Next.js homepage"
          data-nopico
        >
          nextjs
        </Link>
        &nbsp;&&nbsp;
        <Link
          href="https://developers.notion.com/"
          target="_blank"
          aria-label="Link to Notion API homepage"
          data-nopico
        >
          notion API
        </Link>
      </span>
    </footer>
  );
};
