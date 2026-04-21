import { LuMaximize, LuMinimize } from "react-icons/lu";
import { BaseNode } from "../../functions/AllClasses"
import { useEffect, useState } from "react";
import axios from "axios";
import { registerNodes, persistCache } from "../../functions/CreateNodes";
import { useAutoSave } from '../AutoSaveContext';
import { APIRender } from "./APIRender";
import { JsonView } from "react-json-view-lite";
import { Input } from "./Input";
export type NodeConfigType = {
    headers: { id: string; name: string; value: string }[],
    body: { id: string; name: string; value: string }[],
    query: { id: string; name: string; value: string; type: string }[],
    variables: { id: string; name: string; path: string }[],
    method: string,
    url: string,
    nextStep: string,
    name: string,
    id: string
}
export const baseConfig = {
    headers: [] as { id: string; name: string; value: string }[],
    body: [] as { id: string; name: string; value: string }[],
    query: [] as { id: string; name: string; value: string; type: string }[],
    variables: [] as { id: string; name: string; path: string }[],
    method: "json_get",
    url: "",
    nextStep: "",
    name: "",
    id: ""
};
let id: any = null;
export const APIModule = ({ node, setMinimize, minimize, setEdited, edited }: { node: BaseNode, setMinimize: (minimize: boolean) => void, minimize: boolean, setEdited: (data: boolean) => void, edited: boolean }) => {
    const [initialNodeConfig, setInitialNodeConfig] = useState<NodeConfigType>(baseConfig);
    const [appId, setAppId] = useState<string | undefined>(undefined);
    const [appKey, setAppKey] = useState<string | undefined>(undefined);
    const [transactionId, setTransactionId] = useState<string | undefined>(undefined);
    const [testWithAPICall, setTestWithAPICall] = useState<boolean>(false);
    const [nodeConfig, setNodeConfig] = useState<NodeConfigType>(baseConfig);
    const [_isEdited, _setIsEdited] = useState(false);
    const [madeApiCall, setMadeApiCall] = useState(false);
    const [result, setResult] = useState<any>()
    const [apiInProcess, setAPIInProcess] = useState(false)
    function updateList(type: keyof typeof baseConfig, updater: (prev: any) => any) {
        setNodeConfig(prev => ({
            ...prev,
            [type]: updater((prev as any)[type])
        }));
    }
    async function handleAPICall() {
        setMadeApiCall(true);
        setAPIInProcess(true);
        const headers = { ...Object.fromEntries(nodeConfig.headers.map(h => [h.name, h.value])), appId, appKey, transactionId, 'Content-Type': 'application/json' };
        const body = Object.fromEntries(nodeConfig.body.map(b => [b.name, b.value]));
        const params = Object.fromEntries(nodeConfig.query.map(q => [q.name, q.value]));
        try {
            const response = nodeConfig.method === "json_post"
                ? await axios.post(nodeConfig.url, body, { headers, params })
                : await axios.get(nodeConfig.url, { headers, params });

            setResult(response.data);

        } catch (err) {
            setResult("Error occurred");
        } finally {
            setAPIInProcess(false);
        }
    }

    // applyChanges: same logic as previous SaveChanges but runs automatically (debounced)
    const { start, finish } = useAutoSave();

    const applyChanges = async () => {
        start();
        
        let somethingUpdate = false;
        let idChanged = false;

        const updatedNode = structuredClone(node);

        if (initialNodeConfig.url !== nodeConfig.url) {
            updatedNode.url = nodeConfig.url;
            updatedNode.reference.url = nodeConfig.url;
            somethingUpdate = true;
        }

        if (initialNodeConfig.name !== nodeConfig.name) {
            updatedNode.reference.name = nodeConfig.name;
            somethingUpdate = true;
        }

        if (initialNodeConfig.method !== nodeConfig.method) {
            updatedNode.reference.properties = {
                ...updatedNode.reference.properties,
                apiType: nodeConfig.method
            };
            somethingUpdate = true;
        }
        // Id change
        if (initialNodeConfig.id !== nodeConfig.id) {
            registerNodes.delete(initialNodeConfig.id);

            updatedNode.id = nodeConfig.id;
            updatedNode.reference.id = nodeConfig.id;

            idChanged = true;
            somethingUpdate = true;
        }


        if (initialNodeConfig.nextStep !== nodeConfig.nextStep) {
            updatedNode.nextStepId = nodeConfig.nextStep;
            updatedNode.reference.nextStep = nodeConfig.nextStep;
            somethingUpdate = true;
        }

        if (JSON.stringify(initialNodeConfig.headers) !== JSON.stringify(nodeConfig.headers)) {
            updatedNode.reference.headers = Object.fromEntries(
                nodeConfig.headers
                    .filter(h => h.name)
                    .map(h => [h.name, h.value])
            );
            somethingUpdate = true;
        }

        if (JSON.stringify(initialNodeConfig.query) !== JSON.stringify(nodeConfig.query)) {
            updatedNode.reference.properties = {
                ...updatedNode.reference.properties,
                requestParameters: nodeConfig.query.map(q => ({
                    name: q.name,
                    value: q.value,
                    type: q.type
                }))
            };
            somethingUpdate = true;
        }

        if (JSON.stringify(initialNodeConfig.variables) !== JSON.stringify(nodeConfig.variables)) {
            updatedNode.reference.variables = nodeConfig.variables.map(v => ({
                name: v.name,
                path: v.path
            }));
            somethingUpdate = true;
        }

        if (JSON.stringify(initialNodeConfig.body) !== JSON.stringify(nodeConfig.body)) {
            updatedNode.reference.requestBody = Object.fromEntries(
                nodeConfig.body
                    .filter(b => b.name)
                    .map(b => [b.name, b.value])
            );
            somethingUpdate = true;
        }

        if (somethingUpdate) {

            registerNodes.set(updatedNode.id, updatedNode);

            if (idChanged) {
                registerNodes.forEach((value) => {

                    if (value.nextStepId === initialNodeConfig.id) {
                        value.nextStepId = nodeConfig.id;
                        value.nextStepObject = updatedNode;
                    }

                    if (value.if_trueId === initialNodeConfig.id) {
                        value.if_trueId = nodeConfig.id;
                        value.if_trueObject = updatedNode;
                    }

                    if (value.if_falseId === initialNodeConfig.id) {
                        value.if_falseId = nodeConfig.id;
                        value.if_falseObject = updatedNode;
                    }

                });
            }
            setInitialNodeConfig(structuredClone(nodeConfig));
            // notify parent to re-generate graph
            setEdited(!edited);

            // cache upate
            try {
                await persistCache();
                finish(true);
            } catch (err) {
                console.warn('persistCache failed', err);
                finish(false, String(err));
            }
        }
        // if nothing updated
        if (!somethingUpdate) finish(true);
    }
    const removeRow = (type: keyof typeof baseConfig, id: string) => {
        updateList(type, (list: any[]) => list.filter(item => item.id !== id));
    }
    // adding new row 
    const addRow = (type: keyof typeof baseConfig) => {
        if (type === "variables") {
            updateList(type, (list: any[]) => [...list, { id: crypto.randomUUID(), name: "", path: "" }]);
        } else if (type === "query") {
            updateList(type, (list: any[]) => [...list, { id: crypto.randomUUID(), name: "", value: "", type: "" }]);
        } else {
            updateList(type, (list: any[]) => [...list, { id: crypto.randomUUID(), name: "", value: "" }]);
        }
    };
    const updateRow = (type: keyof typeof baseConfig, id: string, key: string, value: string) => {
        updateList(type, (list: any[]) =>
            list.map(item => item.id === id ? { ...item, [key]: value } : item)
        );
    };
    useEffect(() => {
        const newConfig = {
            headers: [] as { id: string; name: string; value: string }[],
            body: [] as { id: string; name: string; value: string }[],
            query: [] as { id: string; name: string; value: string; type: string }[],
            variables: [] as { id: string; name: string; path: string }[],
            method: node.reference?.properties?.apiType || "json_get",
            url: node.url || "",
                nextStep: node.nextStepId || "",
                name: node.reference?.name || "",
            id: node.id
        };

        Object.entries(node.reference?.properties?.headers || {}).forEach(([key, val]) => {
            newConfig.headers.push({
                id: crypto.randomUUID(),
                name: key,
                value: val as string
            });
        });

        Object.entries(node.reference?.properties?.requestBody || {}).forEach(([key, val]) => {
            newConfig.body.push({
                id: crypto.randomUUID(),
                name: key,
                value: val as string
            });
        });

        (node.reference?.properties?.requestParameters || []).forEach((q: any) => {
            newConfig.query.push({
                id: crypto.randomUUID(),
                name: q.name,
                value: q.value,
                type: q.type
            });
        });

        (node.reference?.variables || []).forEach((v: any) => {
            newConfig.variables.push({
                id: crypto.randomUUID(),
                name: v.name,
                path: v.path
            });
        });

        setNodeConfig(newConfig);
        setInitialNodeConfig(newConfig);

    }, [node]);

    // If frequent changes then only change after 500ms
    useEffect(() => {
        clearTimeout(id);
        if (JSON.stringify(initialNodeConfig) !== JSON.stringify(nodeConfig)) {
            id = setTimeout(() => {
                applyChanges();
            }, 500);
        }
        return () => clearTimeout(id);
    }, [nodeConfig]);
    return (<>
        {minimize ? <div className="space-y-3">
             
            <Input value={nodeConfig.id} placeholder="Module ID" onChange={(e) => setNodeConfig({ ...nodeConfig, id: e.target.value })}/>

            <Input value={nodeConfig.url} placeholder="URL" onChange={(e) => setNodeConfig({ ...nodeConfig, url: e.target.value })}
            />

            <Input value={nodeConfig.method} placeholder="Method" onChange={(e) => setNodeConfig({ ...nodeConfig, method: e.target.value })}
            />

            <Input value={nodeConfig.nextStep} placeholder="Next Step" onChange={(e) => setNodeConfig({ ...nodeConfig, nextStep: e.target.value })} />
            {APIRender("Headers", "headers", addRow, updateRow, nodeConfig, removeRow)}
            {APIRender("Body", "body", addRow, updateRow, nodeConfig, removeRow)}
            {APIRender("Query", "query", addRow, updateRow, nodeConfig, removeRow)}
            {APIRender("Variables", "variables", addRow, updateRow, nodeConfig, removeRow)}
            {testWithAPICall ? <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded space-y-2 flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <Input value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="App ID" />
                    <Input value={appKey} onChange={(e) => setAppKey(e.target.value)} placeholder="App Key" />
                </div>
                <div className="flex gap-2">
                    <Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Transaction ID" />
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" onClick={() => setTransactionId(crypto.randomUUID())}>GenerateAuto</button>
                </div>
            </div> : <></>}
            <div className="w-full flex justify-between p-1 gap-2">
                {!testWithAPICall && <button onClick={() => setTestWithAPICall(true)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50">Test API Call</button>}
                {testWithAPICall && <button onClick={handleAPICall} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition">API Call</button>}
            </div>
            {madeApiCall ? <div className="bg-gray-100 dark:bg-[#020617] border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs max-h-64 overflow-auto">
                {apiInProcess ? (
                    "Loading..."
                ) : (
                    <JsonView data={result || {}} />
                )}
            </div> : <></>}
        </div> : <>
        <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:scale-110 transition" onClick={() => setMinimize(!minimize)}> {minimize ? <LuMaximize /> : <LuMinimize />} </button>
        </>}
    </>
    )
}


