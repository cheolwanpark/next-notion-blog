import { createContext } from "react";

export const DarkModeContext = createContext<{
  isDarkMode: boolean | null;
  setMode: (darkMode: boolean) => void;
}>({
  isDarkMode: false,
  setMode: (darkMode: boolean) => {},
});
