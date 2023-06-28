
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
    type: string;
    value: Block | string | null;
    element: HTMLElement | null;
}

export interface BlockInputData {
    down: Block | null;
    distance: number;
    inputId: string;
    block: Block;
}
