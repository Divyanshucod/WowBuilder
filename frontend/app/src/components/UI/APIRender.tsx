import { FaPlus, FaWindowClose } from "react-icons/fa";
import type { baseConfig, NodeConfigType } from "./APIModule";

export const APIRender = (title: string, type: keyof typeof baseConfig, addRow: (type: keyof typeof baseConfig) => void, updateRow: (type: keyof typeof baseConfig, id: string, key: string, value: string) => void, removeRow: (type: keyof typeof baseConfig, id: string) => void, nodeConfig: NodeConfigType) => {
    const list: any[] = nodeConfig[type] as any[];

    return (
        <div className="bg-gray-50 dark:bg-[#020617] border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3">
            <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {title}
                </p>

                <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    <FaPlus className="text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            {list.map((item) => (
                <div key={item.id} className="flex gap-2 items-center">
                    <input
                        value={item.name}
                        placeholder="Key"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => updateRow(type, item.id, "name", e.target.value)}
                    />

                    {"value" in item && (
                        <input
                            value={item.value}
                            placeholder="Value"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => updateRow(type, item.id, "value", e.target.value)}
                        />
                    )}

                    {"type" in item && (
                        <input
                            value={item.type}
                            placeholder="Type"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => updateRow(type, item.id, "type", e.target.value)}
                        />
                    )}

                    {"path" in item && (
                        <input
                            value={item.path}
                            placeholder="Path"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => updateRow(type, item.id, "path", e.target.value)}
                        />
                    )}

                    <FaWindowClose className="cursor-pointer text-gray-400 hover:text-red-500 transition" />
                </div>
            ))}
        </div>
    );
};