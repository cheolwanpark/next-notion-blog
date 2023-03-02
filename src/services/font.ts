import classNames from "classnames";
import { Noto_Sans_Display, Noto_Serif_KR } from "next/font/google";

const ui_ = Noto_Sans_Display({
  weight: ["300", "900"],
  style: "normal",
  subsets: ["latin-ext"],
});

const contentReg_ = Noto_Serif_KR({
  weight: "300",
  style: "normal",
  subsets: ["latin"],
});

const contentBold_ = Noto_Serif_KR({
  weight: "900",
  style: "normal",
  subsets: ["latin"],
});

export const ui = classNames(ui_.className);
export const contentReg = classNames(contentReg_.className);
export const contentBold = classNames(contentBold_.className);
