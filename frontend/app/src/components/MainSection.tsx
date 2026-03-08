import { useEffect, useState } from "react";
import { LeftSection } from "./LeftSection";
import { RightSection } from "./RightSection";

export const MainSection = () => {
    const [uploadedFile, setUploadedFile] = useState<any | null>(null);

    useEffect(() => {
        // if (uploadedFile) {
        //     console.log("JSON DATA:", uploadedFile);
        // }
    }, [uploadedFile]);

    return (
        <div className="min-h-screen min-w-screen p-5 flex">
            <LeftSection UploadFile={uploadedFile}/>
            <RightSection setUploadedFile={setUploadedFile}/>
        </div>
    );  
}