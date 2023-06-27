import { initOption } from "./interface";
import { draggable } from "./utils/drag";
import { addDropdown } from "./utils/combobox"
import * as blocks from "./block";

export class VisualBlock {
    public element: HTMLElement;
    public blocks: blocks.Block[] = [];
    public blockClasses: { [key: string]: any } = {};

    constructor(option: initOption) {
        this.element = option.element

        // 注册积木
        this.registerBlock(blocks.MoveBlock)
    }
    addBlock(newBlock: blocks.Block): void {
        newBlock.space = this;
        this.blocks.push(newBlock);
        this.element.appendChild(newBlock.element);
        draggable(newBlock);
        addDropdown(newBlock);
    }
    removeBlock(delBlock: blocks.Block): void{
        this.blocks.splice(this.blocks.indexOf(delBlock),1)
    }
    registerBlock(blockClass: any) {
        this.blockClasses[blockClass.name] = blockClass
    }
    
}