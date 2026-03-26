import { FaPlus, FaWindowClose } from "react-icons/fa";
import type { baseConfig, NodeConfigType } from "./APIModule";
import { Input } from "./Input";

export const APIRender = (title: string, type: keyof typeof baseConfig, addRow: (type: keyof typeof baseConfig) => void, updateRow: (type: keyof typeof baseConfig, id: string, key: string, value: string) => void, removeRow: (type: keyof typeof baseConfig, id: string) => void, nodeConfig: NodeConfigType) => {
    const list: any[] = nodeConfig[type] as any[];

    return (
        <div className="bg-gray-50 dark:bg-[#020617] border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3">
            <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {title}
                </p>

                <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    <FaPlus className="text-gray-600 dark:text-gray-300" onClick={() => addRow(type)} />
                </button>
            </div>

            {list.map((item) => (

                <div key={item.id} className="flex gap-2 items-center">
                    <Input value={item.id} onChange={(value) => updateRow(type, item.id, "id", value)} placeholder="Key" />
                    <Input value={item.name} onChange={(value) => updateRow(type, item.id, "name", value)} placeholder="Name" />

                    {"value" in item && (
                        <Input value={item.value} onChange={(value) => updateRow(type, item.id, "value", value)} placeholder="Value" />
                    )}

                    {"type" in item && (
                        <Input value={item.type} onChange={(value) => updateRow(type, item.id, "type", value)} placeholder="Type" />
                    )}

                    {"path" in item && (
                        <Input value={item.path} onChange={(value) => updateRow(type, item.id, "path", value)} placeholder="Path" />
                    )}

                    <FaWindowClose className="cursor-pointer text-gray-400 hover:text-red-500 transition p-2" />
                </div>
            ))}
        </div>
    );
};