import { useState } from "react";
import type { BaseNode } from "../functions/AllClasses";
import { APIModule } from "./UI/APIModule";
import { LuMaximize, LuMinimize } from "react-icons/lu";
export const NodeInspector = ({
  selectedNode,
  setEdited,
  Edited
}: {
  selectedNode: BaseNode | null;
  setEdited: (data:boolean) => void
  Edited:boolean
}) => {
  const [minimize, setMinimize] = useState(true);
  return (
    <div className="h-full flex flex-col gap-4 p-4 
bg-white dark:bg-[#0f172a] 
text-gray-800 dark:text-gray-200 
transition-colors duration-200">
      <button
        className="absolute top-4 right-4 text-gray-400"
        onClick={() => setMinimize(!minimize)}
      >
        {minimize ? <LuMaximize /> : <LuMinimize />}
      </button>

      <h3 className="text-sm font-semibold mb-3 text-[#0F172A] dark:text-[#E5E7EB]">
        Node Details
      </h3>

      {!selectedNode ? (
        <p className="text-sm text-[#0F172A] dark:text-[#E5E7EB]">
          Click a node to see details
        </p>
      ) : (
        <div className="space-y-2 text-sm overflow-y-auto">
         {selectedNode.type == 'api' || selectedNode.type == 'document' || selectedNode.type == 'document' ?  <APIModule node={selectedNode} minimize={minimize} setMinimize={setMinimize} setEdited={setEdited} edited={Edited} /> : <div></div>}
        </div>
      )}
    </div>
  );
};