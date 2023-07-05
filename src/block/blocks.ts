import { Block,blockType,ConnectType } from "./block";
import { BlockConnectType, newBlock } from "./interface";

abstract class Reporter extends Block {
    constructor(block: newBlock) {
        super(block)
    }
    public enterInputCheack(targetBlock:Block,inputId:string):ConnectType{
        if (![blockType.singleInput,blockType.input].includes(targetBlock.inputs[inputId].type)) {
            return ConnectType.prevent
        }
        return ConnectType.kick
    }
    abstract create(): void;
}


export class AddBlock extends Reporter {
    prohibitBlock = true
    hat = false
    constructor(block: newBlock) {
        block.inputs = {
            "number1": {
                type: blockType.input,
            },
            "number2": {
                type: blockType.input,
            }
        }
        block.blockType = "AddBlock"
        super(block)
    }
    public create() {
        this.element.innerHTML =
            `
            <div id="block-display" drag="true" class="block-line green block-round">
                <div class="block-input" id="input-number1" drag="true"></div>
                <p class="block-text" drag="true">+</p>
                <div class="block-input" id="input-number2" drag="true"></div>
            </div>
            `.replace(' ', '')
    }
}


export class StartBlock extends Block {
    defaultInsert = "next"
    hat = true
    constructor(block: newBlock) {
        block.inputs = {
            "next": {
                type: blockType.next,
            }
        }
        block.blockType = "StartBlock"
        super(block)
    }
    public create() {
        this.element.innerHTML =
            `
            <div id="block-display" drag="true" class="block-line block-hat yellow">
                <p class="block-text" drag="true">程序开始运行</p>
            </div>
            <div class="next-input" id="input-next"></div>
            `.replace(' ', '')
    }
}

export class MoveBlock extends Block {
    defaultInsert = "next"
    hat = false
    constructor(block: newBlock) {
        block.inputs = {
            "y": {
                type: blockType.input,
            },
            "x": {
                type: blockType.input,
            },
            "next": {
                type: blockType.next,
            }
        }
        block.blockType = "MoveBlock"
        super(block)
    }
    public create() {
        this.element.innerHTML =
            `
            <div id="block-display" drag="true" class="block-line blue">
                <p class="block-text" drag="true">移动到</p>
                <div class="block-input" id="input-x" drag="true"></div>
                <div class="block-input" id="input-y" drag="true"></div>
            </div>
            <div class="next-input" id="input-next"></div>
            `.replace(' ', '')
    }
}

export class IfBlock extends Block {
    defaultInsert = "if"
    hat = false
    constructor(block: newBlock) {
        block.inputs = {
            "condition": {
                type: blockType.input,
            },
            "if": {
                type: blockType.method,
            },
            "else": {
                type: blockType.method,
            },
            "next": {
                type: blockType.next,
            }
        }
        block.blockType = "IfBlock"
        super(block)
    }
    public create() {
        this.element.innerHTML =
            `
            <div id="block-display" drag="true" class="yellow"> 
                <div class="block-line block-method">
                    <p class="block-text" drag="true">如果</p>
                    <div class="block-input" id="input-condition" drag="true"></div>
                    <p class="block-text" drag="true">那么</p>
                </div>
                <div class="block-block-input" id="input-if" drag="true"></div>
                
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