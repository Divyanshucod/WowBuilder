import { ReactFlowProvider } from '@xyflow/react';
import { LeftBottomSection } from "./LeftBottomSection";
import { LeftTopSection } from "./LeftTopSection";

export const LeftSection = ({UploadFile}:{UploadFile: any | null}) => {
    return (
        <div className="min-h-full min-w-[70%]">
            <LeftTopSection/>
            <ReactFlowProvider>
                <LeftBottomSection UploadedFile={UploadFile}/>
            </ReactFlowProvider>
        </div>
    );
}