import { createContext} from "react";
export type themeColor = 'light'|'dark'
export interface themeContextType {
    theme: themeColor;
    toggleTheme: () => void;
}
export const ThemeContext = createContext<themeContextType>({
    theme: 'light',
    toggleTheme: () => {}
})