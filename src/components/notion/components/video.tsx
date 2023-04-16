import { Blank } from "@/components/blank";
import { WithChildren } from "@/services/notion/types/block";
import { extractYoutubeVideoId } from "@/services/youtube";
import { VideoBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import classNames from "classnames";
import YouTube from "react-youtube";
import styles from "@/styles/notion/components.module.scss";

export const Video = ({
  block,
}: {
  block: VideoBlockObjectResponse & WithChildren;
}) => {
  if (block.video.type === "external") {
    const id = extractYoutubeVideoId(block.video.external.url);
    return id ? (
      <YouTube
        videoId={id}
        className={classNames(styles.video, styles.youtube)}
        iframeClassName={styles.iframe}
      />
    ) : (
      <Blank />
    );
  } else {
    return <Blank />;
  }
};
