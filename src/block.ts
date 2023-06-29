import { newBlock, blockInput, blockJson } from "./interface";
import { elementSolitary, getBoundingClientRect } from "./utils/drag";
import measureDistance from "./utils/measure-distance";
import { VisualBlock } from "./index";

enum blockType {
    method = 0,
    next = 1,
    input = 2
}

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
    public defaultInsert: string

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
        this.defaultInsert = block.defaultInsert
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
                    }
                }
                for (const [inputId, input] of Object.entries(this.inputs)) {
                    if ([blockType.next,blockType.method].includes(input.type) && !targetBlock.parentInput) {
                        let thisTarget;
                        let downTarget;
                        if (input.type==blockType.next) {
                            thisTarget = smallestChild
                            downTarget = smallestChild
                        }else{
                            thisTarget = this.inputs[inputId]
                            downTarget = this
                        }
                        let dis = measureDistance(targetBlock.element, thisTarget.element!);
                        if (Math.abs(dis.e1.left - dis.e2.left) < 25 && Math.abs(dis.e1.top - dis.e2.bottom) < 25) {
                            captureInput.push({
                                inputId: inputId,
                                distance: dis.dis,
                                block: targetBlock,
                                down: downTarget
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
        this.space.blockSpace.appendChild(this.element);
        this.detachFromParent()
    }
    // 将该积木脱离输入
    private solitary(): void {
        this.detachFromParent()
        elementSolitary(this.element, this.space.blockSpace);
        this.dragStart();
    }
    // 将该积木放入输入
    private enterInput(input: blockInput): void {
        (input.element as HTMLElement).appendChild(this.element);
        this.element.classList.add('input-block');
        this.parentInput = input;
        input.value = this as Block;
    }
    private getSmallestChild(key:string='next'): this {
        let sblock: this = this;
        while (sblock.inputs[key].value instanceof Block) {
            sblock = sblock.inputs[key].value as unknown as this;
            key = 'next'
        }
        return sblock;
    }
    private handleConnect(input: blockInput, target: BlockConnectType): void {
        if (target.down && target.block != this) {
            
            target.block.enterInput(target.down.inputs[target.inputId])
        } else {
            let insert: Block | null = null;
            if (input.value) {
                
                insert = input.value as unknown as Block;
                insert.solitary();
            }
            this.enterInput(input)
            if (insert && this.defaultInsert) {
                if (this.inputs[this.defaultInsert].type == blockType.method && !(this.inputs[this.defaultInsert].value instanceof Block)) {
                    (insert as Block).enterInput(this.inputs[this.defaultInsert])
                }else{
                    (insert as Block).enterInput(this.getSmallestChild().inputs.next)
                }
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
            //this.parentInput = null;
            const pos = getBoundingClientRect(this.element, this.space.blockSpace)
            cloneElement.style.left = `${pos.left + 25}px`;
            cloneElement.style.top = `${pos.top + 25}px`
        };
        let block = new this.space.blockClasses[this.constructor.name]({ create: false, element: cloneElement });
        if (first) {
            block.parentInput = null
        }
        /*
        另外一种方法
        let block = new this.space.blockClasses[this.constructor.name]({ create: true });
        */
        return block
    }
    public copy(first = true): Block {
        let clone: Block = this.clone(first)
        this.space.addBlock(clone)
        
        Object.keys(this.inputs).forEach(inputId => {
            if (this.inputs[inputId].value instanceof Block) {
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
    public toJson(first=true):blockJson{
        let json:blockJson = {
            blockType:this.constructor.name,
            inputs:{}
        }
        if (first) {
            json.left = parseInt(this.element.style.left)
            json.top = parseInt(this.element.style.top)
        }
        this.saveProperties(json)
        Object.keys(this.inputs).forEach(inputId => {
            if (this.inputs[inputId].value instanceof Block) {
                json.inputs[inputId] = { 
                    type:'block',
                    value:(this.inputs[inputId].value as Block).toJson(false)
                };

            } else  if (this.inputs[inputId].value instanceof String) {
                json.inputs[inputId] = {
                    type:'text',
                    value:this.inputs[inputId].value as string
                };
            }
        });

        return json
    }
    public saveProperties(json:blockJson){}
    public loadProperties(json:blockJson){}

    public loadInputs(blockData:blockJson,first:boolean = true):Block{
        if (first) {
            this.element.style.left = `${blockData.left}px`
            this.element.style.top = `${blockData.top}px`
        }
        this.loadProperties(blockData)
        for (const [inputId,input] of Object.entries(blockData.inputs)) {
            if (input.type == 'block') {
                let newBlockData = (input.value as blockJson)
                let newBlock = new this.space.blockClasses[newBlockData.blockType]({ create: true });
                this.space.addBlock(newBlock)
                if (input.value) {
                    newBlock.loadInputs(input.value,false).enterInput(this.inputs[inputId])
                }
            } else {
                
            }
        }
        return this
    }
}

export class MoveBlock extends Block {
    constructor(block: newBlock) {
        block.inputs = {
            "y": {
                type: blockType.input,
                value: null,
                element: null,
            },
            "x": {
                type: blockType.input,
                value: null,
                element: null,
            },
            "next": {
                type: blockType.next,
                value: null,
                element: null,
            }
        }
        block.defaultInsert = "next"
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
                type: blockType.input,
                value: null,
                element: null,
            },
            "if": {
                type: blockType.method,
                value: null,
                element: null,
            },
            "else": {
                type: blockType.method,
                value: null,
                element: null,
            },
            "next": {
                type: blockType.next,
                value: null,
                element: null,
            }
        }
        block.defaultInsert = "if"
        super(block)
    }
    public create() {
        this.element = document.createElement('div')
        this.element.setAttribute('class', 'block')
        this.element.innerHTML =
            `
            <div id="block-display" drag="true">
                <div class="block-line block-method">
                    <p class="block-text" drag="true">如果</p>
                    <div class="block-input" id="input-condition"></div>
                    <p class="block-text" drag="true">那么</p>
                </div>
                <div class="block-block-input" id="input-if"></div>
                
                <div class="block-line block-method">
                    <p class="block-text" drag="true">否则</p>
                </div>
                <div class="block-block-input" id="input-else"></div>
                <div class="block-line block-method">
                    <p class="block-text" drag="true">end</p>
                </div>
            </div>
            <div class="next-input" id="input-next"></div>
            `.replace(' ', '')
    }
}