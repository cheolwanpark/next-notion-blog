import { config } from "@/config";
import { DarkModeContext } from "@/services/darkmode";
import Giscus from "@giscus/react";
import { useContext } from "react";
import { Blank } from "./blank";

export const Comments = ({ title }: { title: string }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  if (!config.giscus) return <Blank />;
  return (
    <Giscus
      id="comments"
      repo={`${config.github}/${config.giscus.repo}`}
      repoId={config.giscus.repoID}
      category={config.giscus.category}
      categoryId={config.giscus.categoryID}
      mapping="specific"
      term={`Welcome to "${title}" post discussion!`}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={isDarkMode ? "dark_dimmed" : "light"}
      lang="en"
      loading="lazy"
    />
  );
};
