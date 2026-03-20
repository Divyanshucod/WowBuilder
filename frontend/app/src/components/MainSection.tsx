import { useEffect, useState } from "react";
import { CanvasLayout } from "./CanvasLayout";
import { InspectorPanel } from "./InspectorPanel";

export const MainSection = () => {
    const [uploadedFile, setUploadedFile] = useState<any | null>(null);

    useEffect(() => {
        // if (uploadedFile) {
        //     console.log("JSON DATA:", uploadedFile);
        // }
    }, [uploadedFile]);

    return (
        <div className="h-screen w-full flex overflow-hidden bg-gray-50 dark:bg-[#0B1220]">
            <CanvasLayout UploadFile={uploadedFile} />
            <InspectorPanel setUploadedFile={setUploadedFile} />
        </div>
    );
}