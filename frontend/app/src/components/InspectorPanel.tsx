import type { BaseNode } from "../functions/AllClasses";
import { AssistantPanel } from "./AssistantPanel";
import { NodeInspector } from "./NodeInspector";
import { UploadSection } from "./UploadSection";

export const InspectorPanel = ({ setUploadedFile,enableUpload,setEnableUpload,selectedNode, setEdited, Edited, InspectorPanelWidth, setIsDragging, isDragging }:{
    setUploadedFile: (data: any | null) => void,
    selectedNode: BaseNode | null
    setEdited : (data: boolean) => void
    Edited: boolean
    InspectorPanelWidth: number,
    setIsDragging: (isDragging: boolean) => void,
    isDragging: boolean
    enableUpload: boolean
    setEnableUpload: (val: boolean) => void
}) => {

    return (
        <>
        <div
  className={`w-1 cursor-col-resize transition-colors ${
    isDragging ? "bg-blue-500" : "bg-gray-300 hover:bg-gray-400"
  }`}
  onMouseDown={() => setIsDragging(true)}
/>
        <div className="flex flex-col bg-white dark:bg-[#111827] border-l border-gray-200 dark:border-gray-800" style={{ width: InspectorPanelWidth }}>

  {/* Upload */}
  <div className="border-gray-200 dark:border-gray-800 w-full">
    <UploadSection setUploadedFile={setUploadedFile} enableUpload={enableUpload} setEnableUpload={setEnableUpload} />
   
  </div>

  {/* Node Info */}
  <div className="flex-1 overflow-y-auto">
    <NodeInspector selectedNode={selectedNode} setEdited={setEdited} Edited={Edited} />
  </div>

  {/* Chat */}
  <div className="h-[40%] border-t border-gray-200 dark:border-gray-800">
    <AssistantPanel />
  </div>

</div>
</>
    );
};