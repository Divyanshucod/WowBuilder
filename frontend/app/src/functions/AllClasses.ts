export class BaseNode {
   id: string;
   reference: any
   // Common optional properties used across various node subclasses
   type?: string;
   subType?: string;
   url?: string;
   nextStepId?: string;
   nextStepIds?: string[];
   nextStepObject?: BaseNode;
   nextStepObjects?: BaseNode[];
   if_trueId?: string;
   if_falseId?: string;
   if_trueObject?: BaseNode;
   if_falseObject?: BaseNode;
   constructor() {
       this.id = '';
       this.reference = null
   }
}

export class APIModule extends BaseNode {
   type: string;
   subType: string;
   url: string;
   nextStepId?: string;
   nextStepObject?: BaseNode;
   reference: any;
   constructor(
   ) {
       super();
       this.id = '';
       this.type = '';
       this.subType = '';
       this.url = '';
       this.nextStepId = '';
       this.nextStepObject = undefined;
         this.reference = null;
   }
}

export class FormModule extends BaseNode {
   type: string;
   subType: string;
   nextStepIds: string[];
   nextStepObjects?: BaseNode[];
   reference: any;
   constructor(
   ) {
       super();
       this.id = '';
       this.type = '';
       this.subType = '';
       this.nextStepIds = [];
       this.nextStepObjects = [];
       this.reference = null;
   }
}

export class Condition extends BaseNode {
   if_trueId: string;
   if_falseId: string;
   if_trueObject?: BaseNode;
   if_falseObject?: BaseNode;
   rule?: string;
   reference: any;
   constructor() {
       super();
       this.id = '';
       this.if_trueId = '';
       this.if_falseId = '';
       this.if_trueObject = undefined;
       this.if_falseObject = undefined;
       this.reference = null;
   }
}

export class ConditionalVariable extends BaseNode {
   if_trueId: string;
   if_falseId: string;
   if_trueObject?: BaseNode;
   if_falseObject?: BaseNode;
   rule?: string;
   reference: any;
   constructor() {
       super();
       this.id = '';
       this.if_trueId = '';
       this.if_falseId = '';
       this.if_trueObject = undefined;
       this.if_falseObject = undefined;
       this.reference = null;
   }
}