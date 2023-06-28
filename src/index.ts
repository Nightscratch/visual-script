import { initOption,blockJson } from "./interface";
import { draggable } from "./utils/drag";
import { addDropdown } from "./utils/combobox"
import * as blocks from "./block";

export class VisualBlock {
    public element: HTMLElement;
    public blocks: blocks.Block[] = [];
    public blockClasses: { [key: string]: any } = {};

    constructor(option: initOption) {
        this.element = option.element
        this.registerBlock(blocks.MoveBlock)
        this.registerBlock(blocks.IfBlock)

    }
    public addBlock(newBlock: blocks.Block): void {
        newBlock.space = this;
        this.blocks.push(newBlock);
        this.element.appendChild(newBlock.element);
        draggable(newBlock);
        addDropdown(newBlock);
    }
    public removeBlock(delBlock: blocks.Block): void {
        this.blocks.splice(this.blocks.indexOf(delBlock), 1)
    }
    public registerBlock(blockClass: any) {
        this.blockClasses[blockClass.name] = blockClass
    }
    public load(data:blockJson[]) {
        return new Promise<void>((resolve, reject) => {
            for (const block of data) {
                let newblock = new this.blockClasses[block.type]({ create: true });
                newblock.loadInputs()
                this.addBlock(newblock)
            }
            resolve()
        })
    }
    public save() {
        return new Promise((resolve, reject) => {
            let res = []
            for (const [blockName, block] of Object.entries(this.blocks)) {
                if (!block.parentInput) { // 是父节点
                    res.push(block.toJson())
                }
            }
            resolve(res)
        })
    }


}