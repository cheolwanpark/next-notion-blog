import { contentBold, contentReg } from "@/services/font";
import { PageMeta } from "@/services/notion/types";
import styles from "@/styles/posts.module.css";
import classNames from "classnames";
import dayjs from "dayjs";
import Link from "next/link";

export const Posts = ({ posts, size }: { posts: PageMeta[]; size: number }) => {
  return (
    <section className={styles.posts}>
      {posts.slice(0, size).map((post) => {
        const published = dayjs(post.published).format("MMMM DD, YYYY");
        return (
          <article key={post.path} className={styles.post}>
            <Link
              href={`/post/${post.path}`}
              className={styles.link}
              data-nopico
            ></Link>
            <hgroup>
              <h1 className={contentBold}>{post.title}</h1>
              <h2 className={contentReg}>{post.description}</h2>
            </hgroup>
            <ul className={styles.tags}>
              {post.tags.map((tag) => {
                return (
                  <li className={contentBold}>
                    <Link href={`/tag/${tag}`} data-nopico>
                      #{tag}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p
              className={classNames(styles.additional, contentReg)}
            >{`${published} · ${post.author}`}</p>
          </article>
        );
      })}
    </section>
  );
};
