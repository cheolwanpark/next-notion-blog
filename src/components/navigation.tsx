import { config } from "@/config";
import { DarkModeContext } from "@/services/darkmode";
import { ui } from "@/services/font";
import classNames from "classnames";
import Link from "next/link";
import { createElement, useContext } from "react";
import {
  BsFillBrightnessHighFill,
  BsFillMoonFill,
  BsSearch,
} from "react-icons/bs";
import styles from "@/styles/navigation.module.css";

export const Navigation = () => {
  const { isDarkMode, setMode } = useContext(DarkModeContext);
  const darkModeIcon = isDarkMode ? BsFillBrightnessHighFill : BsFillMoonFill;
  const toggleDarkMode = () => {
    setMode(!isDarkMode);
  };
  return (
    <nav className={classNames("container", ui)}>
      <ul>
        <li className={styles.title}>
          <Link href="/" data-nopico>
            <strong>{config.blogTitle}</strong>
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <button
            onClick={toggleDarkMode}
            className={styles.button}
            data-nopico
          >
            {createElement(darkModeIcon)}
          </button>
        </li>
        <li>
          <button className={styles.button} data-nopico>
            <BsSearch />
          </button>
        </li>
      </ul>
    </nav>
  );
};
