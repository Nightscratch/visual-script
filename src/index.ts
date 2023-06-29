import { initOption,blockJson } from "./interface";
import { draggable,backGroundDrag } from "./utils/drag";
import { addBlockDropdown,DropDown,addSpaceDropdown } from "./utils/combobox"
import { createZoomBtn } from "./utils/zoom-button"
import * as blocks from "./block";

export class VisualBlock {
    public element: HTMLElement;
    public blocks: blocks.Block[] = [];
    public blockClasses: { [key: string]: any } = {};
    public dropDown:DropDown
    public scrollPlaceholder:HTMLElement
    public zoom:number=1
    public blockSpace:HTMLElement

    constructor(option: initOption) {
        this.element = option.element
        this.registerBlock(blocks.MoveBlock)
        this.registerBlock(blocks.IfBlock)

        this.element.appendChild(createZoomBtn([
            {text:'＋',click:()=>{
                this.zoom += 0.4
                this.setZoom()
            }},
            {text:'＝',click:()=>{
                this.zoom = 1
                this.setZoom()
            }},
            {text:'－',click:()=>{
                this.zoom -= 0.4
                this.setZoom()
            }},
        ]));

        this.scrollPlaceholder = document.createElement('div')
        this.scrollPlaceholder.classList.add('placeholder')
        this.element.append(this.scrollPlaceholder)

        this.blockSpace = document.createElement('div')
        this.element.appendChild(this.blockSpace)

        this.dropDown = new DropDown()
        document.body.appendChild(this.dropDown.element)
        addSpaceDropdown(this)
        backGroundDrag(this)

        this.setZoom()
    }
    public setZoom(zoom:number=this.zoom){
        this.zoom = Math.min(Math.max(zoom,0.5),2.5)
        this.blockSpace.setAttribute('style',`zoom:${this.zoom}`)
        this.scrollPlaceholder.setAttribute('style',`zoom:${this.zoom}`)
    }
    public setPlaceholder(top:number,left:number){
        this.scrollPlaceholder.style.width = `${left/this.zoom}px`
        this.scrollPlaceholder.style.height = `${top/this.zoom}px`
    }
    public addBlock(newBlock: blocks.Block): void {
        newBlock.space = this;
        this.blocks.push(newBlock);
        this.blockSpace.appendChild(newBlock.element);
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
            this.blockSpace.innerHTML = ''
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