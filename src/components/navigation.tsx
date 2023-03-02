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

export const Navigation = () => {
  const { isDarkMode, setMode } = useContext(DarkModeContext);
  const darkModeIcon = isDarkMode ? BsFillBrightnessHighFill : BsFillMoonFill;
  const toggleDarkMode = () => {
    setMode(!isDarkMode);
  };
  return (
    <>
      <nav className={classNames("container", ui)}>
        <ul>
          <li className="title">
            <Link href="/" data-nopico>
              <strong>{config.blogTitle}</strong>
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <button onClick={toggleDarkMode} className="button" data-nopico>
              {createElement(darkModeIcon)}
            </button>
          </li>
          <li>
            <button className="button" data-nopico>
              <BsSearch />
            </button>
          </li>
        </ul>
      </nav>
      <style jsx>{`
        .title {
          font-size: 24px;
          color: var(--color);
        }
        .title:hover {
          color: var(--primary);
        }
        .button {
          color: var(--color);
        }
        .button:hover {
          color: var(--primary);
        }
      `}</style>
    </>
  );
};
