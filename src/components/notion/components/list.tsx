import { BlockWithChildren, WithChildren } from "@/services/notion/types/block";
import {
  BulletedListItemBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import styles from "@/styles/notion/components.module.css";
import classNames from "classnames";
import { getColorClass } from "./colors";
import { RichText } from "./richtext";
import { Block } from "./block";
import { Blank } from "@/components/blank";

export const BulletedList = ({
  block,
  blocks,
  idx,
}: {
  block: BulletedListItemBlockObjectResponse & WithChildren;
  blocks: BlockWithChildren[];
  idx: number;
}) => {
  if (!isFirstListItem(blocks, idx)) {
    return <Blank />;
  }
  const itemBlocks = mergeNeighboringListItems(block, blocks, idx);
  return (
    <ul className={styles.bulletedlist}>
      {itemBlocks.map((block, idx) => (
        <li
          className={classNames(getColorClass(block.bulleted_list_item.color))}
          key={idx}
        >
          <RichText richTexts={block.bulleted_list_item.rich_text} />
          {block.has_children && (
            <>
              {block.children.map((child, idx2, arr) => (
                <Block block={child} blocks={arr} idx={idx2} key={idx2} />
              ))}
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export const NumberedList = ({
  block,
  blocks,
  idx,
}: {
  block: NumberedListItemBlockObjectResponse & WithChildren;
  blocks: BlockWithChildren[];
  idx: number;
}) => {
  if (!isFirstListItem(blocks, idx)) {
    return <Blank />;
  }
  const itemBlocks = mergeNeighboringListItems(block, blocks, idx);
  return (
    <ol className={styles.numberedlist}>
      {itemBlocks.map((block, idx) => (
        <li
          className={classNames(getColorClass(block.numbered_list_item.color))}
          key={idx}
        >
          <RichText richTexts={block.numbered_list_item.rich_text} />
          {block.has_children && (
            <>
              {block.children.map((child, idx2, arr) => (
                <Block block={child} blocks={arr} idx={idx2} key={idx2} />
              ))}
            </>
          )}
        </li>
      ))}
    </ol>
  );
};

const isFirstListItem = (blocks: BlockWithChildren[], idx: number) => {
  if (idx === 0) return true;
  return blocks[idx].type !== blocks[idx - 1].type;
};

const mergeNeighboringListItems = <T extends BlockWithChildren>(
  block: T,
  blocks: BlockWithChildren[],
  idx: number,
): T[] => {
  const result = [];
  for (let i = idx; i < blocks.length; ++i) {
    if (blocks[i].type === block.type) result.push(blocks[i]);
    else break;
  }
  // @ts-ignore
  return result;
};
