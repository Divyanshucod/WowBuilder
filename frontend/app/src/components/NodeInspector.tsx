import { useState } from "react";
import type { BaseNode } from "../functions/AllClasses";
import { APIModule } from "./UI/APIModule";
import { LuMaximize, LuMinimize } from "react-icons/lu";
export const NodeInspector = ({
  selectedNode,
  setEdited
}: {
  selectedNode: BaseNode | null;
  setEdited: (data:boolean) => void
}) => {
  const [minimize, setMinimize] = useState(true);
  return (
    <div className="p-4 border-b border-gray-700 flex-1 relative">
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
         {selectedNode.type == 'api' || selectedNode.type == 'document' || selectedNode.type == 'document' ?  <APIModule node={selectedNode} minimize={minimize} setMinimize={setMinimize} setEdited={setEdited}/> : <div></div>}
        </div>
      )}
    </div>
  );
};