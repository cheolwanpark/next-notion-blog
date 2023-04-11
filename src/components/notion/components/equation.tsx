import { WithChildren } from "@/services/notion/types/block";
import { EquationBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import styles from "@/styles/notion/components.module.scss";
import classNames from "classnames";
import { renderKatex } from "@/services/katex";

export const Equation = ({
  block,
}: {
  block: EquationBlockObjectResponse & WithChildren;
}) => {
  const html = renderKatex(block.equation.expression);
  return (
    <div
      className={classNames(styles.equation, { [styles.error]: !html })}
      dangerouslySetInnerHTML={{ __html: html || "KaTex Error!" }}
    />
  );
};
