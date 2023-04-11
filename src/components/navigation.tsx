import { config } from "@/config";
import { DarkModeContext } from "@/services/darkmode";
import Link from "next/link";
import { createElement, useContext } from "react";
import { BsFillBrightnessHighFill, BsFillMoonFill } from "react-icons/bs";
import styles from "@/styles/navigation.module.scss";
import classNames from "classnames";

export const Navigation = () => {
  const { isDarkMode, setMode } = useContext(DarkModeContext);
  const darkModeIcon = isDarkMode ? BsFillBrightnessHighFill : BsFillMoonFill;
  const toggleDarkMode = () => {
    setMode(!isDarkMode);
  };
  return (
    <nav className={classNames("container", styles.navigation)}>
      <ul>
        <li className={styles.title}>
          <Link href="/" data-nopico>
            <strong>{config.blogTitle}</strong>
          </Link>
        </li>
      </ul>
      <ul className={styles.buttons}>
        <li>
          <Link href="/post" className={styles.button} data-nopico>
            <strong>POSTS</strong>
          </Link>
        </li>
        <li>
          <button
            aria-label="toggle dark mode button"
            onClick={toggleDarkMode}
            className={styles.button}
            data-nopico
          >
            {createElement(darkModeIcon)}
          </button>
        </li>
      </ul>
    </nav>
  );
};
