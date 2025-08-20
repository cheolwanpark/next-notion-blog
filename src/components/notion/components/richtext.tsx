import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import styles from "@/styles/notion/richtext.module.scss";
import classNames from "classnames";
import Link from "next/link";
import { getColorClass } from "./colors";
import { RichTextObject } from "@/services/notion/types";
import { NewLineAppliedText } from "@/components/newlinetext";

type RichTextProps = {
  richTexts: RichTextObject[];
};

// TODO: implement mention, equation type
export const RichText = ({ richTexts }: RichTextProps) => {
  return (
    <>
      {richTexts.map((richText, idx) => {
        const style = getClassNames(richText);
        const color = getColorClass(richText.annotations.color);
        const className = classNames(...style, color);
        if (richText.type === "text") {
          const content = richText.text.content;
          const link = richText.text.link ? richText.text.link.url : null;
          return (
            <span className={className} key={idx}>
              {link ? (
                <Link
                  className={styles.link}
                  href={link}
                  target="_blank"
                  aria-label={`Link to ${content}`}
                  data-nopico
                >
                  <NewLineAppliedText content={content} />
                </Link>
              ) : (
                <NewLineAppliedText content={content} />
              )}
            </span>
          );
        } else if (richText.type === "equation") {
          return (
            <span
              dangerouslySetInnerHTML={{ __html: richText.katexHtml || "" }}
              className={classNames(styles.equation, className)}
              key={idx}
            />
          );
        } else {
          return <span key={idx}></span>;
        }
      })}
    </>
  );
};

const getClassNames = (richText: RichTextItemResponse) => {
  const style = richText.annotations;
  const classNames = [];
  if (style.bold) classNames.push(styles.bold);
  if (style.italic) classNames.push(styles.italic);
  if (style.strikethrough) classNames.push(styles.strikethrough);
  if (style.underline) classNames.push(styles.underline);
  return classNames;
};
