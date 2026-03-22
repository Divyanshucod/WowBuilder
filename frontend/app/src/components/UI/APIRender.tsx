import { FaPlus, FaWindowClose } from "react-icons/fa";
import type { baseConfig, NodeConfigType } from "./APIModule";

export const APIRender = (title: string, type: keyof typeof baseConfig, addRow:(type:keyof typeof baseConfig)=>void, updateRow:(type: keyof typeof baseConfig, id: string, key: string, value: string)=>void, removeRow:(type: keyof typeof baseConfig, id: string)=>void, nodeConfig:NodeConfigType) => {
    const list: any[] = nodeConfig[type] as any[];

        return (
            <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded space-y-2">
                <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold">{title}</p>
                    <FaPlus className="cursor-pointer" onClick={() => addRow(type)} />
                </div>

                {list.map((item) => (
                    <div key={item.id} className="flex gap-2 items-center">
                        <input
                            value={item.name}
                            placeholder="Key"
                            className="flex-1 p-1 rounded border dark:bg-gray-800"
                            onChange={(e) => updateRow(type, item.id, "name", e.target.value)}
                        />

                        {"value" in item && (
                            <input
                                value={item.value}
                                placeholder="Value"
                                className="flex-1 p-1 rounded border dark:bg-gray-800"
                                onChange={(e) => updateRow(type, item.id, "value", e.target.value)}
                            />
                        )}

                        {"type" in item && (
                            <input
                                value={item.type}
                                placeholder="Type"
                                className="w-20 p-1 rounded border dark:bg-gray-800"
                                onChange={(e) => updateRow(type, item.id, "type", e.target.value)}
                            />
                        )}

                        {"path" in item && (
                            <input
                                value={item.path}
                                placeholder="Path"
                                className="flex-1 p-1 rounded border dark:bg-gray-800"
                                onChange={(e) => updateRow(type, item.id, "path", e.target.value)}
                            />
                        )}

                        <FaWindowClose className="cursor-pointer" onClick={() => removeRow(type, item.id)} />
                    </div>
                ))}
            </div>
        );
    };