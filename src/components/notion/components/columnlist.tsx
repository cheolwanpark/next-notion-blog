import {
  ColumnBlockObjectResponse,
  ColumnListBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import styles from "@/styles/notion/components.module.scss";
import { Block } from "./block";
import { ExtendBlock } from "@/services/notion/types";

const defaultSpacerWidth = 32;

export const ColumnList = ({
  block,
  spacerWidth,
}: {
  block: ExtendBlock<ColumnListBlockObjectResponse>;
  spacerWidth?: number;
}) => {
  const spacerW = spacerWidth || defaultSpacerWidth;
  const sumSpacerWidth = (block.children.length - 1) * spacerW;
  return (
    <div className={styles.column_list}>
      {block.children.map((block, idx, arr) => {
        const len = arr.length;
        const needSpacer = idx < len - 1;
        const widthStyle = needSpacer
          ? `calc((100% + ${spacerW}px) / ${len})`
          : `calc((100% - ${spacerW}px * (${len} - 1)) / ${len})`;
        const contentWidthStyle = needSpacer
          ? `calc(100% - ${spacerW}px)`
          : "100%";
        return (
          <div style={{ width: widthStyle }} className={styles.col} key={idx}>
            <div
              style={{
                width: contentWidthStyle,
              }}
              className={styles.col}
            >
              <Block block={block} blocks={arr} idx={idx} />
            </div>
            {needSpacer && (
              <div
                style={{ width: `${spacerW}px` }}
                className={styles.col}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Column = ({
  block,
}: {
  block: ExtendBlock<ColumnBlockObjectResponse>;
}) => {
  return (
    <div className={styles.column}>
      {block.children.map((block, idx, arr) => (
        <Block block={block} blocks={arr} idx={idx} key={idx} />
      ))}
    </div>
  );
};
