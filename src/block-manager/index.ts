import { VisualBlock } from "../block/index"
import { Block } from "../block/block"

interface NewBlockContainer{
    element: HTMLElement[]
    block: Block[]
}

export class BlockManager {
    public space:VisualBlock
    constructor(space:VisualBlock) {
        this.space = space
    }
    load(block:NewBlockContainer){
        console.log(block.element)
        this.space.blocks = block.block
        this.space.blockSpace.innerHTML = '' 
        block.element.forEach((element)=>{
            this.space.blockSpace.appendChild(element)
        })
    }
}
export class BlockContainer implements NewBlockContainer {
    public element: HTMLElement[] = []
    public block: Block[] = []

    constructor() {}

    load(space:VisualBlock){
        this.block = space.blocks
        space.blockSpace.childNodes.forEach((element)=>{
            this.element.push(element as HTMLElement)
        })
    }
}