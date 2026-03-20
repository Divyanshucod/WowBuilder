import { useTheme } from "./Hooks/ThemeToggler"
import { FiSun, FiMoon } from "react-icons/fi";
export const ThemeToggle = ()=>{
    const { theme, toggleTheme } = useTheme()
    return <button
  onClick={toggleTheme}
  className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
>
  {theme === "dark" ? <FiSun /> : <FiMoon />}
</button>
}



