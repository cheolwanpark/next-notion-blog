import { BlockWithChildren } from "@/services/notion/types/block";
import { Block } from "./components/block";
import styles from "@/styles/notion/components.module.scss";
import { PageMeta } from "@/services/notion/types";
import { NotionHead } from "./head";

export const NotionRenderer = ({
  blocks,
  meta,
}: {
  blocks: BlockWithChildren[];
  meta?: PageMeta;
}) => {
  return (
    <>
      {meta && <NotionHead meta={meta} />}
      <div className={styles.renderer}>
        {blocks.map((block, idx, arr) => {
          return <Block block={block} blocks={arr} idx={idx} key={idx} />;
        })}
      </div>
    </>
  );
};
