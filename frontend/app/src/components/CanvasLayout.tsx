import { ReactFlowProvider, type Edge, type Node } from '@xyflow/react';
import { WorkflowCanvas } from "./WorkflowCanvas";
import { ToolBar } from "./ToolBar";
import { useState } from 'react';
import type { BaseNode } from '../functions/AllClasses';

export const CanvasLayout = ({UploadFile, selectedNode, setSelectedNode, Edited, setEdited, isWorkflowUpload}:{UploadFile: any | null, selectedNode: BaseNode | null, setSelectedNode: (node: BaseNode | null) => void, Edited: boolean, setEdited: (data: boolean) => void, isWorkflowUpload: boolean}) => {
      const [initialEdges, setInitialEdges] = useState<Edge[]>([]);
      const [initialNodes, setInitialNodes] = useState<Node[]>([]);
      const [firstInstanceMap, setFirstInstanceMap] = useState<Map<string, string>>(new Map());
      const [isSearchOpen,setIsSearchOpen] = useState<boolean>(false);
    return (
        <div className="flex-3 flex flex-col border-r border-gray-200 dark:border-gray-800">
               <ReactFlowProvider>
                 <ToolBar firstInstanceMap={firstInstanceMap} initialNodes={initialNodes} setInitialNodes={setInitialNodes} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
                <div className='flex-1'>
                <WorkflowCanvas UploadedFile={UploadFile} initialEdges={initialEdges} setInitialEdges={setInitialEdges} initialNodes={initialNodes} setInitialNodes={setInitialNodes} firstInstanceMap={firstInstanceMap} setFirstInstanceMap={setFirstInstanceMap} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} setSelectedNode={setSelectedNode} Edited={Edited} setEdited={setEdited} isWorkflowUpload={isWorkflowUpload}/>
                </div>
            </ReactFlowProvider>
        </div>
    );
}