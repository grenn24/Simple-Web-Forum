import Theme from "../styles/Theme";
import { createContext, useContext } from "react";

export const ThemeContext = createContext(Theme);
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;