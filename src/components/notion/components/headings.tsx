import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { RichText } from "./richtext";
import styles from "@/styles/notion/components.module.scss";
import { getColorClass } from "./colors";
import classNames from "classnames";
import { BsLink45Deg } from "react-icons/bs";
import { plainText } from "@/services/notion/utils";
import Link from "next/link";
import { ExtendBlock } from "@/services/notion/types";

// TODO: support childs
export const Heading1 = ({
  block,
}: {
  block: ExtendBlock<Heading1BlockObjectResponse>;
}) => {
  const id = plainText(block.heading_1.rich_text);
  return (
    <h1
      className={classNames(
        styles.heading1,
        getColorClass(block.heading_1.color, true),
      )}
      id={id}
    >
      <RichText richTexts={block.heading_1.rich_text} />
      <Link
        href={`#${encodeURIComponent(id)}`}
        aria-label={`Link to ${id} section`}
        data-nopico
      >
        <BsLink45Deg />
      </Link>
    </h1>
  );
};

export const Heading2 = ({
  block,
}: {
  block: ExtendBlock<Heading2BlockObjectResponse>;
}) => {
  const id = plainText(block.heading_2.rich_text);
  return (
    <h2
      className={classNames(
        styles.heading2,
        getColorClass(block.heading_2.color, true),
      )}
      id={id}
    >
      <RichText richTexts={block.heading_2.rich_text} />
      <Link
        href={`#${encodeURIComponent(id)}`}
        aria-label={`Link to ${id} section`}
        data-nopico
      >
        <BsLink45Deg />
      </Link>
    </h2>
  );
};

export const Heading3 = ({
  block,
}: {
  block: ExtendBlock<Heading3BlockObjectResponse>;
}) => {
  const id = plainText(block.heading_3.rich_text);
  return (
    <h3
      className={classNames(
        styles.heading3,
        getColorClass(block.heading_3.color, true),
      )}
      id={id}
    >
      <RichText richTexts={block.heading_3.rich_text} />
      <Link
        href={`#${encodeURIComponent(id)}`}
        aria-label={`Link to ${id} section`}
        data-nopico
      >
        <BsLink45Deg />
      </Link>
    </h3>
  );
};
