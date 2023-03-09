import { WithChildren } from "@/services/notion/types/block";
import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { RichText } from "./richtext";
import styles from "@/styles/notion/components.module.css";
import { getColorClass } from "./colors";
import classNames from "classnames";

// TODO: support childs
export const Heading1 = ({
  block,
}: {
  block: Heading1BlockObjectResponse & WithChildren;
}) => {
  return (
    <h1
      className={classNames(
        styles.heading1,
        getColorClass(block.heading_1.color),
      )}
    >
      <RichText richTexts={block.heading_1.rich_text} />
    </h1>
  );
};

export const Heading2 = ({
  block,
}: {
  block: Heading2BlockObjectResponse & WithChildren;
}) => {
  return (
    <h2
      className={classNames(
        styles.heading2,
        getColorClass(block.heading_2.color),
      )}
    >
      <RichText richTexts={block.heading_2.rich_text} />
    </h2>
  );
};

export const Heading3 = ({
  block,
}: {
  block: Heading3BlockObjectResponse & WithChildren;
}) => {
  return (
    <h3
      className={classNames(
        styles.heading3,
        getColorClass(block.heading_3.color),
      )}
    >
      <RichText richTexts={block.heading_3.rich_text} />
    </h3>
  );
};
