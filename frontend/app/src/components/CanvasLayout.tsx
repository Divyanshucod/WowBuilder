import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowCanvas } from "./WorkflowCanvas";
import { ToolBar } from "./ToolBar";

export const CanvasLayout = ({UploadFile}:{UploadFile: any | null}) => {
    return (
        <div className="flex-3 flex flex-col border-r border-gray-200 dark:border-gray-800">
            <ToolBar/>
            <ReactFlowProvider>
                <div className='flex-1'>
                <WorkflowCanvas UploadedFile={UploadFile}/>
                </div>
            </ReactFlowProvider>
        </div>
    );
}