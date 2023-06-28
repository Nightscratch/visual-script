import { newBlock, blockInput } from "./interface";
import { elementSolitary, getBoundingClientRect } from "./utils/drag";
import measureDistance from "./utils/measure-distance";
import { VisualBlock } from "./index";

interface BlockConnectType {
    down: Block | null;
    distance: number;
    inputId: string;
    block: Block;
}

export abstract class Block {
    public element: HTMLElement
    public inputs: { [id: string]: blockInput }
    public space: VisualBlock
    public parentInput: blockInput | null = null
    public draggableBlock: HTMLElement[] = []
    public displayElement: HTMLElement
    constructor(block: newBlock) {
        if (!block.create && block.element) {
            this.element = block.element
        }
        if (block.inputs) {
            this.inputs = block.inputs
        }
        if (!this.element) {
            this.create()
        }
        this.getInput()
    }
    abstract create(): void
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
        this.detachFromParent()
    }
    // 将该积木脱离输入
    private solitary(): void {
        this.detachFromParent()
        elementSolitary(this.element, this.space.element);
        this.dragStart();
    }
    // 将该积木放入输入
    private enterInput(input: blockInput): void {
        (input.element as HTMLElement).appendChild(this.element);
        this.element.classList.add('input-block');
        this.parentInput = input;
        input.value = this as Block;
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
    private detachFromParent() {
        if (this.parentInput) {
            this.parentInput.value = null
        }
        this.parentInput = null;
    }
    public clone(first: boolean): Block {
        let cloneElement = this.element.cloneNode(true) as HTMLElement
        const inputElements = cloneElement.querySelectorAll('div[id^="input-"]');

        inputElements.forEach((inputElement) => {
            inputElement.innerHTML = ''
        });
        if (first) {
            cloneElement.classList.remove('input-block');
            this.parentInput = null;
            const pos = getBoundingClientRect(this.element, this.space.element)
            cloneElement.style.left = `${pos.left + 25}px`;
            cloneElement.style.top = `${pos.top + 25}px`
        };
        let block = new this.space.blockClasses[this.constructor.name]({ create: false, element: cloneElement });

        return block
    }
    public copy(first = true): Block {
        let clone: Block = this.clone(first)
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
        block.inputs = {
            "y": {
                type: "input",
                value: null,
                element: null,
            },
            "x": {
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
        super(block)
    }
    public create() {
        this.element = document.createElement('div')
        this.element.setAttribute('class', 'block')
        this.element.innerHTML =
            `
            <div id="block-display" drag="true" class="block-line">
                <p class="block-text" drag="true">移动到</p>
                <div class="block-input" id="input-x"></div>
                <div class="block-input" id="input-y"></div>
            </div>
            <div class="next-input" id="input-next"></div>
            `.replace(' ', '')
    }
}


export class IfBlock extends Block {
    constructor(block: newBlock) {
        block.inputs = {
            "condition": {
                type: "input",
                value: null,
                element: null,
            },
            "method": {
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
        super(block)
    }
    public create() {
        this.element = document.createElement('div')
        this.element.setAttribute('class', 'block')
        this.element.innerHTML =
            `
            <div id="block-display" drag="true">
                <div class="block-line">
                    <p class="block-text" drag="true">如果</p>
                    <div class="block-input" id="input-condition"></div>
                    <p class="block-text" drag="true">那么</p>
                </div>
                <div class="block-block-input" id="input-method"></div>
                
                <div class="block-line">
                    <p class="block-text" drag="true">end</p>
                </div>
                
                
            </div>
            <div class="next-input" id="input-next"></div>
            `.replace(' ', '')
    }
}