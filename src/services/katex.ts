import katex from "katex";

export const renderKatex = (content: string) => {
  try {
    return katex.renderToString(content);
  } catch (_) {
    return null;
  }
};
