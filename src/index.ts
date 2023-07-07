import { VisualBlock } from "./block";
import { SpriteManager } from "./sprite";
import { Categorize, ToolBox } from "./tool-box"
import { Compiler } from "./compiler"
import { BlockManager } from "./block-manager";
import strToElem from "./utils/str-to-elem";
import * as blocks from "./block/block-types/blocks"
import { Packager } from "./packager/packager";
import { Sprite } from "./sprite"
import indexHtml from "./index.html?raw"

interface IPlayEngine{
    element:HTMLElement
}

export class PlayEngine {
    codeSpace: VisualBlock
    spriteManager: SpriteManager
    toolBox: ToolBox
    compiler: Compiler
    blockManager: BlockManager
    packager: Packager
    constructor(opt:IPlayEngine) {
        opt.element.appendChild(strToElem(indexHtml))
        this.codeSpace = new VisualBlock({
            element: document.getElementById('block-div')!,
            zoomElement: document.getElementById('zoom')!
        });
        this.blockManager = new BlockManager(this.codeSpace)
        this.spriteManager = new SpriteManager({
            element: document.getElementById('sprite-list')!,
            sprites: [],
            blockManager: this.blockManager
        })
        this.compiler = new Compiler(this)
        this.packager = new Packager(this)

        this.toolBox = new ToolBox({
            space: this.codeSpace,
            element: document.getElementById('tool-box')!,
            modelElement: document.getElementById('code-model')!,
            categorizes: [
                new Categorize({
                    categorizeName: '运动',
                    blocks: [
                        blocks.MoveBlock,
                    ]
                }),
                new Categorize({
                    categorizeName: '控制',
                    blocks: [
                        blocks.IfBlock,
                        blocks.StartBlock,
                    ]
                }),
                new Categorize({
                    categorizeName: '运算',
                    blocks: [
                        blocks.AddBlock,
                    ]
                })
            ]
        })
        for (const i in blocks) {
            this.codeSpace.registerBlock(blocks[i])
        }
        this.addEventLister()
    }
    addEventLister(){
        document.getElementById('add')!.addEventListener('click', () => {
            this.spriteManager.addSprite(new Sprite({ spriteName: '角色' + this.spriteManager.sprites.length }))
        })
        document.getElementById('run')!.addEventListener('click', () => {
            this.compiler.compile().then((d) => {
                console.log(d)
            })
        })
    }
}