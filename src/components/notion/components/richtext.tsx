import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import styles from "@/styles/notion.richtext.module.css";
import classNames from "classnames";
import Link from "next/link";

// TODO: implement mention, equation type
export const RichText = ({
  richTexts,
  defaultColor,
}: {
  richTexts: RichTextItemResponse[];
  defaultColor?: string;
}) => {
  return (
    <>
      {richTexts.map((richText, idx) => {
        const style = getClassNames(richText);
        const color = getColor(richText, defaultColor);
        const className = classNames(...style, color, "richtext");
        if (richText.type === "text") {
          const content = richText.text.content;
          const link = richText.text.link ? richText.text.link.url : null;
          return (
            <span className={className} key={idx}>
              {link ? (
                <Link href={link} data-nopico>
                  {content}
                </Link>
              ) : (
                content
              )}
            </span>
          );
        } else {
          return <span></span>;
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

const getColor = (richText: RichTextItemResponse, defaultColor?: string) => {
  if (richText.annotations.color === "default" && defaultColor) {
    return getColorClass(defaultColor);
  } else {
    return getColorClass(richText.annotations.color);
  }
};

const getColorClass = (color: string) => {
  switch (color) {
    case "default":
      return styles.default;
    case "blue":
      return styles.blue;
    case "brown":
      return styles.brown;
    case "gray":
      return styles.gray;
    case "green":
      return styles.green;
    case "orange":
      return styles.orange;
    case "pink":
      return styles.pink;
    case "purple":
      return styles.purple;
    case "red":
      return styles.red;
    case "yellow":
      return styles.yellow;
    case "blue_background":
      return styles.blue_background;
    case "brown_background":
      return styles.brown_background;
    case "gray_background":
      return styles.gray_background;
    case "green_background":
      return styles.green_background;
    case "orange_background":
      return styles.orange_background;
    case "pink_background":
      return styles.pink_background;
    case "purple_background":
      return styles.purple_background;
    case "red_background":
      return styles.red_background;
    case "yellow_background":
      return styles.yellow_background;
    default:
      return null;
  }
};
