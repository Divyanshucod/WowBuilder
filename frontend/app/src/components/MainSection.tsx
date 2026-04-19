import { useEffect, useState } from "react";
import { CanvasLayout } from "./CanvasLayout";
import { InspectorPanel } from "./InspectorPanel";
import { BaseNode } from "../functions/AllClasses";
import { isWorkflowLoaded } from "../functions/HelperFunctions";
import { AutoSaveProvider } from "./AutoSaveContext";
const DEFAULT_WIDTH = 340;
const MIN_WIDTH = 300;
const MAX_WIDTH = 480;
export const MainSection = () => {
    const [uploadedFile, setUploadedFile] = useState<any | null>(null);
    const [selectedNode,setSelectedNode] = useState<BaseNode | null>(null);
    const [edited,setEdited] = useState<boolean>(false)
    const [InspectorPanelWidth,setInspectorPanelWidth] = useState<number>(DEFAULT_WIDTH);
    const [isDragging,setIsDragging] = useState<boolean>(false);
    const [isWorkflowUpload,setIsWorkflowUpload] = useState(() => isWorkflowLoaded())
    useEffect(() => {
    const handleMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const newWidth = window.innerWidth - e.clientX;

        const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
        setInspectorPanelWidth(clamped);
    };

    const handleUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = "auto"; 
    };

    if (isDragging) {
        document.body.style.userSelect = "none"; 
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
    }

    return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
    };
}, [isDragging]);

    return (
        <div className="h-screen w-full flex overflow-hidden bg-gray-50 dark:bg-[#0B1220]">
            <AutoSaveProvider>
            <CanvasLayout UploadFile={uploadedFile} selectedNode={selectedNode} setSelectedNode={setSelectedNode} Edited={edited} setEdited={setEdited} isWorkflowUpload={isWorkflowUpload}/>
            <InspectorPanel setUploadedFile={setUploadedFile} selectedNode={selectedNode} setEdited={setEdited} Edited={edited} InspectorPanelWidth={InspectorPanelWidth} setIsDragging={setIsDragging} isDragging={isDragging} setEnableUpload={setIsWorkflowUpload} enableUpload={isWorkflowUpload}/>
            </AutoSaveProvider>
        </div>
    );
}