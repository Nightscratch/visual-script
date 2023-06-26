import { newBlock, blockInput } from "./interface";
import { VisualBlock } from "./index";
export declare class Block {
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
    clone(): Block;
    copy(first?: boolean): Block;
    delete(first?: boolean): void;
}
export declare class MoveBlock extends Block {
    constructor(block: newBlock);
    private create;
}
