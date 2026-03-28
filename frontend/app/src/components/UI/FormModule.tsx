import { useEffect, useState } from "react";
import type { BaseNode } from "../../functions/AllClasses";
import type { formButton, formCheckBox, formDate, formDividerType, formDropDown, formInputBoxType, formLabelType, formLoaderType } from "./types";

type FormComponent= formButton | formCheckBox | formDate | formDropDown | formLabelType | formLoaderType | formDividerType | formInputBoxType;
type ComponentsState = {
  componentIds: string[];
  componentMap: Record<string, FormComponent>;
};
type formNodeConfigType = {
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

    const updateComponentFields = ({ componentId, key, type, value }: { componentId: string, key: string, type: string, value: string }) => {
        setFormNodeConfig(prev => {
            if (type == 'component') {
                return { ...prev, components: { ...prev.components, componentIds: { ...prev.components.componentIds, [componentId]: { ...prev.components.componentIds[componentId], [key]: value } } } };
            }
            if (type == 'footer') {
                return { ...prev, components: { ...prev.components, componentIds: { ...prev.components.componentIds, [componentId]: { ...prev.components.componentIds[componentId], [key]: value } } } };
            }
            else return;

            // this is not handling all the changes there can be cases like (validation, onChange, onValidated they need separate handler)
        })
        // Update the list of components or any other state
    };
    const addMoreFields = ({ componentId, key, section, subKey }: { componentId: string, key: string, section: string, subKey?: string }) => {
        // Can't add new components directly as we need to add that features to so based based on what user wants to add they can select from menu
        setFormNodeConfig(prev => {
            const sectionKey = section === "component" ? "components" : "footerComponent";

            const component = prev[sectionKey].componentIds[componentId];

            if (!component) return prev;

            if (key === "validation") {
                return {
                    ...prev,
                    [sectionKey]: {
                        ...prev[sectionKey],
                        componentIds: {
                            ...prev[sectionKey].componentIds,
                            [componentId]: {
                                ...component,
                                [key]: [
                                    ...(component[key] || []),
                                    { type: "", value: "", errorMsg: "" }
                                ]
                            }
                        }
                    }
                };
            }
            if (key === "items") {
                const currentItems = component.items || [];
                const currentLabels = component.labels || {};

                const newValue = `item_${Date.now()}`; // or however you generate

                return {
                    ...prev,
                    [sectionKey]: {
                        ...prev[sectionKey],
                        componentIds: {
                            ...prev[sectionKey].componentIds,
                            [componentId]: {
                                ...component,
                                items: [...currentItems, newValue],
                                labels: {
                                    ...currentLabels,
                                    [newValue]: ""
                                }
                            }
                        }
                    }
                };
            }
            if (key == "onChange" || key == "onValidated") {
                return {
                    ...prev,
                    [sectionKey]: {
                        ...prev[sectionKey],
                        componentIds: {
                            ...prev[sectionKey].componentIds,
                            [componentId]: {
                                ...component,
                                [key]: {
                                    ...(component[key] || {}),
                                    [subKey]: [
                                        ...(component[key]?.[subKey] || []),
                                        ""
                                    ]
                                }
                            }
                        }
                    }
                };
            }

            return prev;
        });
    };

    const handleUpdate = () => {
        // Handling updates here
    }

    const handleRemove = ({ componentId, key, section, subKey, index }: { componentId: string, key: string, section: string, subKey?: string, index: number }) => {
        // Handling removal of fields/row
        // Can't remove whole component directly
        setFormNodeConfig((prev) => {
            const sectionKey = section;
            const component = prev[sectionKey]?.componentIds[componentId];
            if (!component) return prev;

            if (key === "validation") {
                return {
                    ...prev,
                    [sectionKey]: {
                        ...prev[sectionKey],
                        componentIds: {
                            ...prev[sectionKey].componentIds,
                            [componentId]: {
                                ...component,
                                [key]: component[key]?.filter((_: any, i: number) => i !== index) || []
                            }
                        }
                    }
                };
            }
            if (key === "items") {
                const currentItems = component.items || [];
                const currentLabels = component.labels || {};

                const labelKey = currentItems[index];

                const newItems = currentItems.filter((_, i) => i !== index);

                const newLabels = { ...currentLabels };
                delete newLabels[labelKey];

                return {
                    ...prev,
                    [sectionKey]: {
                        ...prev[sectionKey],
                        componentIds: {
                            ...prev[sectionKey].componentIds,
                            [componentId]: {
                                ...component,
                                items: newItems,
                                labels: newLabels
                            }
                        }
                    }
                };
            }
            if (key == "onChange" || key == "onValidated") {
                const values = component[key]?.[subKey] || [];
                const newItems = values.filter((_, i) => i !== index);
                return {
                    ...prev,
                    [sectionKey]: {
                        ...prev[sectionKey],
                        componentIds: {
                            ...prev[sectionKey].componentIds,
                            [componentId]: {
                                ...component,
                                [key]: {
                                    ...(component[key] || {}),
                                    [subKey]: newItems
                                }
                            }
                        }
                    }
                };
            }

            return prev;
        });

    };
    useEffect(() => {
        // Create a proper structure to store node details
        const nodeDetails = {
            id: node.id,
            nextStep: node.reference.nextStep,
            previousStep: node.reference?.previousStep || "",
            components: {
                componentIds: [],
                componentMap: {}
            },
            footerComponent: {
                componentIds: [],
                componentMap: {}
            }
        };
        // Components values set
        const componentData = {};
        const componentIds = [];
        node.reference?.properties.sections[0].components.forEach((component) => {
            const objectId = crypto.randomUUID();
            const properObject = {}
            Object.keys(component).forEach(([key, val]) => {
                properObject[key] = val;
            })
            componentData[objectId] = properObject;
            componentIds.push(objectId);
        });
        componentData["componentIds"] = componentIds;
        nodeDetails.components = componentData;
        // Footer components values set
        const footerComponentData = {};
        const footerComponentIds = [];
        node.reference?.properties.sections[0].footer?.components.forEach((component) => {
            const objectId = crypto.randomUUID();
            const properObject = {}
            Object.keys(component).forEach(([key, val]) => {
                properObject[key] = val;
            })
            footerComponentData[objectId] = properObject;
            footerComponentIds.push(objectId);
        })
        footerComponentData["componentIds"] = footerComponentIds;
        nodeDetails.footerComponent = footerComponentData;

        setInitialFormNodeConfig(nodeDetails);
        setFormNodeConfig(nodeDetails);
    }, [node])

    useEffect(() => {
        if (JSON.stringify(formNodeConfig) !== JSON.stringify(initialFormNodeConfig)) {
            setIsEdited(true);
        } else {
            setIsEdited(false);
        }
    }, [formNodeConfig])
    return (
        <div>
            <h2>Form Module</h2>
            <p>Node ID: {node.id}</p>
            <button onClick={() => setMinimize(!minimize)}>{minimize ? 'Expand' : 'Minimize'}</button>
            <button onClick={() => setEdited(!edited)}>{edited ? 'Cancel' : 'Edit'}</button>
        </div>
    );
}