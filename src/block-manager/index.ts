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
    empty(){
        this.space.blocks = []
        this.space.blockSpace.innerHTML = '' 
    }
}
export class BlockContainer implements NewBlockContainer {
    public element: HTMLElement[] = []
    public block: Block[] = []

    constructor() {}

    load(space:VisualBlock){
        
        this.block = space.blocks
        console.log("space.blockSpace.childNodes",space.blockSpace.childNodes)
        space.blockSpace.childNodes.forEach((element)=>{
            console.log(element)
            this.element.push(element as HTMLElement)
        })
    }
    compile(): Promise<string> {
        return new Promise((resolve) => {
            let res = ''
            for (const [blockName, block] of Object.entries(this.block)) {
                if (!block.parentInput) { // 是父节点
                    res += block.toCode(true)
                }
            }
            resolve(res)
        })
    }
}