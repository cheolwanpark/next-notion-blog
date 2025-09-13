import { config } from "@/config";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import styles from "@/styles/components/intro.module.scss";

export const Intro = () => {
  return (
    <article className={styles.intro} data-nopico>
      <hgroup>
        <h1>{config.blogTitle}</h1>
        <h2>
          Hello! 👋
          <br />
          Welcome to my development blog.
          <br />
          I&apos;m passionate about AI, Agents, Rendering, and Distributed Systems.
          <br />
          This blog is where I share knowledge worth organizing and insights worth spreading.
          <br />
          I hope you find it helpful! 😊
        </h2>
      </hgroup>
      <ul className={styles.contacts}>
        {config.github !== "" && (
          <li>
            <Link
              aria-label="github link"
              href={`https://github.com/${config.github}`}
              target="_blank"
              data-nopico
            >
              <BsGithub size={32} />
            </Link>
          </li>
        )}
      </ul>
    </article>
  );
};
