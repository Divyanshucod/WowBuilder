import { LuMaximize, LuMinimize } from "react-icons/lu";
import { BaseNode } from "../../functions/AllClasses"
import { useEffect, useState } from "react";
import axios from "axios";
import { registerNodes } from "../../functions/CreateNodes";
import { APIRender } from "./APIRender";
import { JsonView } from "react-json-view-lite";
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
export const APIModule = ({ node, setMinimize, minimize, setEdited }: { node: BaseNode, setMinimize: (minimize: boolean) => void, minimize: boolean, setEdited: (data: boolean) => void }) => {
    const [currentNode, setCurrentNode] = useState({})
    const [initialNodeConfig, setInitialNodeConfig] = useState<NodeConfigType>(baseConfig);
    const [appId, setAppId] = useState<string | undefined>(undefined);
    const [appKey, setAppKey] = useState<string | undefined>(undefined);
    const [transactionId, setTransactionId] = useState<string | undefined>(undefined);
    const [testWithAPICall, setTestWithAPICall] = useState<boolean>(false);
    const [nodeConfig, setNodeConfig] = useState<NodeConfigType>(baseConfig);
    const [isEdited, setIsEdited] = useState(false);
    const [madeApiCall, setMadeApiCall] = useState(false);
    const [result, setResult] = useState<any>()
    const [apiInProcess, setAPIInProcess] = useState(false)
    function updateList(type, updater) {
        setNodeConfig(prev => ({
            ...prev,
            [type]: updater(prev[type])
        }));
    }
    async function handleAPICall() {
        setMadeApiCall(true);
        setAPIInProcess(true);
        console.log('till here 1');
        const headers = { ...Object.fromEntries(nodeConfig.headers.map(h => [h.name, h.value])), appId, appKey, transactionId, 'Content-Type': 'application/json' };
        console.log('Here 1');
        console.log(headers);
        const body = Object.fromEntries(nodeConfig.body.map(b => [b.name, b.value]));
        console.log('Here 2');
        console.log(body);
        const params = Object.fromEntries(nodeConfig.query.map(q => [q.name, q.value]));
        console.log('Here 3');
        console.log(params);
        console.log('till here2');
        try {
            const response = nodeConfig.method === "json_post"
                ? await axios.post(nodeConfig.url, body, { headers, params })
                : await axios.get(nodeConfig.url, { headers, params });

            console.log('till here 3');
            setResult(response.data);
            console.log('till here 4');

        } catch (err) {
            setResult("Error occurred");
        } finally {
            setAPIInProcess(false);
        }
    }

    function SaveChanges() {
        let somethingUpdate = false;

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

        if (initialNodeConfig.id !== nodeConfig.id) {
            registerNodes.delete(initialNodeConfig.id);

            updatedNode.id = nodeConfig.id;
            updatedNode.reference.id = nodeConfig.id;

            // update all references pointing to this node
            registerNodes.forEach((value) => {
                if (value.nextStepId === initialNodeConfig.id) {
                    value.nextStepId = nodeConfig.id;
                }
                if (value.if_trueId === initialNodeConfig.id) {
                    value.if_trueId = nodeConfig.id;
                }
                if (value.if_falseId === initialNodeConfig.id) {
                    value.if_falseId = nodeConfig.id;
                }
            });

            somethingUpdate = true;
        }

        if (initialNodeConfig.nextStep !== nodeConfig.nextStep) {
            updatedNode.nextStepId = nodeConfig.nextStep;
            updatedNode.reference.nextStep = nodeConfig.nextStep;
            somethingUpdate = true;
        }

        if (JSON.stringify(initialNodeConfig.headers) !== JSON.stringify(nodeConfig.headers)) {
            updatedNode.reference.headers = Object.fromEntries(
                nodeConfig.headers.map(h => [h.name, h.value])
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
                nodeConfig.body.map(b => [b.name, b.value])
            );
            somethingUpdate = true;
        }
        if (somethingUpdate) {
            registerNodes.set(updatedNode.id, updatedNode);
            // Updating workflow visualisation
            setEdited(prev => !prev);

            console.log("Updated");
        } else {
            console.log("Nothing to update");
        }
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
            url: node.url,
            nextStep: node.nextStepId,
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
    const removeRow = (type: keyof typeof baseConfig, id: string) => {
        updateList(type, (list: any[]) => list.filter(item => item.id !== id));
    };
    useEffect(() => {
        setIsEdited(JSON.stringify(initialNodeConfig) !== JSON.stringify(nodeConfig));
    }, [nodeConfig, initialNodeConfig]);
    return (<>
        {minimize ? <div className="space-y-3">

            <input value={nodeConfig.id} placeholder="Module ID"
                className="w-full p-2 rounded border dark:bg-gray-800"
                onChange={(e) => setNodeConfig({ ...nodeConfig, id: e.target.value })}
            />

            <input value={nodeConfig.url} placeholder="URL"
                className="w-full p-2 rounded border dark:bg-gray-800"
                onChange={(e) => setNodeConfig({ ...nodeConfig, url: e.target.value })}
            />

            <input value={nodeConfig.method} placeholder="Method"
                className="w-full p-2 rounded border dark:bg-gray-800"
                onChange={(e) => setNodeConfig({ ...nodeConfig, method: e.target.value })}
            />
            {APIRender("Headers", "headers", addRow, updateRow, removeRow, nodeConfig)}
            {APIRender("Body", "body", addRow, updateRow, removeRow, nodeConfig)}
            {APIRender("Query", "query", addRow, updateRow, removeRow, nodeConfig)}
            {APIRender("Variables", "variables", addRow, updateRow, removeRow, nodeConfig)}
            {testWithAPICall ? <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded space-y-2 flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <input value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="App ID" className="w-full p-2 rounded border dark:bg-gray-800" />
                    <input value={appKey} onChange={(e) => setAppKey(e.target.value)} placeholder="App Key" className="w-full p-2 rounded border dark:bg-gray-800" />
                </div>
                <div className="flex gap-2">
                    <input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Transaction ID" className="w-full p-2 rounded border dark:bg-gray-800" />
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" onClick={() => setTransactionId(crypto.randomUUID())}>GenerateAuto</button>
                </div>
            </div> : <></>}
            <div className="w-full flex justify-between p-1">
                <button onClick={SaveChanges} disabled={!isEdited} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">Save</button>
                {!testWithAPICall && <button onClick={() => setTestWithAPICall(true)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">Test API Call</button>}
                {testWithAPICall && <button onClick={handleAPICall} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">API Call</button>}
            </div>
            {madeApiCall ? <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded max-h-80 overflow-auto text-xs">
                {apiInProcess ? (
                    "Loading..."
                ) : (
                    <JsonView data={result || {}} />
                )}
            </div> : <></>}
        </div> : <>
            <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:scale-110 transition" onClick={() => setMinimize(prev => !prev)}> {minimize ? <LuMaximize /> : <LuMinimize />} </button>
        </>}
    </>
    )
}


