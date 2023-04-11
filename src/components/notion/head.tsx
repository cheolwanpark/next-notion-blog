import { PageMeta } from "@/services/notion/types";
import styles from "@/styles/notion/head.module.scss";
import componentStyles from "@/styles/notion/components.module.scss";
import dayjs from "dayjs";
import Link from "next/link";

export const NotionHead = ({ meta }: { meta: PageMeta }) => {
  const published = dayjs(meta.published).format("MMMM DD, YYYY");
  return (
    <section className={styles.head}>
      <hgroup>
        <h1>{meta.title}</h1>
        <h2>{meta.description}</h2>
      </hgroup>
      <ul className={styles.tags}>
        {meta.tags.map((tag) => {
          return (
            <li key={tag}>
              <Link href={`/tag/${tag}`} data-nopico>
                #{tag}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className={styles.additional}>{`${published} · ${meta.author}`}</p>
      <div className={componentStyles.divider}></div>
    </section>
  );
};
