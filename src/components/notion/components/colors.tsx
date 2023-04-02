import colors from "@/styles/notion/colors.module.css";

export const getColorClass = (color: string) => {
  switch (color) {
    case "default":
      return colors.default;
    case "blue":
      return colors.blue;
    case "brown":
      return colors.brown;
    case "gray":
      return colors.gray;
    case "green":
      return colors.green;
    case "orange":
      return colors.orange;
    case "pink":
      return colors.pink;
    case "purple":
      return colors.purple;
    case "red":
      return colors.red;
    case "yellow":
      return colors.yellow;
    case "blue_background":
      return colors.blue_background;
    case "brown_background":
      return colors.brown_background;
    case "gray_background":
      return colors.gray_background;
    case "green_background":
      return colors.green_background;
    case "orange_background":
      return colors.orange_background;
    case "pink_background":
      return colors.pink_background;
    case "purple_background":
      return colors.purple_background;
    case "red_background":
      return colors.red_background;
    case "yellow_background":
      return colors.yellow_background;
    default:
      return null;
  }
};
