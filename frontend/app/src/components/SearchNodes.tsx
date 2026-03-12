export const SearchNodes = () => {
    return (
        <div className="flex items-center min-w-full min-h-full">
            <input
                type="text"
                placeholder="Search nodes..."
                className="border border-gray-300 rounded-md p-2 flex-1"
            />
            <button className="ml-2 p-2 bg-blue-500 text-white rounded-md">Search</button>
        </div>
    );
};
