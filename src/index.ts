import { initOption,blockJson } from "./interface";
import { draggable } from "./utils/drag";
import { addBlockDropdown,DropDown,addSpaceDropdown } from "./utils/combobox"
import * as blocks from "./block";

export class VisualBlock {
    public element: HTMLElement;
    public blocks: blocks.Block[] = [];
    public blockClasses: { [key: string]: any } = {};
    public dropDown:DropDown

    constructor(option: initOption) {
        this.element = option.element
        this.registerBlock(blocks.MoveBlock)
        this.registerBlock(blocks.IfBlock)
        this.dropDown = new DropDown()
        document.body.appendChild(this.dropDown.element)
        addSpaceDropdown(this,this.dropDown)
    }
    public addBlock(newBlock: blocks.Block): void {
        newBlock.space = this;
        this.blocks.push(newBlock);
        this.element.appendChild(newBlock.element);
        draggable(newBlock);
        addBlockDropdown(newBlock,this.dropDown);
    }
    public removeBlock(delBlock: blocks.Block): void {
        this.blocks.splice(this.blocks.indexOf(delBlock), 1)
    }
    public registerBlock(blockClass: any) {
        this.blockClasses[blockClass.name] = blockClass
    }
    public load(data:string): Promise<void> {
        return new Promise((resolve, reject) => {
            for (const block of JSON.parse(data) as blockJson[]) {
                let newblock = new this.blockClasses[block.blockType]({ create: true });
                this.addBlock(newblock)
                newblock.loadInputs(block,true)
            }
            resolve()
        })
    }
    public save():Promise<blockJson[]> {
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
    public clean():Promise<void>{
        return new Promise((resolve, reject) => {
            this.element.innerHTML = ''
            this.blocks = []
            resolve()
        })
    }
    public arrange():Promise<void>{
        // TODO:整理积木，垂直延申
        return new Promise((resolve, reject) => {
            let left = 10;
            let top = 10;
            for (const [blockName, block] of Object.entries(this.blocks)) {
                if (!block.parentInput) { // 是父节点
                    block.element.style.left =`${left}px`
                    block.element.style.top =`${top}px`
                    top += block.element.clientHeight + 10
                }
            }
            resolve()
        })
    }
}