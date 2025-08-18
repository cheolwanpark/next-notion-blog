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
  QueryResult,
  Sort,
} from "./types";

const queryImpl = async ({
  query,
  sorts,
  publicOnly = true,
  page_size,
}: {
  query?: Query;
  sorts?: Sort[];
  publicOnly?: boolean;
  page_size?: number;
}): Promise<QueryResult> => {
  let filter: any = buildFilter(query);
  if (publicOnly) {
    const publicFilter = {
      property: "Public",
      checkbox: {
        equals: true,
      },
    };
    filter = filter ? { and: [filter, publicFilter] } : { and: [publicFilter] };
  }
  const response = await notion.databases.query({
    database_id: config.notion.databaseID,
    // @ts-ignore
    filter,
    sorts,
    start_cursor: isNextPageQuery(query) ? query.cursor : undefined,
    page_size: page_size,
  });
  // Filter out database objects from results
  const pageResults = response.results.filter(
    (result): result is PageObjectResponse | PartialPageObjectResponse =>
      result.object === "page"
  );
  
  return {
    next_cursor: response.next_cursor,
    pages: extractPageMeta(pageResults),
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
