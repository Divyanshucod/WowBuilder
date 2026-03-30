import { styleApprove, styleCondition, styleDecline, styleGOTO, styleMode, styleNeedsReview } from "../App";
import {
  APIModule,
  Condition,
  ConditionalVariable,
  FormModule,
  type BaseNode
} from "./AllClasses";

export let registerNodes: Map<string, BaseNode> = new Map();
export let sdkResponsesNode: Map<string, string> = new Map();
const H_SPACING = 200;
const V_SPACING = 100;

export function GenerateNodes(schema: any, setEnableUpload:(val:boolean) => void, enableUpload:boolean=true) {

  registerNodes.clear();
  sdkResponsesNode.clear();
  const jsonSchema = window.localStorage.getItem('workflow_schema');
  const jsonSdkResponse = window.localStorage.getItem('workflow_sdkResponse');

  if(!jsonSchema){
     if(!enableUpload){
     console.log('no workflow exist! enable upload button! when refresh happens');
    //  setEnableUpload(true);
     return;
     }
     else if(schema == undefined || schema == null){
      console.log('no workflow to visualise');
      return;
     }
     else{
       createModules(schema.modules);
       createConditions(schema.conditions);

       createConditionalVariables(schema.conditionalVariables);
       registerSdkResponses(schema.sdkResponses);
       console.log(sdkResponsesNode);
       console.log(registerNodes);
       
       
        window.localStorage.setItem('workflow_schema',JSON.stringify(registerNodes))
        window.localStorage.setItem('workflow_sdkResponse',JSON.stringify(sdkResponsesNode))
        // setEnableUpload(false)
     }
  }
  // Locally store the registerNodes and sdkResponseNodes
  const mainSchema = jsonSchema ? JSON.parse(jsonSchema) : schema;
  if (jsonSchema) {
    registerNodes = jsonSchema
    sdkResponsesNode = jsonSdkResponse
  }
  linkModules(mainSchema.modules);
  linkConditions(mainSchema.conditions);
  linkConditionalVariables(mainSchema.conditionalVariables);

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