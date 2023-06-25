import { initOption } from "./interface";
import { draggable } from "./utils/drag";
import { block } from "./block";

export class VisualBlock {
    public element: HTMLElement;
    public blocks: block[] = [];
    public blockClasses: { [key: string]: any } = {};

    constructor(option: initOption) {
        this.element = option.element
    }
    addBlock(newBlock: block): void {
        newBlock.space = this;
        this.blocks.push(newBlock);
        this.element.appendChild(newBlock.element);
        draggable(newBlock);
    }
    registerBlock(blockClass: any) {
        this.blockClasses[blockClass.name] = blockClass
    }
}
