import { initOption } from "./interface";
import { Block } from "./block";
export declare class VisualBlock {
    element: HTMLElement;
    blocks: Block[];
    blockClasses: {
        [key: string]: any;
    };
    constructor(option: initOption);
    addBlock(newBlock: Block): void;
    removeBlock(delBlock: Block): void;
    registerBlock(blockClass: any): void;
}
