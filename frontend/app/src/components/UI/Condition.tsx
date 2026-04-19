import { LuMaximize, LuMinimize } from "react-icons/lu";
import type { BaseNode } from "../../functions/AllClasses";
import { useEffect, useState } from "react";
import { registerNodes, persistCache } from "../../functions/CreateNodes";
import { useAutoSave } from '../AutoSaveContext';
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
    const [_isEdited, _setIsEdited] = useState<boolean>(false)
    const updateCondition = (type: keyof typeof conditionConfigData, value: string) => {
        setConditionConfig(prev => ({ ...prev, [type]: value }))
    }

    const { start, finish } = useAutoSave();

    // helper: update references across registry when an id changes
    const updateReferencesForRenamedId = (oldId: string, newId: string) => {
        if (!oldId || oldId === newId) return;
        registerNodes.forEach((n: any) => {
            let changed = false;
            if (n.nextStepId === oldId) { n.nextStepId = newId; changed = true; }
            if (Array.isArray(n.nextStepIds)) {
                n.nextStepIds = n.nextStepIds.map((id: string) => id === oldId ? newId : id);
                changed = true;
            }
            if (n.if_trueId === oldId) { n.if_trueId = newId; changed = true; }
            if (n.if_falseId === oldId) { n.if_falseId = newId; changed = true; }
            if (changed && n.reference) {
                if (n.reference.nextStep === oldId) n.reference.nextStep = newId;
                if (n.reference.if_true === oldId) n.reference.if_true = newId;
                if (n.reference.if_false === oldId) n.reference.if_false = newId;
            }
        });
    }

    // Auto-apply condition changes (debounced) with autosave context
    const applyConditionChanges = async () => {
        start();
        try {
            const conditionCopy: any = structuredClone(node as any);
            let somethingUpdated = false;
            const oldId = node.id;
            const newId = conditionConfig.id;

            if (conditionConfig.if_false !== (node as any).if_falseId) {
                conditionCopy.if_falseId = conditionConfig.if_false;
                if (conditionCopy.reference) conditionCopy.reference.if_false = conditionConfig.if_false;
                somethingUpdated = true;
            }

            if (conditionConfig.if_true !== (node as any).if_trueId) {
                conditionCopy.if_trueId = conditionConfig.if_true;
                if (conditionCopy.reference) conditionCopy.reference.if_true = conditionConfig.if_true;
                somethingUpdated = true;
            }

            if (conditionConfig.rule !== (node as any).rule) {
                conditionCopy.rule = conditionConfig.rule;
                if (conditionCopy.reference) conditionCopy.reference.rule = conditionConfig.rule
                somethingUpdated = true;
            }

            if (newId && newId !== oldId) {
                conditionCopy.id = newId;
                if (conditionCopy.reference) conditionCopy.reference.id = newId;
                registerNodes.delete(oldId);
                updateReferencesForRenamedId(oldId, newId);
                somethingUpdated = true;
            }

            if (somethingUpdated) {
                registerNodes.set(conditionCopy.id, conditionCopy);
                setInitialConditionConfig({ ...conditionConfig });
                setEdited(!edited);
                await persistCache().catch((err) => console.warn('persistCache failed', err));
            }
            finish(true);
        } catch (err: any) {
            console.warn('applyConditionChanges error', err);
            finish(false, String(err?.message || err));
        }
    }
    useEffect(() => {
        setInitialConditionConfig(conditionConfigData)
        setConditionConfig(conditionConfigData)
        setConditionConfig({
            if_false: (node as any).if_falseId,
            if_true: (node as any).if_trueId,
            rule: (node as any).rule,
            id: (node as any).id
        })
         setInitialConditionConfig({
            if_false: (node as any).if_falseId,
            if_true: (node as any).if_trueId,
            rule: (node as any).rule,
            id: (node as any).id
        })
    }, [node])

    useEffect(() => {
        // debounced auto save
        let id: any = null;
        if (JSON.stringify(initialConditionConfig) !== JSON.stringify(conditionConfig)) {
            id = setTimeout(() => applyConditionChanges(), 300);
        }
        return () => clearTimeout(id);
    }, [conditionConfig]);
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
            {/* auto-saved */}
        </div>
    </div>
    </div> : <>
    <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:scale-110 transition" onClick={() => setMinimize(!minimize)}> {minimize ? <LuMaximize /> : <LuMinimize />} </button>
    </>}</>
}