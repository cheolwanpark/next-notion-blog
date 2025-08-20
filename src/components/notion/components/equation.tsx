import {
  EquationBlockExtended,
  ExtendBlock,
} from "@/services/notion/types";
import styles from "@/styles/notion/components.module.scss";

type EquationProps = {
  block: ExtendBlock<EquationBlockExtended>;
};

export const Equation = ({ block }: EquationProps) => {
  return (
    <div
      className={styles.equation}
      dangerouslySetInnerHTML={{ __html: block.katexHtml }}
    />
  );
};
