Which approach is better and why, on workflow upload first create the nodeRegistry (just a map to store moduleId -> baseNode mapping) then store this to localstorage and when ever user updates a certain field then directly update the localStorage or first update the nodeRegistry and quickly update the localStorage with updated nodeRegistry this why i can remove the prblem of accidental refresh or page, as current whenever the refresh happens, the json will be flushed and user need to upload a new json again. second this is whenever user will update the nodeRegistry (via making some edits) and we are updating the localStorage instance of this, so we will force the re-rendering to re-render the canvas wiith nodes and edges with updated values, and when user wants to export the updated json then i will just fetch the nodeRegistry stored, Structure them as proper expected schema and let them donwload.

## Issues 
1. the edits can be really small, so for every change we need to update the nodeRegistry, so do the its instnace stored in localStrage and as we know all the read/write opeartions take O(n) so it is worth for all the upadates, how we can handle better?
2. If we are already updating nodeRegistry then why we need to fetch the same thing from localStorage to perform re-render? why note sane nodeRegistry which is alreday there?




 ## Second appoach
  store the main workflow (full) without nodeRegistry format, then we will use the stored workflow(locally) to create nodeRegistry and render them.

## issues
1. As we can't directly upload the stored workflow, so first we need to load them from localStorage then update, also force update the UI and as we were creating nodeRegistry from stored workflow it will always have a updated data, but as we are rendering and create/updating nodeRegistry for every edits it will becomed hard.
2. Updating the loaded workflow is also hard, that'w why we created nodeRegistry at the first place so updating the workflow on every edits is time consuming thing.



Let me know you thought and what better we can do.

Current code for creating nodes and edges and nodeReqgistry(reference):

// CreateNode.ts
import { styleApprove, styleCondition, styleDecline, styleGOTO, styleMode, styleNeedsReview } from "../App";
import {
  APIModule,
  Condition,
  ConditionalVariable,
  FormModule,
  type BaseNode
} from "./AllClasses";

export const registerNodes: Map<string, BaseNode> = new Map();
export const sdkResponsesNode: Map<string, string> = new Map();
const H_SPACING = 200;
const V_SPACING = 100;

export function GenerateNodes(schema: any) {

  registerNodes.clear();
  sdkResponsesNode.clear();

  createModules(schema.modules);
  createConditions(schema.conditions);

  createConditionalVariables(schema.conditionalVariables);
  registerSdkResponses(schema.sdkResponses);

  linkModules(schema.modules);
  linkConditions(schema.conditions);
  linkConditionalVariables(schema.conditionalVariables);

  const { nodes, edges, firstInstanceMap } = buildGraph("module_countryPicker");

  return {
    initialNodes: nodes,
    initialEdges: edges,
    firstInstanceMap: firstInstanceMap
  };
}



function createModules(modules: any[]) {
  modules.forEach((module) => {
    if (module.type === "countries") {
      const node = new APIModule();
      node.id = module.id;
      node.type = module.type;
      node.nextStepId = module.nextStep;
      node.reference = module;
      registerNodes.set(node.id, node);
      return;
    }

    if (module.type === "dynamicForm" || module.subType === "form") {
      const node = new FormModule();
      node.id = module.id;
      node.type = module.type;
      node.nextStepIds = getFormNextSteps(module);
      node.reference = module;
      registerNodes.set(node.id, node);
      return;
    }

    if (module.type === "api" || module.type === "document" || module.properties?.url) {
      const node = new APIModule();
      node.id = module.id;
      node.type = module.type;
      node.url = module.properties?.url;
      node.nextStepId = module.nextStep;
      node.reference = module;
      registerNodes.set(node.id, node);
    }
  });
}

function createConditions(conditions: any) {
  for (const id in conditions) {
    const node = new Condition();
    node.id = id;
    node.if_trueId = conditions[id].if_true;
    node.if_falseId = conditions[id].if_false;
    node.rule = conditions[id].rule;
    node.reference = conditions[id];

    registerNodes.set(id, node);
  }
}

function createConditionalVariables(vars: any) {
  for (const id in vars) {
    const node = new ConditionalVariable();
    node.id = id;
    node.if_trueId = vars[id].if_true;
    node.if_falseId = vars[id].if_false;
    node.rule = vars[id].rule;
    node.reference = vars[id];

    registerNodes.set(id, node);
  }
}

function registerSdkResponses(responses: any) {
  for (const id in responses) {
    sdkResponsesNode.set(id, responses[id]);
  }
}

function linkModules(modules: any[]) {
  modules.forEach((module) => {
    const node = registerNodes.get(module.id);
    if (!node) return;

    if (node.nextStepId) {
      node.nextStepObject = registerNodes.get(node.nextStepId);
    }

    if (node.nextStepIds) {
      node.nextStepObjects = node.nextStepIds
        .map((id: string) => registerNodes.get(id))
        .filter(Boolean);
    }
  });
}

function linkConditions(conditions: any) {
  for (const id in conditions) {
    const node = registerNodes.get(id);
    if (!node) return;

    node.if_trueObject = registerNodes.get(node.if_trueId);
    node.if_falseObject = registerNodes.get(node.if_falseId);
  }
}

function linkConditionalVariables(vars: any) {
  for (const id in vars) {
    const node = registerNodes.get(id);
    if (!node) return;

    node.if_trueObject = resolvePointer(node.if_trueId);
    node.if_falseObject = resolvePointer(node.if_falseId);
  }
}

function resolvePointer(pointer: string) {
  const parts = pointer.split(".");
  if (parts.length === 2) {
    return parts[0] === "conditionalVariables"
      ? registerNodes.get(parts[1])
      : registerNodes.get(parts[0]);
  }
  return registerNodes.get(pointer);
}


export function buildGraph(startId: string) {

  const nodes: any[] = [];
  const edges: any[] = [];
  const firstInstance = new Map<string, string>();
  const visitCount = new Map<string, number>();

  let currentX = 0;

  function dfs(id: string, depth: number, parentId?: string) {

    const count = (visitCount.get(id) || 0) + 1;
    visitCount.set(id, count);

    const uniqueId = `${id}-${count}`;

    if (count > 1 && !checkEndState(id)) {

      const gotoId = `GOTO-${uniqueId}`;
      const originalId = firstInstance.get(id) || id;

      nodes.push({
        id: gotoId,
        data: {
          label: `↪ ${id}`,
          originalId: originalId
        },
        position: {
          x: currentX * H_SPACING,
          y: depth * V_SPACING
        },
        style: {
          ...styleGOTO
        }
      });

      if (parentId) {
        edges.push({
          id: `${parentId}-${gotoId}`,
          source: parentId,
          target: gotoId,
          type: "smoothstep"
        });
      }

      currentX++;
      return;
    }
    if (!checkEndState(id)) {
      firstInstance.set(id, uniqueId);
    }

    nodes.push({
      id: uniqueId,
      data: {
        label: id,
        originalId: id
      },
      position: {
        x: currentX * H_SPACING,
        y: depth * V_SPACING
      },
      style: id.startsWith('condition') ? { ...styleCondition } : checkEndState(id) ? id === 'approve' ? { ...styleApprove } : id === 'decline' ? { ...styleDecline } : { ...styleNeedsReview } : { ...styleMode }
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-${uniqueId}`,
        source: parentId,
        target: uniqueId,
        type: "smoothstep"
      });
    }

    if (checkEndState(id)) {
      currentX++;
      return;
    }

    const children = getNextNodes(registerNodes.get(id)!);

    if (!children.length) {
      currentX++;
      return;
    }
    const startX = currentX;

    children.forEach(child => {
      dfs(child, depth + 1, uniqueId);
    });

    const endX = currentX - 1;

    const centerX = (startX + endX) / 2;

    const node = nodes.find(n => n.id === uniqueId);
    if (node) {
      node.position.x = centerX * H_SPACING;
    }
  }
  dfs(startId, 0);

  return { nodes, edges, firstInstanceMap: firstInstance };
}



function getNextNodes(node: BaseNode): string[] {
  const next: string[] = [];
  
  if (node && node.if_trueId) next.push(node.if_trueId);
  if (node && node.if_falseId) next.push(node.if_falseId);

  if (node && node.nextStepId) next.push(node.nextStepId);
  if (node && node.nextStepIds) next.push(...node.nextStepIds);

  return next;
}

function getFormNextSteps(form: any) {
  const ids: string[] = [];

  if (form.nextStep) ids.push(form.nextStep);

  form.properties?.sections?.forEach((section: any) => {
    const components = section.components || [];
    const footerComponents = section.footer?.components || [];
    
    const AllComponents = [...components,...footerComponents];
    AllComponents?.forEach((c: any) => {
      if (c.type === "button") {
        ids.push(c.onClick.nextStep);
      }
    });
  });

  return ids;
}


function checkEndState(id: string): boolean {
    return id === 'approve' || id === 'decline' || id === 'auto_decline' || id === 'auto_approve' || id === 'needs_review' || id === 'manualReview';
}

// WorkflowCanvas.tsx (to visualise workflow)

import { Background, Controls, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {  useCallback, useEffect, useRef } from 'react';
import { ReactFlow, useReactFlow } from '@xyflow/react';

import { buildGraph, GenerateNodes, registerNodes } from '../functions/CreateNodes';
import { useTheme } from './Hooks/ThemeToggler';
import type { themeColor } from './Contexts';
import { highlightDark, highlightLight } from './UI/NodeUI';
import type { BaseNode } from '../functions/AllClasses';

interface GenerateNodesReturn {
  initialNodes: Node[];
  initialEdges: Edge[];
  firstInstanceMap: Map<string, string>;
}

export const WorkflowCanvas = ({ UploadedFile, initialEdges, setInitialEdges, initialNodes, setInitialNodes, firstInstanceMap, setFirstInstanceMap, isSearchOpen, setIsSearchOpen, setSelectedNode, Edited, setEdited }: { UploadedFile: any | null, initialEdges: Edge[], setInitialEdges: React.Dispatch<React.SetStateAction<Edge[]>>, initialNodes: Node[], setInitialNodes: React.Dispatch<React.SetStateAction<Node[]>>, firstInstanceMap: Map<string, string>, setFirstInstanceMap: React.Dispatch<React.SetStateAction<Map<string, string>>>, isSearchOpen: boolean, setIsSearchOpen: (val: boolean) => void, setSelectedNode: (node: BaseNode | null) => void, Edited: boolean, setEdited: (data: boolean) => void }) => {
  const { setCenter } = useReactFlow();
  const { theme, toggleTheme } = useTheme();
  const flowref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (UploadedFile) {
      let val = {
        initialNodes: [] as Node[],
        initialEdges: [] as Edge[],
        firstInstanceMap: new Map<string, string>()
      };
      if(!Edited){
         val = GenerateNodes(UploadedFile) as GenerateNodesReturn;
      }
      else{
      
      const ans = buildGraph('module_countryPicker');
      val.initialEdges = ans.edges;
      val.initialNodes = ans.nodes;
      val.firstInstanceMap = ans.firstInstanceMap
      }
      if (val) {
        setInitialNodes(val.initialNodes);
        setInitialEdges(val.initialEdges);
        setFirstInstanceMap(val.firstInstanceMap);

        // Focus on the start module (module_countryPicker)
        const startNode = val.initialNodes.find(n => n.id.includes('module_countryPicker'));
        if (startNode) {
          setTimeout(() => {
            setCenter(startNode.position.x, startNode.position.y, { zoom: 1.5, duration: 800 });
          }, 100);
          flashHighlightNode(startNode.id, theme, setInitialNodes);
        }
      }
    }
  }, [UploadedFile, setCenter, Edited]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const nodeData = node.data as { originalId?: string; label?: string };

    if (node.id.startsWith('GOTO-')) {
      // Get the original node ID from the GOTO node
      const originalId = nodeData.originalId;

      if (originalId) {
        // Find the original node in the graph
        const targetNode = initialNodes.find(n => n.id === originalId);

        if (targetNode) {
          setCenter(targetNode.position.x, targetNode.position.y, { zoom: 1.5, duration: 800 });
        }
        flashHighlightNode(originalId, theme, setInitialNodes);
      }
    }
    else{
      
      const node = registerNodes.get(nodeData.originalId!);
      if (node) {
        setSelectedNode(node);
      }
    }
  }, [initialNodes, setCenter]);
  
  return (
    <div className={`h-full w-full ${isSearchOpen ? "disable-interaction react-flow" : ""}`} ref={flowref} >
    
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        onNodeClick={handleNodeClick}
        colorMode={theme}
        panOnScroll={!isSearchOpen}
        selectionOnDrag={!isSearchOpen}
        panOnDrag={false}
      >
        <Background
          gap={20}
          size={1}
          color="#1f2937"
        />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-gray-400">
          Scroll to explore • Click nodes for details
        </div>
        <Controls />
      </ReactFlow>
    </div>
  );
}

export const flashHighlightNode = (nodeId: string, theme: themeColor, setInitialNodes: React.Dispatch<React.SetStateAction<Node[]>>) => {
  const highlightStyle = theme === "dark" ? highlightDark : highlightLight;

  setInitialNodes((nds) =>
    nds.map((node) =>
      node.id === nodeId
        ? {
          ...node,
          style: {
            ...node.style,
            ...highlightStyle,
          },
        }
        : node
    )
  );

  setTimeout(() => {
    setInitialNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            style: {
              ...node.style,
              outline: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            },
          }
          : node
      )
    );
  }, 1200);
};