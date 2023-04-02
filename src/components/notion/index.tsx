import { BlockWithChildren } from "@/services/notion/types/block";
import { Block } from "./components/block";
import styles from "@/styles/notion/components.module.css";

export const NotionRenderer = ({ blocks }: { blocks: BlockWithChildren[] }) => {
  return (
    <div className={styles.renderer}>
      {blocks.map((block, idx, arr) => {
        return <Block block={block} blocks={arr} idx={idx} key={idx} />;
      })}
    </div>
  );
};
