import { useContext } from "react";
import { ThemeContext } from "../Contexts";

export function useTheme(){
    return useContext(ThemeContext);
}