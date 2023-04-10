// regex from https://regexr.com/3anm9
export const extractYoutubeVideoId = (url: string) => {
  const matches = url.match(
    /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/,
  );
  return matches ? matches[1] : null;
};
