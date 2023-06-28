declare module "src/utils/elem-offset" {
    const offset: (element: HTMLElement) => DOMRect;
    export default offset;
}
declare module "src/utils/drag" {
    import { Block } from "src/block";
    export function elementSolitary(element: HTMLElement, space: HTMLElement): void;
    export function getBoundingClientRect(element: HTMLElement, space: HTMLElement): {
        top: number;
        left: number;
    };
    export function draggable(newblock: Block): void;
}
declare module "src/utils/measure-distance" {
    const measureDistance: (element1: HTMLElement, element2: HTMLElement) => {
        dis: number;
        e1: DOMRect;
        e2: DOMRect;
    };
    export default measureDistance;
}
declare module "src/block" {
    import { newBlock, blockInput } from "src/interface";
    import { VisualBlock } from "src/index";
    export class Block {
        element: HTMLElement;
        inputs: {
            [id: string]: blockInput;
        };
        space: VisualBlock;
        parentInput: blockInput | null;
        draggableBlock: HTMLElement[];
        displayElement: HTMLElement;
        blockName: string;
        constructor(block: newBlock);
        getInput(): void;
        dragEnd(): void;
        dragStart(): void;
        private solitary;
        private enterInput;
        private getSmallestChild;
        private handleConnect;
        clone(first: boolean): Block;
        copy(first?: boolean): Block;
        delete(first?: boolean): void;
    }
    export class MoveBlock extends Block {
        constructor(block: newBlock);
        private create;
    }
}
declare module "src/interface" {
    import { Block } from "src/block";
    export interface initOption {
        element: HTMLElement;
        width?: number;
        height?: number;
    }
    export interface newBlock {
        element?: HTMLElement;
        create?: boolean;
        inputs?: blockInput[];
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
}
declare module "src/utils/combobox" {
    import { Block } from "src/block";
    export const addDropdown: (newblock: Block) => void;
}
declare module "src/index" {
    import { initOption } from "src/interface";
    import * as blocks from "src/block";
    export class VisualBlock {
        element: HTMLElement;
        blocks: blocks.Block[];
        blockClasses: {
            [key: string]: any;
        };
        constructor(option: initOption);
        addBlock(newBlock: blocks.Block): void;
        removeBlock(delBlock: blocks.Block): void;
        registerBlock(blockClass: any): void;
    }
}
