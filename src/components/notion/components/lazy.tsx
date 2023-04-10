import dynamic from "next/dynamic";

export const Paragraph = dynamic(() =>
  import("./paragraph").then(async (mod) => mod.Paragraph),
);

export const Heading1 = dynamic(() =>
  import("./headings").then(async (mod) => mod.Heading1),
);

export const Heading2 = dynamic(() =>
  import("./headings").then(async (mod) => mod.Heading2),
);

export const Heading3 = dynamic(() =>
  import("./headings").then(async (mod) => mod.Heading3),
);

export const Quote = dynamic(() =>
  import("./quote").then(async (mod) => mod.Quote),
);

export const BulletedList = dynamic(() =>
  import("./list").then(async (mod) => mod.BulletedList),
);

export const NumberedList = dynamic(() =>
  import("./list").then(async (mod) => mod.NumberedList),
);

export const Divider = dynamic(() =>
  import("./divider").then(async (mod) => mod.Divider),
);

export const Code = dynamic(() =>
  import("./code").then(async (mod) => {
    await import("@/services/prism");
    return mod.Code;
  }),
);

export const NotionImage = dynamic(() =>
  import("./image").then(async (mod) => mod.NotionImage),
);

export const Callout = dynamic(() =>
  import("./callout").then(async (mod) => mod.Callout),
);

export const ColumnList = dynamic(() =>
  import("./columnlist").then(async (mod) => mod.ColumnList),
);

export const Column = dynamic(() =>
  import("./columnlist").then(async (mod) => mod.Column),
);

export const Bookmark = dynamic(() =>
  import("./bookmark").then(async (mod) => mod.Bookmark),
);

export const Equation = dynamic(() =>
  import("./equation").then(async (mod) => mod.Equation),
);

export const Video = dynamic(() =>
  import("./video").then(async (mod) => mod.Video),
);
