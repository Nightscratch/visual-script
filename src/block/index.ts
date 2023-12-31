import { initOption, blockJson } from "./interface";
import { blockDraggable, backGroundDraggable } from "./utils/drag";
import { addBlockDropdown, DropDown, addSpaceDropdown } from "./utils/combobox"
import { createZoomBtn } from "./utils/zoom-button"
import { Block } from "./block";
export class VisualBlock {
    public element: HTMLElement;
    public blocks: Block[] = [];
    public blockClasses: { [key: string]: any } = {};
    public dropDown: DropDown
    public scrollPlaceholder: HTMLElement
    public zoom: number = 1
    public blockSpace: HTMLElement
    public leftMostBlock:Block
    public bottomMostBlock:Block


    constructor(option: initOption) {
        this.element = option.element
        option.zoomElement.appendChild(createZoomBtn([
            {
                text: '＋', click: () => {
                    this.zoom += 0.4
                    this.setZoom()
                }
            },
            {
                text: '＝', click: () => {
                    this.zoom = 1
                    this.setZoom()
                }
            },
            {
                text: '－', click: () => {
                    this.zoom -= 0.4
                    this.setZoom()
                }
            },
        ]));

        this.scrollPlaceholder = document.createElement('div')
        this.scrollPlaceholder.classList.add('placeholder')
        this.element.append(this.scrollPlaceholder)

        this.blockSpace = document.createElement('div')
        this.blockSpace.classList.add('block-container-space')
        this.element.appendChild(this.blockSpace);

        this.dropDown = new DropDown()
        document.body.appendChild(this.dropDown.element)
        addSpaceDropdown(this)
        backGroundDraggable(this)

        this.setZoom()
    }
    public setZoom(zoom: number = this.zoom) {
        this.zoom = Math.min(Math.max(zoom, 0.5), 2.5)
        this.blockSpace.setAttribute('style', `zoom:${this.zoom}`)
        this.scrollPlaceholder.setAttribute('style', `zoom:${this.zoom}`)
        this.setPlaceholder()
    }
    public setPlaceholder( ) {
        let scrollLeft = this.element.scrollLeft
        let scrollTop = this.element.scrollTop

        this.scrollPlaceholder.style.display = 'none'
        this.scrollPlaceholder.style.height = `${(this.element.scrollHeight + this.element.clientHeight/2)/this.zoom}px`
        this.scrollPlaceholder.style.width = `${(this.element.scrollWidth + this.element.clientWidth/2)/this.zoom}px`
        this.scrollPlaceholder.style.display = 'block'

        this.element.scrollLeft = scrollLeft
        this.element.scrollTop = scrollTop

    }
    public addBlock(newBlock: Block,dragging:Boolean=false): void {
        newBlock.space = this;
        this.blocks.push(newBlock);
        this.blockSpace.appendChild(newBlock.element);
        blockDraggable(newBlock,dragging);
        addBlockDropdown(newBlock, this.dropDown);
    }
    public removeBlock(delBlock: Block): void {
        // TODO:可用优化
        this.blocks.splice(this.blocks.indexOf(delBlock), 1)
    }
    public registerBlock(blockClass: any) {
        let j = new blockClass({create:true})
        this.blockClasses[j.blockType] = blockClass
    }
    public clean(): Promise<void> {
        return new Promise((resolve) => {
            this.blockSpace.innerHTML = ''
            this.blocks = []
            resolve()
        })
    }
    public arrange(): Promise<void> {
        // TODO:整理积木，垂直延申
        return new Promise((resolve, reject) => {
            let left = 10;
            let top = 10;
            for (const [blockName, block] of Object.entries(this.blocks)) {
                if (!block.parentInput) { // 是父节点
                    block.element.style.left = `${left}px`
                    block.element.style.top = `${top}px`
                    top += block.element.clientHeight + 10
                }
            }
            this.setPlaceholder();
            resolve()
        })
    }
}
