import { DownloadFlow } from "./DownloadFlow";
import { SearchNodes } from "./SearchNodes";

export const LeftTopSection = () => {
    return (
        <div className="min-w-full h-15 p-10">
            <div className="w-full h-full border border-gray-500 rounded-sm flex gap-2 p-5">
                <div className="min-w-[60%]">
                    <SearchNodes/>
                </div>
                <div className="min-w-[40%]">
                     <DownloadFlow/>
                </div>
            </div>
        </div>
    );
}