import { config } from "@/config";
import Link from "next/link";
import styles from "@/styles/footer.module.css";
import classNames from "classnames";
import { ui } from "@/services/font";

export const Footer = () => {
  return (
    <footer className={classNames(styles.footer, ui)}>
      <span>{`© 2023 ${config.owner}`}</span>
      <span>
        Powered by&nbsp;
        <Link href="https://nextjs.org/" target="_blank" data-nopico>
          nextjs
        </Link>
        &nbsp;&&nbsp;
        <Link href="https://developers.notion.com/" target="_blank" data-nopico>
          notion API
        </Link>
      </span>
    </footer>
  );
};
