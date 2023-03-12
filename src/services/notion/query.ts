import { config } from "@/config";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import pMemoize from "p-memoize";
import { notion } from "./api";
import { getPageMeta } from "./page";
import { isNotNull } from "@/services/utils";
import {
  isContentQuery,
  isNextPageQuery,
  isPathQuery,
  isTagQuery,
  PageMeta,
  Query,
} from "./types";

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
    pages: extractPageMeta(response.results),
  };
};

const buildFilter = (q?: Query) => {
  if (isTagQuery(q)) {
    return {
      [q.type]: q.tags.map((tag) => ({
        property: "Tags",
        multi_select: {
          contains: tag,
        },
      })),
    };
  } else if (isContentQuery(q)) {
    const condition = [];
    if (q.title) {
      condition.push({
        property: "Name",
        rich_text: {
          contains: q.title,
        },
      });
    }
    if (q.description) {
      condition.push({
        property: "Description",
        rich_text: {
          contains: q.description,
        },
      });
    }
    return {
      [q.type]: condition,
    };
  } else if (isPathQuery(q)) {
    return {
      and: [
        {
          property: "Path",
          rich_text: {
            equals: q.path,
          },
        },
      ],
    };
  } else {
    return undefined;
  }
};

const extractPageMeta = (
  pages: (PageObjectResponse | PartialPageObjectResponse)[],
): PageMeta[] => {
  return pages.map((page) => getPageMeta(page)).filter(isNotNull);
};

export const query = pMemoize(queryImpl);
