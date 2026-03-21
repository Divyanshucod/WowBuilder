import { ReactFlowProvider, type Edge, type Node } from '@xyflow/react';
import { WorkflowCanvas } from "./WorkflowCanvas";
import { ToolBar } from "./ToolBar";
import { useState } from 'react';

export const CanvasLayout = ({UploadFile}:{UploadFile: any | null}) => {
      const [initialEdges, setInitialEdges] = useState<Edge[]>([]);
      const [initialNodes, setInitialNodes] = useState<Node[]>([]);
      const [firstInstanceMap, setFirstInstanceMap] = useState<Map<string, string>>(new Map());
      const [isSearchOpen,setIsSearchOpen] = useState<boolean>(false);
      console.log('CanvasLayout: isSearchOpen=', isSearchOpen);
    return (
        <div className="flex-3 flex flex-col border-r border-gray-200 dark:border-gray-800">
               <ReactFlowProvider>
                 <ToolBar firstInstanceMap={firstInstanceMap} initialNodes={initialNodes} setInitialNodes={setInitialNodes} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
                <div className='flex-1'>
                <WorkflowCanvas UploadedFile={UploadFile} initialEdges={initialEdges} setInitialEdges={setInitialEdges} initialNodes={initialNodes} setInitialNodes={setInitialNodes} firstInstanceMap={firstInstanceMap} setFirstInstanceMap={setFirstInstanceMap} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen}/>
                </div>
            </ReactFlowProvider>
        </div>
    );
}