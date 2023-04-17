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
          안녕하세요 👋
          <br />
          코딩빌런의 개발 블로그입니다.
          <br />
          렌더링과 머신러닝, 웹 등 다양한 분야에 관심을 가지고 공부하고
          있습니다.
          <br />
          이 블로그에는 공부하거나 개발하면서 정리할 필요를 느낀 내용들을 작성할
          예정입니다.
          <br />
          이곳에 있는 글이 여러분에게 도움이 된다면 좋겠습니다 😊
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
