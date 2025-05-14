import { createContext, useContext, type ReactNode } from "react";
import {
  semanticColors,
  type Mode,
  type SemanticColorSet,
} from "~/styles/colors";

type Theme = {
  mode: Mode;
  colors: SemanticColorSet;
};

const ThemeContext = createContext<Theme>({
  mode: "light",
  colors: semanticColors.light,
});

interface Props {
  children: ReactNode;
}

const ThemeProvider = ({ children }: Props) => {
  return (
    <ThemeContext.Provider
      value={{ mode: "light", colors: semanticColors.light }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeProvider;

export { useTheme };

export type { Theme };
