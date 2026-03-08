import dagre from "dagre";
import {
  APIModule,
  Condition,
  ConditionalVariable,
  FormModule,
  type BaseNode
} from "./AllClasses";

const registerNodes: Map<string, BaseNode> = new Map();
const sdkResponsesNode: Map<string, string> = new Map();

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

  const { nodes, edges } = buildGraph("module_countryPicker");

  const layouted = applyDagreLayout(nodes, edges);

  return {
    initialNodes: layouted.nodes,
    initialEdges: layouted.edges
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

function buildGraph(startId: string) {
  const nodes: any[] = [];
  const edges: any[] = [];
  const visited = new Set<string>();

  function dfs(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    const node = registerNodes.get(id);
    if (!node) return;

    nodes.push({
      id,
      data: { label: id }
    });

    const nextNodes = getNextNodes(node);

    nextNodes.forEach((next) => {
      edges.push({
        id: `${id}-${next.id}`,
        source: id,
        target: next.id,
        type: "smoothstep"
      });

      dfs(next.id);
    });
  }

  dfs(startId);

  return { nodes, edges };
}

function getNextNodes(node: BaseNode): BaseNode[] {
  const next: BaseNode[] = [];

  if (node.nextStepObject) next.push(node.nextStepObject);
  if (node.nextStepObjects) next.push(...node.nextStepObjects);
  if (node.if_trueObject) next.push(node.if_trueObject);
  if (node.if_falseObject) next.push(node.if_falseObject);

  return next;
}

function getFormNextSteps(form: any) {
  const ids: string[] = [];

  if (form.nextStep) ids.push(form.nextStep);

  form.properties?.sections?.forEach((section: any) => {
    const components = section.components || section.footer?.components;

    components?.forEach((c: any) => {
      if (c.type === "button") {
        ids.push(c.onClick.nextStep);
      }
    });
  });

  return ids;
}

function applyDagreLayout(nodes: any[], edges: any[]) {
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "TB", // top to bottom
    nodesep: 80,
    ranksep: 120
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 150, height: 50 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const pos = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: pos.x,
        y: pos.y
      }
    };
  });

  return { nodes: layoutedNodes, edges };
}