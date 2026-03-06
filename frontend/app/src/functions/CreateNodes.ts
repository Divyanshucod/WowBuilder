import { APIModule, Condition, ConditionalVariable, FormModule, type BaseNode } from "./AllClasses";


const registerNodes: Map<string, BaseNode> = new Map();
const sdkResponsesNode: Map<string, string> = new Map();
export function GenerateNodes(schema: any) {
    
    schema.modules.forEach((module: any) => {
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