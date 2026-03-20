import { AssistantPanel } from "./AssistantPanel";
import { NodeInspector } from "./NodeInspector";
import { UploadSection } from "./UploadSection";

export const InspectorPanel = ({ setUploadedFile }:{
    setUploadedFile: (data: any | null) => void
}) => {

    const handleUpload = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';

        fileInput.onchange = async (event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];

            if (!file) return;

            const text = await file.text();   // read file
            const json = JSON.parse(text);    // parse JSON

            setUploadedFile(json);            // send JSON
        };

        fileInput.click();
    };

    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-[#111827] border-l border-gray-200 dark:border-gray-800">

  {/* Upload */}
  <div className="border-gray-200 dark:border-gray-800 w-full">
    <UploadSection setUploadedFile={setUploadedFile} />
   
  </div>

  {/* Node Info */}
  <div className="flex-1 overflow-y-auto">
    <NodeInspector selectedNode={null} />
  </div>

  {/* Chat */}
  <div className="h-[40%] border-t border-gray-200 dark:border-gray-800">
    <AssistantPanel />
  </div>

</div>
    );
};