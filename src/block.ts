import { newBlock, blockInput } from "./interface";
import { solitary } from "./utils/drag";
import measureDistance from "./utils/measure-distance";
import { VisualBlock } from "./index";

interface BlockConnectType {
    down: Block | null;
    distance: number;
    inputId: string;
    block: Block;
}

export class Block {
    public element: HTMLElement
    public inputs: { [id: string]: blockInput }
    public space: VisualBlock 
    public parentInput: blockInput | null = null
    public draggableBlock: HTMLElement[] = []
    public displayElement: HTMLElement
    public blockName: string ;

    constructor(block: newBlock) {
        if (!block.create && block.element) this.element = block.element
    }
    public getInput() {
        Object.keys(this.inputs).forEach((id: keyof typeof this.inputs) => {
            this.inputs[id].element = this.element.querySelector(`[id="input-${id}"]`)!;
        });
        this.draggableBlock = Array.from(this.element.querySelectorAll(`[drag="true"]`));
        this.displayElement = this.element.querySelector(`[id="block-display"]`) as HTMLElement
    }
    public dragEnd(): void {
        const smallestChild = this.getSmallestChild();
        const captureInput: BlockConnectType[] = [];

        for (const targetBlock of this.space.blocks) {
            if (targetBlock != this) {
                for (const [inputId, input] of Object.entries(targetBlock.inputs)) {
                    const dis = measureDistance(input.element as HTMLElement, this.element);
                    if (dis.dis < 25) {
                        captureInput.push({
                            inputId: inputId,
                            distance: dis.dis,
                            block: targetBlock,
                            down: null
                        });
                    } else if (inputId === "next" && !targetBlock.parentInput) {
                        const dis2 = measureDistance(targetBlock.element, smallestChild.element);
                        if (Math.abs(dis2.e1.left - dis2.e2.left) < 25 && Math.abs(dis2.e1.top - dis2.e2.bottom) < 25) {
                            captureInput.push({
                                inputId: inputId,
                                distance: dis.dis,
                                block: targetBlock,
                                down: smallestChild
                            });
                        }
                    }
                }
            }
        }
        if (captureInput.length > 0) {
            const target = captureInput.reduce((smallest: BlockConnectType, current: BlockConnectType) => {
                return current.distance < smallest.distance ? current : smallest;
            });
            this.handleConnect(target.block.inputs[target.inputId], target);
        }
    }
    public dragStart(): void {
        this.element.classList.remove('input-block');
        this.space.element.appendChild(this.element);
        if (this.parentInput) {
            this.parentInput.value = null
        }
        this.parentInput = null;
    }
    // 将该积木脱离输入
    private solitary(): void {
        if (this.parentInput) {
            this.parentInput.value = null
        }
        solitary(this.element, this.space.element);
        this.dragStart();
    }
    // 将该积木放入输入
    private enterInput(input: blockInput): void {
        (input.value as unknown as Block) = this;
        (input.element as HTMLElement).appendChild(this.element);
        this.element.classList.add('input-block');
        this.parentInput = input;
    }
    private getSmallestChild(): this {
        let sblock: this = this;
        while (sblock.inputs.next.value instanceof Block) {
            sblock = sblock.inputs.next.value as unknown as this;
        }
        return sblock;
    }
    private handleConnect(input: blockInput, target: BlockConnectType): void {
        if (target.down && target.block != this) {
            target.block.enterInput(target.down.inputs.next)
        } else {
            let insert: Block | null = null;
            if (input.value) {
                insert = input.value as unknown as Block;
                insert.solitary();
            }
            this.enterInput(input)
            if (insert && this.inputs.next) {
                (insert as Block).enterInput(this.getSmallestChild().inputs.next)
            }
        }
    }
    public clone(): Block {
        return new this.space.blockClasses[this.constructor.name]({ create: true });
    }
    public copy(first = true): Block {
        if (first) {
            this.parentInput = null
        }
        let clone: Block = this.clone()
        this.space.addBlock(clone)
        Object.keys(this.inputs).forEach(inputId => {
            if (this.inputs[inputId].value instanceof Block) {
                console.log(this.inputs[inputId])
                let inputClone: Block = (this.inputs[inputId].value as unknown as Block).copy(false);
                (clone.inputs[inputId].value as unknown as Block) = inputClone;
                inputClone.enterInput(clone.inputs[inputId]);
            } else {
                clone.inputs[inputId].value = this.inputs[inputId].value;
            }
        });

        return clone
    }
    public delete(first = true): void {
        if (first) {
            this.element.remove()
        }
        if (this.parentInput) {
            this.parentInput.value = null
        }
        this.space.removeBlock(this)
        Object.keys(this.inputs).forEach(inputId => {
            if (this.inputs[inputId].value instanceof Block) {
                (this.inputs[inputId].value as unknown as Block).delete(false)
            }
        });
    }
}

export class MoveBlock extends Block {
    constructor(block: newBlock) {
        super(block)
        this.inputs = {
            "step": {
                type: "input",
                value: null,
                element: null,
            },
            "next": {
                type: "next",
                value: null,
                element: null,
            }
        }
        this.blockName = 'moveBlock'
        this.create()
    }
    private create() {
        this.element = document.createElement('div')
        this.element.setAttribute('class', 'block')
        this.element.innerHTML =
            `
        <div id="block-display" drag="true">
            <p class="block-text" drag="true">action</p>
            <div class="block-input" id="input-step"></div>
        </div>
        <div class="next-input" id="input-next"></div>
        `.replace(' ', '')
        this.getInput()
    }
}