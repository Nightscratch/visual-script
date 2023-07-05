import { VisualBlock } from '../block';
import { BlockContainer, BlockManager } from '../block-manager/index'
import spriteHtml from "./sprite.html?raw"
import strToElem from '../utils/str-to-elem';
interface ISprite {
    block?: BlockContainer;
    spriteName: string;
}

export class Sprite {
    block: BlockContainer
    spriteName: string
    element: HTMLElement
    constructor(opt: ISprite) {
        if (opt.block instanceof BlockContainer) {
            this.block = opt.block
        } else {
            this.block = new BlockContainer()
        }

        this.element = strToElem(spriteHtml)
        this.setName(opt.spriteName)
    }
    setOnClick(onclick: { (e: MouseEvent): void }) {
        this.element.addEventListener('click', (e) => onclick(e))
    }
    setName(newName: string) {
        this.spriteName = newName;
        (this.element.querySelector('#name') as HTMLElement).innerText = this.spriteName;
    }
    remove() {
        this.element.remove()
    }
}

interface ISpriteManager {
    sprites: Sprite[]
    blockManager: BlockManager
    element: HTMLElement
}

export class SpriteManager {
    sprites: Sprite[]
    blockManager: BlockManager
    selectedSprite: Sprite | null
    element: HTMLElement

    constructor(opt: ISpriteManager) {
        this.sprites = opt.sprites
        this.blockManager = opt.blockManager
        this.element = opt.element
        this.autoSelectSprite()
    }
    addSprite(newSprite: Sprite) {
        this.sprites.push(newSprite)
        this.element.appendChild(newSprite.element)
        newSprite.setOnClick((e) => {
            let id = (e.target as HTMLElement).getAttribute('id')
            if (id == 'del') {
                this.removeSprite(newSprite)
            } else if (id == 'rename') {
                this.setSpriteName(String(prompt('取名', newSprite.spriteName)), newSprite)
            }
            else {
                this.setSelectedSprite(newSprite)
            }
        })
        this.autoSelectSprite()
    }
    setSpriteName(name: string, sprite: Sprite): void {
        for (const sprite of this.sprites) {
            if (sprite.spriteName == name) {
                alert(`已有名叫${name}的角色了`)
                return undefined;
            }
        }
        sprite.setName(name)
    }
    autoSelectSprite() {
        if (this.sprites.length == 0) {
            this.setSelectedSprite(null)
        } else {
            this.setSelectedSprite(0)
        }
    }
    save() {
        if (this.selectedSprite) {
            this.selectedSprite.block.load(this.blockManager.space)
        }
    }
    removeSprite(removeSprite: Sprite) {
        removeSprite.remove()
        this.sprites.splice(this.sprites.indexOf(removeSprite), 1)
        if (this.selectedSprite == removeSprite && this.sprites.length == 0) {
            this.autoSelectSprite()
        }
    }
    setSelectedSprite(target: number | Sprite | null) {
        let Starget: Sprite | null = null;
        if (this.selectedSprite) {
            this.selectedSprite.block.load(this.blockManager.space)
            this.selectedSprite.element.classList.remove('sprite-active');
        }

        if (typeof target === 'number') {
            Starget = this.sprites[target];
        } else if (target instanceof Sprite) {
            Starget = target;
        } else {
            this.selectedSprite = null;
            this.blockManager.empty();
            return;
        }

        Starget.element.classList.add('sprite-active');
        this.selectedSprite = Starget;
        this.blockManager.load(Starget.block);
    }
}