import { Block } from "./block";

export interface initOption {
    element: HTMLElement;
    width?: number;
    height?: number;
}

export interface newBlock {
    element?: HTMLElement;
    create?: boolean;
    inputs?: { [id: string]: blockInput };
    defaultInsert:string
}

export interface blockInput {
    type: any;
    value: Block | string | null;
    element: HTMLElement | null;
}

export interface BlockInputData {
    down: Block | null;
    distance: number;
    inputId: string;
    block: Block;
}

export interface blockJson{
    blockType:string,
    [id :string]:any,

    inputs:{[id: string]:{
        type: 'text' | 'block'
        value : blockJson | string | null
    }}
}

export interface BlockConnectType {
    down: Block | null;
    distance: number;
    inputId: string;
    block: Block;
}

export interface DropDownButton{
    text:string;
    click:() => void
}