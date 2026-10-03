export type AIRequestContext={locale:'ar'|'en';orgId:string;userId:string;};

export type AIAnswer={text:string;links:Array<{label:string;href:string}>;data?:unknown;provider:'local'|'external'};

export interface AIProvider{
 readonly id:string;
 answer(question:string,context:AIRequestContext):Promise<AIAnswer>;
}
