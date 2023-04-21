import { siteConfig } from "../../site.config";

export const giscusConfig = siteConfig.giscus
  ? {
      repo: siteConfig.giscus.repo,
      repoID: siteConfig.giscus.repoID,
      category: siteConfig.giscus.category,
      categoryID: siteConfig.giscus.categoryID,
    }
  : undefined;
