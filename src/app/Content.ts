export type ContentParams = {
    text: string | Array<ContentParams>;
    colSpan?:number;
    fontSize?:number;
    lineHeight?:number;
    color?:string;
    background?:string;
    alignment?:string;
    decoration?:string;
    bold?:boolean;
    fillColor?:string;
}

export class Content {
    constructor(public params: ContentParams){}
}