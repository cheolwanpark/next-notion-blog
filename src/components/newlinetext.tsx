export const NewLineAppliedText = ({ content }: { content: string }) => {
  return (
    <>
      {content.split("\n").map((substr, idx, arr) => {
        const isMiddle = idx < arr.length - 1;
        return (
          <span key={idx}>
            {substr} {isMiddle && <br />}
          </span>
        );
      })}
    </>
  );
};
