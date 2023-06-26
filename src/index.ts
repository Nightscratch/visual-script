import { initOption } from "./interface";
import { draggable } from "./utils/drag";
import { addDropdown } from "./utils/combobox"
import { Block } from "./block";

export class VisualBlock {
    public element: HTMLElement;
    public blocks: Block[] = [];
    public blockClasses: { [key: string]: any } = {};

    constructor(option: initOption) {
        this.element = option.element
    }
    addBlock(newBlock: Block): void {
        newBlock.space = this;
        this.blocks.push(newBlock);
        this.element.appendChild(newBlock.element);
        draggable(newBlock);
        addDropdown(newBlock);
    }
    removeBlock(delBlock: Block): void{
        this.blocks.splice(this.blocks.indexOf(delBlock),1)
    }
    registerBlock(blockClass: any) {
        this.blockClasses[blockClass.name] = blockClass
    }
    
}
