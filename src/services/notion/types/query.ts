import { PageMeta } from "./page";

export type QueryResult = {
  next_cursor: string | null;
  pages: PageMeta[];
};

export type Sort =
  | {
      property: string;
      direction: "ascending" | "descending";
    }
  | {
      timestamp: "created_time" | "last_edited_time";
      direction: "ascending" | "descending";
    };

export type Query =
  | NextPageQuery
  | TagQuery
  | ContentQuery
  | PathQuery
  | undefined;

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

type PathQuery = {
  path: string;
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

export const isPathQuery = (q: Query): q is PathQuery => {
  return q !== undefined && (<PathQuery>q).path !== undefined;
};

export type QueryResponse = {
  next_cursor: string | null;
  pages: PageMeta[];
};
