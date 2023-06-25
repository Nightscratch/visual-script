import { newBlock, blockInput, initOption } from "./interface";
import { solitary } from "./utils/drag";
import measureDistance from "./utils/measure-distance";
import { VisualBlock } from "./index";

export class block {
    public element: HTMLElement
    public inputs: { [id: string]: blockInput }
    public space: VisualBlock
    public parentInput: blockInput | null = null
    public draggableBlock: HTMLElement[] = []
    public displayElement: HTMLElement
    public blockName: string

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
        console.log("dragEnd");
        interface BlockInputData {
            dis: number;
            id: string;
            block: block;
        }
        const distance: BlockInputData[] = [];
        this.space.blocks.forEach((block) => {
            if (block !== this) {
                Object.entries(block.inputs).forEach(([id, input]) => {
                    const dis = measureDistance(input.element as HTMLElement, this.element);
                    if (dis < 25) {
                        distance.push({
                            dis,
                            id,
                            block,
                        });
                    }
                });
            }
        });
        if (distance.length > 0) {
            const target = distance.reduce((smallest: BlockInputData, current: BlockInputData) => {
                return current.dis < smallest.dis ? current : smallest;
            });
            this.handleConnect(target.id, target.block.inputs[target.id], target.block);
        }
    }

    public dragStart(): void {
        this.element.classList.remove('input-block');
        this.space.element.appendChild(this.element);
        if (this.parentInput) {
            this.parentInput.value = null
        }
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
        input.value = this;
        (input.element as HTMLElement).appendChild(this.element);
        this.element.classList.add('input-block');
        this.parentInput = input;

    }
    private getSmallestChild(): this {
        let sblock: this = this;

        while (sblock.inputs.next.value instanceof block) {
            sblock = sblock.inputs.next.value as this;
        }
        return sblock;
    }
    private handleConnect(inputId: string, input: blockInput, block: block) {
        let insert: block | null = null;
        if (input.value) {
            insert = input.value as block;
            insert.solitary();
        }
        this.enterInput(input)
        if (insert && this.inputs.next) {
            (insert as block).enterInput(this.getSmallestChild().inputs.next)
        }

    }
    public clone(): block {
        return new this.space.blockClasses[this.constructor.name]({ create: true });
    }
    public copy(first = true): block {
        console.log("复制积木", this.element, this.inputs)
        if (first) {
            this.parentInput = null
        }
        let clone: block = this.clone()
        this.space.addBlock(clone)
        Object.keys(this.inputs).forEach(inputId => {
            if (this.inputs[inputId].value instanceof block) {
                console.log(this.inputs[inputId])
                let inputClone: block = (this.inputs[inputId].value as block).copy(false);
                clone.inputs[inputId].value = inputClone;
                inputClone.enterInput(clone.inputs[inputId]);
            } else {
                clone.inputs[inputId].value = this.inputs[inputId].value;
            }
        });

        return clone
    }
    public delete(): void {

    }
}

export class moveBlock extends block {
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