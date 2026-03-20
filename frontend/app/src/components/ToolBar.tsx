import { ExportButton } from "./ExportButton";
import { ThemeToggle } from "./ThemeToggle";
import { SearchNodes } from "./SearchNodes";

export const ToolBar = () => {
    return (
  <div className="h-14 px-4 flex items-center justify-between bg-white/80 dark:bg-[#0B1220]/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">

  {/* Left */}
  <div className="flex items-center gap-3">
    <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
      Workflow Builder
    </div>
  </div>

  {/* Center (Search) */}
  <div className="flex-1 max-w-md mx-6">
    <SearchNodes />
  </div>

  {/* Right */}
  <div className="flex items-center gap-2">
    <ExportButton />
    <ThemeToggle />
  </div>

</div>
    );
}