import { useEffect, useState } from "react";
import type { BaseNode } from "../../functions/AllClasses";
import type { formButton, formCheckBox, formDate, formDividerType, formDropDown, formFileUpload, formInputBoxType, formLabelType, formLoaderType } from "./types";
import { LuMaximize, LuMinimize } from "react-icons/lu";
import { Input } from "./Input";
import { RenderComponent} from "./FormRender";

type FormComponent = formButton | formCheckBox | formDate | formDropDown | formLabelType | formLoaderType | formDividerType | formInputBoxType | formFileUpload;
type ComponentsState = {
    componentIds: string[];
    componentMap: Record<string, FormComponent>;
};
export type formNodeConfigType = {
    id: string,
    nextStep: string,
    previousStep?: string,
    components: ComponentsState,
    footerComponent: ComponentsState
}
const formNodeConfigData = {
    id: "",
    nextStep: "",
    previousStep: "",
    components: {
        componentIds: [],
        componentMap: {}
    },
    footerComponent: {
        componentIds: [],
        componentMap: {}
    }
}
export const FormModule = ({ node, setMinimize, minimize, setEdited, edited }: { node: BaseNode, setMinimize: (minimize: boolean) => void, minimize: boolean, setEdited: (data: boolean) => void, edited: boolean }) => {
    const [formNodeConfig, setFormNodeConfig] = useState<formNodeConfigType>(formNodeConfigData)
    const [initialFormNodeConfig, setInitialFormNodeConfig] = useState<formNodeConfigType>(formNodeConfigData)
    const [isEdited, setIsEdited] = useState(false);
    const getSection = ( section: string) => {
    return section === "component" ? "components" : "footerComponent";
    };
    const updateComponentFields = ({
    componentId,
    section,
    type,
    key,
    subKey,
    value,
    index
}: any) => {
    setFormNodeConfig(prev => {
        const sectionKey = getSection(section);
        const components = prev[sectionKey];
        const component = components.componentMap[componentId];
        if (!component) return prev;

        let updatedComponent = { ...component };

        // 🔹 Nested Objects (onChange / onValidated / onClick)
        if ((key === "onChange" || key === "onValidated" || key === "onClick")) {
            if (subKey === "nextStep") {
                updatedComponent[key] = {
                    ...component[key],
                    nextStep: value
                };
            }

            else if (subKey === "reloadComponents") {
                const arr = [...(component[key]?.reloadComponents || [])];
                arr[index] = value;

                updatedComponent[key] = {
                    ...component[key],
                    reloadComponents: arr
                };
            }
        }

        else if (key === "validation") {
            const arr = [...(component.validation || [])];
            arr[index] = {
                ...arr[index],
                [subKey]: value
            };
            updatedComponent.validation = arr;
        }

        else if (type === "dropdown" && key === "items") {
            const items = [...component.items];
            const oldKey = items[index];

            items[index] = value;

            const labels = { ...component.labels };
            labels[value] = labels[oldKey] || "";
            delete labels[oldKey];

            updatedComponent.items = items;
            updatedComponent.labels = labels;
        }

        // SupportFiles update
        else if (type === "file" && key === "supportedFiles") {
            const arr = [...component.supportedFiles];
            arr[index] = {
                ...arr[index],
                [subKey]: value
            };
            updatedComponent.supportedFiles = arr;
        }
       // file extension update
        else if (type === "file" && key === "extensions") {
            const arr = [...component.supportedFiles];
            const extArr = [...arr[index].extensions];
            extArr[subKey] = value;
            arr[index].extensions = extArr;
            updatedComponent.supportedFiles = arr;
        }

        // Date Range update
        else if (type === "date" && key === "dateRange") {
            updatedComponent.dateRange = {
                ...component.dateRange,
                [subKey]: value
            };
        }

        // 🔹 Default
        else {
            updatedComponent[key] = value;
        }

        return {
            ...prev,
            [sectionKey]: {
                ...components,
                componentMap: {
                    ...components.componentMap,
                    [componentId]: updatedComponent
                }
            }
        };
    });
};
    const addMoreFields = ({ componentId, section, type, key, subKey }: any) => {
    setFormNodeConfig(prev => {
        const sectionKey = getSection(section);
        const components = prev[sectionKey];
        const component = components.componentMap[componentId];
        if (!component) return prev;

        let updatedComponent = { ...component };

        // 🔹 Validation
        if (key === "validation") {
            updatedComponent.validation = [
                ...(component.validation || []),
                { type: "regex", value: "", errorMsg: "" }
            ];
        }

        // 🔹 reloadComponents
        else if (subKey === "reloadComponents") {
            updatedComponent[key] = {
                ...component[key],
                reloadComponents: [
                    ...(component[key]?.reloadComponents || []),
                    ""
                ]
            };
        }

        // 🔹 Dropdown items
        else if (type === "dropdown" && key === "items") {
            const newVal = `item_${Date.now()}`;

            updatedComponent.items = [...component.items, newVal];
            updatedComponent.labels = {
                ...component.labels,
                [newVal]: ""
            };
        }

        // 🔹 File supportedFiles
        else if (type === "file" && key === "supportedFiles") {
            updatedComponent.supportedFiles = [
                ...(component.supportedFiles || []),
                {
                    type: "documents",
                    title: "",
                    extensions: [""]
                }
            ];
        }

        // 🔹 Extensions
        else if (type === "file" && key === "extensions") {
            const arr = [...component.supportedFiles];
            arr[subKey].extensions.push("");
            updatedComponent.supportedFiles = arr;
        }

        return {
            ...prev,
            [sectionKey]: {
                ...components,
                componentMap: {
                    ...components.componentMap,
                    [componentId]: updatedComponent
                }
            }
        };
    });
};

    const handleRemove = ({ componentId, section, type, key, subKey, index }: any) => {
    setFormNodeConfig(prev => {
        const sectionKey = getSection(section);
        const components = prev[sectionKey];
        const component = components.componentMap[componentId];
        if (!component) return prev;

        let updatedComponent = { ...component };

        // 🔹 Validation
        if (key === "validation") {
            updatedComponent.validation = component.validation.filter((_: any, i: number) => i !== index);
        }

        // 🔹 Dropdown items
        else if (key === "items") {
            const items = [...component.items];
            const labels = { ...component.labels };

            const removed = items[index];
            items.splice(index, 1);
            delete labels[removed];

            updatedComponent.items = items;
            updatedComponent.labels = labels;
        }

        // 🔹 reloadComponents
        else if (subKey === "reloadComponents") {
            updatedComponent[key] = {
                ...component[key],
                reloadComponents: component[key].reloadComponents.filter((_: any, i: number) => i !== index)
            };
        }

        // 🔹 supportedFiles
        else if (key === "supportedFiles") {
            updatedComponent.supportedFiles = component.supportedFiles.filter((_: any, i: number) => i !== index);
        }

        // 🔹 extensions
        else if (key === "extensions") {
            const arr = [...component.supportedFiles];
            arr[subKey].extensions = arr[subKey].extensions.filter((_: any, i: number) => i !== index);
            updatedComponent.supportedFiles = arr;
        }

        return {
            ...prev,
            [sectionKey]: {
                ...components,
                componentMap: {
                    ...components.componentMap,
                    [componentId]: updatedComponent
                }
            }
        };
    });
};
    useEffect(() => {
        // Create a proper structure to store node details
        const nodeDetails = {
            id: node.id,
            nextStep: node.reference.nextStep,
            previousStep: node.reference?.previousStep || "",
            components: {
                componentIds: [] as string[],
                componentMap: {}
            },
            footerComponent: {
                componentIds: [] as string[],
                componentMap: {}
            }
        };
        // Components values set
        const componentData = {} as Record<string, any>;
        const componentIds: string[] = [];
        node.reference?.properties.sections[0].components.forEach((component: any) => {
            const objectId = crypto.randomUUID();
            componentData[objectId] = component;
            componentIds.push(objectId);
        });
        nodeDetails.components.componentMap = componentData;
        nodeDetails.components.componentIds = componentIds;
        // Footer components values set
        const footerComponentData = {} as Record<string, any>;
        const footerComponentIds: string[] = [];
        node.reference?.properties.sections[0].footer?.components.forEach((component: any) => {
            const objectId = crypto.randomUUID();
            footerComponentData[objectId] = component;
            footerComponentIds.push(objectId);
        })
        nodeDetails.footerComponent.componentMap = footerComponentData;
        nodeDetails.footerComponent.componentIds = footerComponentIds

        
        setInitialFormNodeConfig(nodeDetails);
        setFormNodeConfig(nodeDetails);


        
    }, [node])
    console.log('outsider useEffect' + JSON.stringify(formNodeConfig));
    
    useEffect(() => {
        if (JSON.stringify(formNodeConfig) !== JSON.stringify(initialFormNodeConfig)) {
            setIsEdited(true);
        } else {
            setIsEdited(false);
        }
    }, [formNodeConfig])

    const SaveChanges = () => {
        // Handling updates here
    }
    return (<>
        {minimize ? <div className="space-y-3">
            <Input value={formNodeConfig.id} onChange={(e) => setFormNodeConfig(prev => ({ ...prev, id: e.target.value }))} />
            <Input value={formNodeConfig.nextStep} onChange={(e) => setFormNodeConfig(prev => ({ ...prev, nextStep: e.target.value }))} />
            <Input value={formNodeConfig.previousStep} onChange={(e) => setFormNodeConfig(prev => ({ ...prev, previousStep: e.target.value }))} />
            {/* rendering components */}
            {formNodeConfig.components.componentIds.map((id) => (
                      <RenderComponent id={id} formNodeConfig={formNodeConfig} updateComponentFields={updateComponentFields} addMoreFields={addMoreFields} handleRemove={handleRemove} />
                ))}
            <div className="w-full flex justify-between p-1 gap-2">
            <button onClick={SaveChanges} disabled={!isEdited} className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${!isEdited ? 'hover:cursor-not-allowed':'hover:cursor-pointer' }`}>Save</button>
            </div>
        </div> : <>
            <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:scale-110 transition" onClick={() => setMinimize(prev => !prev)}> {minimize ? <LuMaximize /> : <LuMinimize />} </button>
        </>}
    </>
    )

}