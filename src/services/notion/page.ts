import { isFullPage } from "@notionhq/client";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import dayjs from "dayjs";
import pMemoize from "p-memoize";
import { notion } from "./api";
import { query } from "./query";
import { PageMeta } from "./types";
import { plainText } from "./utils";

const getPageImpl = async (id: string) => {
  const page = await notion.pages.retrieve({ page_id: id });
  return getPageMeta(page);
};
export const getPage = pMemoize(getPageImpl);

const getAllPagesImpl = async () => {
  let response = null;
  let pages: PageMeta[] = [];
  do {
    response = await query();
    pages = pages.concat(response.pages);
  } while (response.next_cursor);
  return pages;
};
export const getAllPages = pMemoize(getAllPagesImpl);

export const getPageMeta = (
  page: PageObjectResponse | PartialPageObjectResponse,
): PageMeta | null => {
  try {
    if (isFullPage(page)) {
      const id = page.id;
      const path = page.properties["Path"];
      const title = page.properties["Name"];
      const author = page.properties["Author"];
      const description = page.properties["Description"];
      const tags = page.properties["Tags"];
      const isPublic = page.properties["Public"];
      const published = page.properties["Published"];
      const updated = page.last_edited_time;
      return {
        id,
        path: path.type === "rich_text" ? plainText(path.rich_text) : "",
        title: title.type === "title" ? plainText(title.title) : "",
        author: author.type === "rich_text" ? plainText(author.rich_text) : "",
        description:
          description.type === "rich_text"
            ? plainText(description.rich_text)
            : "",
        tags:
          tags.type === "multi_select"
            ? tags.multi_select.map((option) => option.name)
            : [],
        public: isPublic.type === "checkbox" ? isPublic.checkbox : false,
        published:
          published.type === "date"
            ? dayjs(published.date!.start).toJSON()
            : dayjs().toJSON(),
        updated: dayjs(updated).toJSON(),
      };
    } else {
      return null;
    }
  } catch (_) {
    return null;
  }
};
