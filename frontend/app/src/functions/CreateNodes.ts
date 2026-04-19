import { styleApprove, styleCondition, styleDecline, styleGOTO, styleMode, styleNeedsReview } from "../App";
import {
  APIModule,
  Condition,
  ConditionalVariable,
  FormModule,
  type BaseNode
} from "./AllClasses";

export const REGISTRY_KEY = 'workflow_registry';
export const SDK_KEY = 'workflow_sdkResponse';
export const SCHEMA_KEY = 'workflow_schema';

export let registerNodes: Map<string, BaseNode> = new Map();
export let sdkResponsesNode: Map<string, string> = new Map();
const H_SPACING = 200;
const V_SPACING = 100;

// helper to produce a serializable snapshot of the registry (strip object links)
export function getSerializableRegistry() {
  return Array.from(registerNodes.entries()).map(([key, value]: any) => {
    // shallow copy and remove references that cannot/shouldn't be serialized
    const copy: any = { ...value };
    copy.nextStepObject = undefined;
    copy.if_trueObject = undefined;
    copy.if_falseObject = undefined;
    return [key, copy];
  });
}

// persist current registry + schema to localStorage, only overwriting when changed
export async function persistCache(schema?: any) {
  try {
    const serialisable = getSerializableRegistry();
    const registryJson = JSON.stringify(serialisable);
    const prevRegistry = window.localStorage.getItem(REGISTRY_KEY);

    if (prevRegistry !== registryJson) {
      // async write to avoid blocking UI
      await new Promise<void>((res) => {
        window.localStorage.setItem(REGISTRY_KEY, registryJson);
        res();
      });
    }

    if (schema !== undefined) {
      const schemaJson = JSON.stringify(schema);
      const prevSchema = window.localStorage.getItem(SCHEMA_KEY);
      if (prevSchema !== schemaJson) {
        await new Promise<void>((res) => {
          window.localStorage.setItem(SCHEMA_KEY, schemaJson);
          res();
        });
      }
    }

    // optionally persist sdk responses too if changed
    const sdkJson = JSON.stringify(Array.from(sdkResponsesNode.entries()));
    const prevSdk = window.localStorage.getItem(SDK_KEY);
    if (prevSdk !== sdkJson) {
      await new Promise<void>((res) => {
        window.localStorage.setItem(SDK_KEY, sdkJson);
        res();
      });
    }
  } catch (err) {
    // keep non-blocking: log and continue
    // eslint-disable-next-line no-console
    console.warn('persistCache error', err);
  }
}

export function GenerateNodes(schema: any) {
  
  registerNodes.clear();
  sdkResponsesNode.clear();

  const jsonRegistry = window.localStorage.getItem(REGISTRY_KEY);
  const jsonSdkResponse = window.localStorage.getItem(SDK_KEY);
  const jsonSchema = window.localStorage.getItem(SCHEMA_KEY);

  if (!jsonRegistry || !jsonSdkResponse) {
    // ensure schema shape safety
    const modules = schema?.modules || [];
    const conditions = schema?.conditions || {};
    const conditionalVariables = schema?.conditionalVariables || {};
    const sdkResponses = schema?.sdkResponses ?? schema?.sdkResponse ?? {};

    // build fresh register and sdk maps
    createModules(modules);
    createConditions(conditions);
    createConditionalVariables(conditionalVariables);
    registerSdkResponses(sdkResponses);

    // serialise registerNodes and sdkResponsesNode for faster reloads
    try {
      const serialised = Array.from(registerNodes.entries()).map(([key, value]) => [key, { ...value, nextStepObject: undefined, if_trueObject: undefined, if_falseObject: undefined }]);
      window.localStorage.setItem(REGISTRY_KEY, JSON.stringify(serialised));
      window.localStorage.setItem(SDK_KEY, JSON.stringify(Array.from(sdkResponsesNode.entries())));
      // persist original schema separately (so linking uses original shape)
      window.localStorage.setItem(SCHEMA_KEY, JSON.stringify(schema));
    } catch (err) {
      console.warn('Failed to persist workflow cache to localStorage', err);
    }
  }

  // take the schema which is present
  const mainSchema = jsonSchema ? JSON.parse(jsonSchema) : schema;

  // If we have cached registry & sdk, attempt to rebuild registerNodes & sdkResponsesNode
  if (jsonRegistry && jsonSdkResponse) {
    try {
      const moduleParsed = JSON.parse(jsonRegistry);
      const sdkParsed = JSON.parse(jsonSdkResponse);

      registerNodes = new Map(
        moduleParsed.map(([key, value]: any) => {
          // Rehydrate appropriate class instance based on stored value
          const keyPrefix = String(key).split('_')[0];
          if (keyPrefix === 'condition' || value?.type === 'condition') {
            const node = new Condition();
            Object.assign(node, value);
            return [key, node];
          } else if (value?.type === "dynamicForm" || value?.subType === "form") {
            const node = new FormModule();
            Object.assign(node, value);
            return [key, node];
          } else {
            const node = new APIModule();
            Object.assign(node, value);
            return [key, node];
          }
        })
      );

      sdkResponsesNode = new Map(sdkParsed);
    } catch (err) {
      console.warn('Some issue so use fallback schema', err);
      registerNodes.clear();
      sdkResponsesNode.clear();
      createModules(mainSchema?.modules || []);
      createConditions(mainSchema?.conditions || {});
      createConditionalVariables(mainSchema?.conditionalVariables || {});
      registerSdkResponses(mainSchema?.sdkResponses ?? mainSchema?.sdkResponse ?? {});
    }
  }

  console.log('Linking');

  // Defensive linking: ensure each link function receives a safe value
  linkModules(mainSchema?.modules || []);
  linkConditions(mainSchema?.conditions || {});
  linkConditionalVariables(mainSchema?.conditionalVariables || {});

  const { nodes, edges, firstInstanceMap } = buildGraph("module_countryPicker");

  return {
    initialNodes: nodes,
    initialEdges: edges,
    firstInstanceMap: firstInstanceMap
  };
}



function createModules(modules: any[]) {
  if (!Array.isArray(modules)) return;
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
  if (!conditions) return;
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
  if (!vars) return;
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
  if (!responses) return;
  for (const id in responses) {
    sdkResponsesNode.set(id, responses[id]);
  }
}

function linkModules(modules: any[]) {
  if (!Array.isArray(modules)) return;
  modules.forEach((module) => {
    const node = registerNodes.get(module.id);
    if (!node) return;

    if (node.nextStepId) {
      node.nextStepObject = registerNodes.get(node.nextStepId);
    }

    if (node.nextStepIds) {
        node.nextStepObjects = node.nextStepIds
          .map((id: string) => registerNodes.get(id))
          .filter((n): n is BaseNode => !!n);
    }
  });
}

function linkConditions(conditions: any) {
  if (!conditions) return;
  for (const id in conditions) {
    const node = registerNodes.get(id);
    if (!node) continue;

    if (node.if_trueId) node.if_trueObject = registerNodes.get(node.if_trueId);
    if (node.if_falseId) node.if_falseObject = registerNodes.get(node.if_falseId);
  }
}

function linkConditionalVariables(vars: any) {
  if (!vars) return;
  for (const id in vars) {
    const node = registerNodes.get(id);
    if (!node) continue;

    if (node.if_trueId) node.if_trueObject = resolvePointer(node.if_trueId);
    if (node.if_falseId) node.if_falseObject = resolvePointer(node.if_falseId);
  }
}

function resolvePointer(pointer: string) {
  if (!pointer || typeof pointer !== 'string') return undefined;
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

    const nextNode = registerNodes.get(id);
    const children = nextNode ? getNextNodes(nextNode) : [];

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
  
  if (!node) return next;
  if (node.if_trueId) next.push(node.if_trueId);
  if (node.if_falseId) next.push(node.if_falseId);

  if (node.nextStepId) next.push(node.nextStepId);
  if (node.nextStepIds) next.push(...node.nextStepIds);

  return next;
}

function getFormNextSteps(form: any) {
  const ids: string[] = [];

  if (!form) return ids;
  if (form.nextStep) ids.push(form.nextStep);

  const sections = form.properties?.sections || [];
  sections.forEach((section: any) => {
    const components = section.components || [];
    const footerComponents = section.footer?.components || [];
    
    const AllComponents = [...components, ...footerComponents];
    AllComponents.forEach((c: any) => {
      if (c?.type === "button" && c.onClick?.nextStep) {
        ids.push(c.onClick.nextStep);
      }
    });
  });

  return ids;
}


function checkEndState(id: string): boolean {
    return id === 'approve' || id === 'decline' || id === 'auto_decline' || id === 'auto_approve' || id === 'needs_review' || id === 'manualReview';
}