'use client'

import { Blank } from "@/components/blank";
import { extractYoutubeVideoId } from "@/services/youtube";
import { VideoBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import classNames from "classnames";
import YouTube from "react-youtube";
import styles from "@/styles/notion/components.module.scss";
import { ExtendBlock } from "@/services/notion/types/block";

export const Video = ({
  block,
}: {
  block: ExtendBlock<VideoBlockObjectResponse>;
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
