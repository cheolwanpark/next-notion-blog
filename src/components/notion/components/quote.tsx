import { WithChildren } from "@/services/notion/types/block";
import { QuoteBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import classNames from "classnames";
import styles from "@/styles/notion/components.module.css";
import { getColorClass } from "./colors";
import { RichText } from "./richtext";

// TODO: support childs
export const Quote = ({
  block,
}: {
  block: QuoteBlockObjectResponse & WithChildren;
}) => {
  return (
    <div className={classNames(styles.quote, getColorClass(block.quote.color))}>
      <RichText richTexts={block.quote.rich_text} />
    </div>
  );
};
