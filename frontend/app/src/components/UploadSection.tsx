export const UploadSection = ({
  setUploadedFile
}: {
  setUploadedFile: (data: any | null) => void;
}) => {

  const handleUpload = () => {
    const fileInput = document.createElement("input");

    fileInput.type = "file";
    fileInput.accept = ".json";

    fileInput.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      const text = await file.text();
      const json = JSON.parse(text);

      setUploadedFile(json);
    };

    fileInput.click();
  };

  return (
    <div className="p-4 flex flex-col gap-3 h-full">
      <div className="border-gray-200 dark:border-gray-800">
    <h2 className="text-sm font-semibold mb-2 bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-200">Upload the workflow</h2>

  </div>

    <button onClick={handleUpload} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      Upload JSON
    </button>
    </div>
  );
};