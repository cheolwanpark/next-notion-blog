import {
  BookmarkBlockExtended,
  WithChildren,
} from "@/services/notion/types/block";
import styles from "@/styles/notion/components.module.css";
import Link from "next/link";
import { RichText } from "./richtext";

export const Bookmark = ({
  block,
}: {
  block: BookmarkBlockExtended & WithChildren;
}) => {
  const {
    metadata,
    bookmark: { caption },
  } = block;
  return (
    <div className={styles.bookmark_box}>
      <div className={styles.bookmark}>
        <div className={styles.informations}>
          {metadata.title && <h1>{metadata.title}</h1>}
          {metadata.description && <h2>{metadata.description}</h2>}
          {metadata.url && <h3>{metadata.url}</h3>}
        </div>
        <Link
          href={metadata.url}
          target="_blank"
          className={styles.link}
          data-nopico
        ></Link>
      </div>
      <div className={styles.caption}>
        <RichText richTexts={caption} />
      </div>
    </div>
  );
};
