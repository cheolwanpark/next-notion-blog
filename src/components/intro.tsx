import { config } from "@/config";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import styles from "@/styles/intro.module.scss";

export const Intro = () => {
  return (
    <article className={styles.intro} data-nopico>
      <hgroup>
        <h1>{config.blogTitle}</h1>
        <h2>
          Welcome to demo of hugo’s theme PaperMod.
          <br />
          PaperMod is a simple but fast and responsive theme with useful
          feature-set that enhances UX.
          <br />
          Do give a 🌟 on Github !
          <br />
          PaperMod is based on theme Paper.
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
