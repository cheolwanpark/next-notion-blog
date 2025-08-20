import { CalloutBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import styles from "@/styles/notion/components.module.scss";
import { RichText } from "./richtext";
import { Block } from "./block";
import { ExtendBlock } from "@/services/notion/types";

export const Callout = ({
  block,
}: {
  block: ExtendBlock<CalloutBlockObjectResponse>;
}) => {
  const icon = getIcon(block);
  return (
    <div className={styles.callout}>
      {icon && (
        <div className={styles.emoji}>
          <span>{icon}</span>
        </div>
      )}
      <div className={styles.content}>
        <p>
          <RichText richTexts={block.callout.rich_text} />
        </p>
        {block.children.map((block, idx, arr) => (
          <Block block={block} blocks={arr} idx={idx} key={idx} />
        ))}
      </div>
    </div>
  );
};

const getIcon = (block: CalloutBlockObjectResponse) => {
  const iconObject = block.callout.icon;
  if (iconObject && iconObject.type === "emoji") {
    return iconObject.emoji;
  } else {
    return null;
  }
};
