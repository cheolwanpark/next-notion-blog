import classNames from "classnames";
import { Noto_Sans_Display, Noto_Serif_KR } from "next/font/google";

const ui_ = Noto_Sans_Display({
  weight: ["300", "900"],
  style: ["normal", "italic"],
  subsets: ["latin-ext"],
});

const content_ = Noto_Serif_KR({
  weight: ["300", "900"],
  style: ["normal"],
  subsets: ["latin"],
});

export const ui = classNames(ui_.className);
export const content = classNames(content_.className);
