import dayjs from "dayjs";

export type Query = NextPageQuery | TagQuery | ContentQuery | undefined;

type NextPageQuery = {
  cursor: string;
};

type TagQuery = {
  type: "and" | "or";
  tags: string[];
};

type ContentQuery = {
  type: "and" | "or";
  title?: string;
  description?: string;
};

export const isNextPageQuery = (q: Query): q is NextPageQuery => {
  return q !== undefined && (<NextPageQuery>q).cursor !== undefined;
};

export const isTagQuery = (q: Query): q is TagQuery => {
  return q !== undefined && (<TagQuery>q).tags !== undefined;
};

export const isContentQuery = (q: Query): q is ContentQuery => {
  return (
    q !== undefined &&
    ((<ContentQuery>q).title !== undefined ||
      (<ContentQuery>q).description !== undefined)
  );
};

export type QueryResponse = {
  next_cursor: string | null;
  pages: PageMeta[];
};

export type PageMeta = {
  id: string;
  path: string;
  title: string;
  author: string;
  description: string;
  tags: string[];
  public: boolean;
  published: string;
  updated: string;
};
