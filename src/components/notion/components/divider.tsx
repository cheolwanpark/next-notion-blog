import { WithChildren } from "@/services/notion/types/block";
import styles from "@/styles/notion/components.module.css";
import { DividerBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const Divider = ({
  block,
}: {
  block: DividerBlockObjectResponse & WithChildren;
}) => {
  return <div className={styles.divider}></div>;
};
