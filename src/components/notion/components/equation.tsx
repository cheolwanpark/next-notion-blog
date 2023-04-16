import { WithChildren } from "@/services/notion/types/block";
import { EquationBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import styles from "@/styles/notion/components.module.scss";
import classNames from "classnames";
import dynamic from "next/dynamic";

type EquationProps = {
  block: EquationBlockObjectResponse & WithChildren;
};

const EquationImpl = (
  { block }: EquationProps,
  renderKatex: (expression: string) => string | null,
) => {
  const html = renderKatex(block.equation.expression);
  return (
    <div
      className={classNames(styles.equation, { [styles.error]: !html })}
      dangerouslySetInnerHTML={{ __html: html || "KaTex Error!" }}
    />
  );
};

export const Equation = dynamic(() =>
  import("@/services/katex").then((mod) => {
    return (props: EquationProps) => EquationImpl(props, mod.renderKatex);
  }),
);
