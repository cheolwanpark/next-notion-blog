import { config } from "@/config";
import { isFullPage } from "@notionhq/client";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import dayjs from "dayjs";
import pMemoize from "p-memoize";
import { notion } from "./api";
import { getPageMeta } from "./page";
import {
  isContentQuery,
  isNextPageQuery,
  isTagQuery,
  PageMeta,
  Query,
} from "./types";
import { notNull } from "./utils";

const queryImpl = async (query?: Query, page_size?: number) => {
  const response = await notion.databases.query({
    database_id: config.notion.databaseID,
    // @ts-ignore
    filter: buildFilter(query),
    start_cursor: isNextPageQuery(query) ? query.cursor : undefined,
    page_size: page_size,
  });
  return {
    next_cursor: response.next_cursor,
    pages: convert(response.results),
  };
};

const buildFilter = (q?: Query) => {
  if (isTagQuery(q)) {
    return {
      [q.type]: q.tags.map((tag) => ({
        property: "Tags",
        contains: tag,
      })),
    };
  } else if (isContentQuery(q)) {
    const condition = [];
    if (q.title) {
      condition.push({
        property: "Name",
        contains: q.title,
      });
    }
    if (q.description) {
      condition.push({
        property: "Description",
        contains: q.description,
      });
    }
    return {
      [q.type]: condition,
    };
  } else {
    return undefined;
  }
};

const convert = (
  pages: (PageObjectResponse | PartialPageObjectResponse)[],
): PageMeta[] => {
  return pages.map((page) => getPageMeta(page)).filter(notNull);
};

export const query = pMemoize(queryImpl);
