
        import { FiDownload } from "react-icons/fi";
export const ExportButton = () => {
    return (

<button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
  <FiDownload size={14} />
  Export
</button>
    );
};
