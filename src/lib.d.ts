import { Block } from "./block";

export interface initOption {
    element: HTMLElement,
    width?: number,
    height?: number,
}

export interface newBlock {
    element?: HTMLElement,
    create?: boolean,
    inputs?: blockInput[]
}


export interface blockInput {
    type: string,
    value: Block | string | null,
    element: HTMLElement | null,
}

// 剩下的懒得写了！反正也没人用！