import {FiSearch} from 'react-icons/fi'

export const SearchNodes = () => {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">

      <FiSearch className="text-gray-400 mr-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md" />

      <input
        type="text"
        placeholder="Search nodes..."
        className="bg-transparent outline-none text-sm flex-1 text-gray-700 dark:text-gray-200 placeholder-gray-400"
      />
    </div>
  );
};
