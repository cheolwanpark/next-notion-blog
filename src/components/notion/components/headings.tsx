import { WithChildren } from "@/services/notion/types/block";
import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { RichText } from "./richtext";
import styles from "@/styles/notion.components.module.css";

// TODO: support childs
export const Heading1 = ({
  block,
}: {
  block: Heading1BlockObjectResponse & WithChildren;
}) => {
  return (
    <h1 className={styles.heading1}>
      <RichText
        richTexts={block.heading_1.rich_text}
        defaultColor={block.heading_1.color}
      />
    </h1>
  );
};

export const Heading2 = ({
  block,
}: {
  block: Heading2BlockObjectResponse & WithChildren;
}) => {
  return (
    <h2 className={styles.heading2}>
      <RichText
        richTexts={block.heading_2.rich_text}
        defaultColor={block.heading_2.color}
      />
    </h2>
  );
};

export const Heading3 = ({
  block,
}: {
  block: Heading3BlockObjectResponse & WithChildren;
}) => {
  return (
    <h3 className={styles.heading3}>
      <RichText
        richTexts={block.heading_3.rich_text}
        defaultColor={block.heading_3.color}
      />
    </h3>
  );
};
