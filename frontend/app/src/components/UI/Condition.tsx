import { LuMaximize, LuMinimize } from "react-icons/lu";
import type { BaseNode } from "../../functions/AllClasses";
import { useEffect, useState } from "react";
import { registerNodes } from "../../functions/CreateNodes";
import { Input } from "./Input";


type conditionConfigType = {
    if_true: string,
    if_false: string,
    rule: string,
    id: string
}
const conditionConfigData: conditionConfigType = {
    id: "" as string,
    if_true: "" as string,
    if_false: "" as string,
    rule: "" as string
}
export const Condition = ({ node, setMinimize, minimize, setEdited, edited }: { node: BaseNode, setMinimize: (minimize: boolean) => void, minimize: boolean, setEdited: (data: boolean) => void, edited: boolean }) => {
    const [conditionConfig, setConditionConfig] = useState<conditionConfigType>(conditionConfigData)
    const [initialConditionConfig, setInitialConditionConfig] = useState<conditionConfigType>(conditionConfigData)
    const [isEdited, setIsEdited] = useState<boolean>(false)
    const updateCondition = (type: keyof typeof conditionConfigData, value: string) => {
        setConditionConfig(prev => ({ ...prev, [type]: value }))
    }
    function SaveChanges() {
        // Update the node object so that main object also would get updated
        // created a shallow copy
        const conditionCopy = structuredClone(node);
        let somethingUpdated = false;
        if (conditionConfig.if_false !== node.if_falseId) {
            conditionCopy.if_falseId = conditionConfig.if_false;
            conditionCopy.reference.if_false = conditionConfig.if_false;
            somethingUpdated = true;
        }

        if (conditionConfig.if_true !== node.if_trueId) {
            conditionCopy.if_trueId = conditionConfig.if_true;
            conditionCopy.reference.if_true = conditionConfig.if_true;
            somethingUpdated = true;
        }

        if (conditionConfig.rule !== node.rule) {
            conditionCopy.rule = conditionConfig.rule;
            conditionCopy.reference.rule = conditionConfig.rule
            somethingUpdated = true;
        }

        if (conditionConfig.id !== node.id) {
            conditionCopy.id = conditionConfig.id;
            conditionCopy.reference.id = conditionConfig.id;
            registerNodes.delete(node.id)
            somethingUpdated = true;
        }

        if (somethingUpdated) {
            registerNodes.set(node.id, conditionCopy);

            setEdited(!edited)
        }
    }
    useEffect(() => {
        setInitialConditionConfig(conditionConfigData)
        setConditionConfig(conditionConfigData)
        setConditionConfig({
            if_false: node.if_falseId,
            if_true: node.if_trueId,
            rule: node.rule,
            id: node.id
        })
         setInitialConditionConfig({
            if_false: node.if_falseId,
            if_true: node.if_trueId,
            rule: node.rule,
            id: node.id
        })
    }, [node])

    useEffect(() => {
        if (JSON.stringify(initialConditionConfig) != JSON.stringify(conditionConfig)) {
            setIsEdited(prev => !prev);
        }else{
            setIsEdited(prev => !prev);
        }
    }, [conditionConfig])
    return <>{minimize ? <div className="space-y-3">
           <div className="bg-gray-50 dark:bg-[#020617] border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3">
            <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Condition
                </p>
            </div>
        <div key={conditionConfig.id} className="flex gap-2 items-center flex-col">
            <Input value={conditionConfig.id} onChange={(value) => updateCondition('id', value)} placeholder="Condition Name" />
            <Input value={conditionConfig.rule} onChange={(value) => updateCondition('rule', value)} placeholder="Condition Rule" />
            <Input value={conditionConfig.if_true} onChange={(value) => updateCondition('if_true', value)} placeholder="IF True" />
            <Input value={conditionConfig.if_false} onChange={(value) => updateCondition('if_false', value)} placeholder="IF False" />
        </div>

        <div className="w-full flex justify-between p-1 gap-2">
            <button onClick={SaveChanges} disabled={!isEdited} className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${!isEdited ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}`}>Save</button>
        </div>
    </div>
    </div> : <>
        <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:scale-110 transition" onClick={() => setMinimize(prev => !prev)}> {minimize ? <LuMaximize /> : <LuMinimize />} </button>
    </>}</>
}