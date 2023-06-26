import { initOption } from "./interface";
import { draggable } from "./utils/drag";
import { addDropdown } from "./utils/combobox"
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
        addDropdown(newBlock);
    }
    removeBlock(delBlock: block): void{
        this.blocks.splice(this.blocks.indexOf(delBlock),1)
    }
    registerBlock(blockClass: any) {
        this.blockClasses[blockClass.name] = blockClass
    }
    
}
