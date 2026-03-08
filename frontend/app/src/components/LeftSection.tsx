import { LeftBottomSection } from "./LeftBottomSection";
import { LeftTopSection } from "./LeftTopSection";

export const LeftSection = ({UploadFile}:{UploadFile: any | null}) => {
    // {console.log('Go call')}
    // {console.log('Left Section:'+UploadFile)}
    return (
        <div className="min-h-full min-w-[70%]">
            <LeftTopSection/>
            <LeftBottomSection UploadedFile={UploadFile}/>
        </div>
    );
}