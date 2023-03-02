import classNames from "classnames";
import { Noto_Sans_Display, Noto_Serif_KR } from "next/font/google";

const ui = Noto_Sans_Display({
  weight: ["300", "900"],
  style: "normal",
  subsets: ["latin-ext"],
});

const contentRegular = Noto_Serif_KR({
  weight: "300",
  style: "normal",
  subsets: ["latin"],
});

const contentBold = Noto_Serif_KR({
  weight: "900",
  style: "normal",
  subsets: ["latin"],
});

export const uiFont = classNames(ui.className);
export const contentFont = classNames(
  contentRegular.className,
  contentBold.className,
);
