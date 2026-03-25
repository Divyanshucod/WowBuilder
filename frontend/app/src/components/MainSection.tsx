import { useEffect, useState } from "react";
import { CanvasLayout } from "./CanvasLayout";
import { InspectorPanel } from "./InspectorPanel";
import { BaseNode } from "../functions/AllClasses";

export const MainSection = () => {
    const [uploadedFile, setUploadedFile] = useState<any | null>(null);
    const [selectedNode,setSelectedNode] = useState<BaseNode | null>(null);
    const [edited,setEdited] = useState<boolean>(false)
    useEffect(() => {
        // if (uploadedFile) {
        //     console.log("JSON DATA:", uploadedFile);
        // }
    }, [uploadedFile]);

    return (
        <div className="h-screen w-full flex overflow-hidden bg-gray-50 dark:bg-[#0B1220]">
            <CanvasLayout UploadFile={uploadedFile} selectedNode={selectedNode} setSelectedNode={setSelectedNode} Edited={edited} setEdited={setEdited}/>
            <InspectorPanel setUploadedFile={setUploadedFile} selectedNode={selectedNode} setEdited={setEdited} Edited={edited}/>
        </div>
    );
}