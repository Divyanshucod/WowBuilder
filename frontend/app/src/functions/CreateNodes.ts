import { APIModule, Condition, ConditionalVariable, FormModule, type BaseNode } from "./AllClasses";

// const initialNodes = [
//   {
//     id: 'n1',
//     position: { x: 0, y: 0 },
//     data: { label: 'Node 1' },
//     type: 'input',
//   },
//   {
//     id: 'n2',
//     position: { x: 100, y: 100 },
//     data: { label: 'Node 2' },
//   },
//   {
//     id: 'n3',
//     position: { x: 20, y: 20 },
//     data: { label: 'Node 3' },
//     type: 'input',
//   },
//   {
//     id: 'n4',
//     position: { x: 30, y: 30 },
//     data: { label: 'Node 4' },
//   },
// ];
// const initialEdges = [
//   {
//     id: 'n1-n2',
//     source: 'n1',
//     target: 'n2',
//     type: 'smoothstep',
//     label: 'connects with',
//   },
// ];
const registerNodes: Map<string, BaseNode> = new Map();
const sdkResponsesNode: Map<string, string> = new Map();
export function GenerateNodes(schema: any): { initialNodes: any[]; initialEdges: any[] } {
    schema.modules.forEach((module: any) => {
        // country //module_countryPicker
        if (module.type === 'country') {
            const countryNode = new APIModule();
            countryNode.id = module.id;
            countryNode.type = module.type;
            countryNode.nextStepId = module.nextStepId;
            countryNode.reference = module;
            countryNode.subType = module.subType;
            registerNodes.set(module.id, countryNode);
        }

        // module: form
        if (module.type === 'dynamicForm' || module.subType === 'form') {
            const formNode = new FormModule();
            formNode.id = module.id;
            formNode.type = module.type;
            formNode.subType = module.subType;
            formNode.nextStepIds = getAllFormNextStepIds(module);
            formNode.reference = module;
            registerNodes.set(formNode.id, formNode);
        }
        // module: api/document
        if (module.type === 'api' && module.type === 'document' || module.properties.url) {
            const apiNode = new APIModule();
            apiNode.id = module.id;
            apiNode.type = module.type;
            apiNode.url = module.properties.url;
            apiNode.subType = module.subType;
            apiNode.nextStepId = module.nextStepId;
            apiNode.reference = module;
            registerNodes.set(apiNode.id, apiNode);
        }
    })


    // condition
    const conditions = schema.conditions;
    for (const conditionId in conditions) {
        const conditionNode = new Condition();
        conditionNode.id = conditionId;
        conditionNode.if_trueId = conditions[conditionId].if_true;
        conditionNode.if_falseId = conditions[conditionId].if_false;
        conditionNode.reference = conditions[conditionId];
        conditionNode.rule = conditions[conditionId].rule;
        registerNodes.set(conditionNode.id, conditionNode);
    }

    // conditionalVariables
    const conditionalVariables = schema.conditionalVariables;
    for (const variableId in conditionalVariables) {
        const variableNode = new ConditionalVariable();
        variableNode.id = variableId;
        variableNode.if_trueId = conditionalVariables[variableId].if_true;
        variableNode.if_falseId = conditionalVariables[variableId].if_false;
        variableNode.reference = conditionalVariables[variableId];
        variableNode.rule = conditionalVariables[variableId].rule;
        registerNodes.set(variableNode.id, variableNode);
    }

    // sdkResponses
    const sdkResponses = schema.sdkResponses;
    for (const responseId in sdkResponses) {
        sdkResponsesNode.set(responseId, sdkResponses[responseId]);
    }


    // Create linking
     schema.modules.forEach((module: any) => {
        // country
        if (module.type === 'country') {
            const countryNode = registerNodes.get(module.id);
            countryNode.nextStepObject = registerNodes.get(module.nextStepId);
            initialNodes.push(countryNode);
        }
        // module: form
        if (module.type === 'dynamicForm' || module.subType === 'form') {
           const FormNode = registerNodes.get(module.id);
           if (FormNode) {
               // Link the form node to its next steps
               FormNode.nextStepIds.forEach((nextStepId: string) => {
                   const nextStepNode = registerNodes.get(nextStepId);
                   if (nextStepNode) {
                       FormNode.nextStepObjects.push(nextStepNode);
                   }
               });
           }
        }
        // module: api/document
        if (module.type === 'api' && module.type === 'document' || module.properties.url) {
            const apiNode = registerNodes.get(module.id);
            if (apiNode) {
                // Link the API node to its next steps
               apiNode.nextStepObject = registerNodes.get(module.nextStepId);
            }
        }
    })

    // same for conditions
    for (const conditionId in conditions) {
       const conditionNode = registerNodes.get(conditionId);
       if (conditionNode) {
           conditionNode.if_trueObject = registerNodes.get(conditionNode.if_trueId);
           conditionNode.if_falseObject = registerNodes.get(conditionNode.if_falseId);
       }
    }

    // same for conditionalVariables
    for (const variableId in conditionalVariables) {
        // if the starting pointer is conditionalVariables or module_
       const variableNode = registerNodes.get(variableId);
       if (variableNode) {
           const splittedValuesTrue = variableNode.if_trueId.split('.');
           const splittedValuesFalse = variableNode.if_falseId.split('.');
           if(splittedValuesTrue.length == 2) {
               const requiredNode = splittedValuesTrue[0] == 'conditionalVariables' ? registerNodes.get(splittedValuesTrue[1]) : registerNodes.get(splittedValuesTrue[0]);
               variableNode.if_trueObject = requiredNode;
           }
           if(splittedValuesFalse.length == 2) {
               const requiredNode = splittedValuesFalse[0] == 'conditionalVariables' ? registerNodes.get(splittedValuesFalse[1]) : registerNodes.get(splittedValuesFalse[0]);
               variableNode.if_falseObject = requiredNode;
           }

       }
       // will think what we can do with constant values.
   }
    
   return {
    initialEdges: AllInitialEdgesAndNodes().initialEdges,
    initialNodes: AllInitialEdgesAndNodes().initialNodes
   }

}


function getAllFormNextStepIds(formSchema: any): string[] {
    const nextStepIds: string[] = [];
    // if nextStep has some id
    if (formSchema.nextStep != '') {
        nextStepIds.push(...formSchema.nextStep);
    }
    // checking other remaining positions.
    formSchema.properties.sections.forEach((section: any) => {
        if (section.components) {
            section.components.forEach((element: any) => {
                if (element.type == 'button') {
                    nextStepIds.push(...element.onClick.nextStep);
                }
            });
        }
        else if (section.footer) {
            section.footer.components.forEach((element: any) => {
                if (element.type == 'button') {
                    nextStepIds.push(...element.onClick.nextStep);
                }
            });
        }
    });
    return nextStepIds;
}


function AllInitialEdgesAndNodes(registerNodes: Map<string, any>): { initialEdges: any[]; initialNodes: any[] } {
    const initialEdges: any[] = [];
    const initialNodes: any[] = [];

    generateAllEdgesAndNodes(registerNodes, initialEdges, initialNodes, 'module_countryPicker', 0, 0);

    return { initialEdges, initialNodes };
}

function generateAllEdgesAndNodes(registerNodes: Map<string, any>, initialEdges: any[], initialNodes: any[], currentId: string, x: number, y: number): void {
    const currentNode = registerNodes.get(currentId);
    if (!currentNode) return;

    // Expected Node 
    // {
    //     id: 'n3',
    //     position: { x: 20, y: 20 },
    //     data: { label: 'Node 3' },
    //     type: 'input',
    // }
    initialNodes.push({
        id: currentNode.id,
        position:{ x, y },
        data: { label: currentNode.id },
    })
    

    // Edge looks like 
    //   {
    //     id: 'n1-n2',
    //     source: 'n1',
    //     target: 'n2',
    //     type: 'smoothstep',
    //     label: 'connects with',
    //    }
    if(currentNode.type == 'dynamic' || currentNode.type == 'form') {
        if (currentNode.nextStepObjects && currentNode.nextStepObjects.length > 0) {
            let tempy = y-30;
            let tempx = x-30;
            currentNode.nextStepObjects.forEach(element => {
                initialEdges.push({ 
                    id: `${currentId}-${element.id}`,
                    source: currentId,
                    target: element.id,
                    type: 'smoothstep'
                });
                generateAllEdgesAndNodes(registerNodes, initialEdges, initialNodes, element.id, tempx,tempy);
                tempx += 20;
            });
        }
    }
    // api 
    if(currentNode.type === 'api' && currentNode.type === 'document' || currentNode.url) {
        if (currentNode.nextStepObject) {
                initialEdges.push({
                id: `${currentId}-${currentNode.nextStepObject.id}`,
                source: currentId,
                target: currentNode.nextStepObject.id,
                type: 'smoothstep',
                label:'false'
               });
                generateAllEdgesAndNodes(registerNodes, initialEdges, initialNodes, currentNode.nextStepObject.id, x,y-30);
        }
    }
   // if conditions
    if(currentNode.if_trueObject) {
        initialEdges.push({
            id: `${currentId}-${currentNode.if_trueObject.id}`,
            source: currentId,
            target: currentNode.if_trueObject.id,
            type: 'smoothstep',
            label:'true'
        });
        generateAllEdgesAndNodes(registerNodes, initialEdges, initialNodes, currentNode.if_trueObject.id, x-30,y-30);
    }
    if(currentNode.if_falseObject) {
        initialEdges.push({
            id: `${currentId}-${currentNode.if_falseObject.id}`,
            source: currentId,
            target: currentNode.if_falseObject.id,
            type: 'smoothstep',
            label:'false'
        });
        generateAllEdgesAndNodes(registerNodes, initialEdges, initialNodes, currentNode.if_falseObject.id, x+30,y-30);
    }
}