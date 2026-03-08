export const RightSection = ({ setUploadedFile }:{
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
        <div className="min-w-[30%] min-h-full">
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};