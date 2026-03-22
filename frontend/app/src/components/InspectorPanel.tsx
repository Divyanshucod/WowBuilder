import type { BaseNode } from "../functions/AllClasses";
import { AssistantPanel } from "./AssistantPanel";
import { NodeInspector } from "./NodeInspector";
import { UploadSection } from "./UploadSection";

export const InspectorPanel = ({ setUploadedFile,selectedNode, setEdited }:{
    setUploadedFile: (data: any | null) => void,
    selectedNode: BaseNode | null
    setEdited : (data: boolean) => void
}) => {

    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-[#111827] border-l border-gray-200 dark:border-gray-800">

  {/* Upload */}
  <div className="border-gray-200 dark:border-gray-800 w-full">
    <UploadSection setUploadedFile={setUploadedFile} />
   
  </div>

  {/* Node Info */}
  <div className="flex-1 overflow-y-auto">
    <NodeInspector selectedNode={selectedNode} setEdited={setEdited} />
  </div>

  {/* Chat */}
  <div className="h-[40%] border-t border-gray-200 dark:border-gray-800">
    <AssistantPanel />
  </div>

</div>
    );
};