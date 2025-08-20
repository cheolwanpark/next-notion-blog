import { QuoteBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import classNames from "classnames";
import styles from "@/styles/notion/components.module.scss";
import { getColorClass } from "./colors";
import { RichText } from "./richtext";
import { ExtendBlock } from "@/services/notion/types";

// TODO: support childs
export const Quote = ({
  block,
}: {
  block: ExtendBlock<QuoteBlockObjectResponse>;
}) => {
  return (
    <div className={classNames(styles.quote, getColorClass(block.quote.color))}>
      <RichText richTexts={block.quote.rich_text} />
    </div>
  );
};
