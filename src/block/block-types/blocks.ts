import { Block, blockType, ConnectType } from "../block";
import { BlockConnectType, newBlock } from "../interface";
import * as html from "./html"

abstract class Reporter extends Block {
    constructor(block: newBlock) {
        super(block)
    }
    public enterInputCheack(targetBlock: Block, inputId: string): ConnectType {
        if (!blockType.input == targetBlock.inputs[inputId].type) {
            return ConnectType.prevent
        }
        return ConnectType.kick
    }
    abstract create(): void;
    abstract compile(arg: { [id: string]: string }): string
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

    static baseHtml = html.block('green', [
        html.line(false, [
            html.input('number1'),
            html.text('+'),
            html.input('number2')
        ])
    ])
    public create() {
        this.element.appendChild(AddBlock.baseHtml.cloneNode(true))
    }

    public compile(arg: { [id: string]: string }): string {
        return `(${arg.number1} + ${arg.number2})`
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
        this.element.appendChild(StartBlock.baseHtml.cloneNode(true))
        this.element.appendChild(html.next())
    }

    static baseHtml = html.block('block-line block-hat yellow', [
            html.text('当绿旗被点击时'),
    ])
    public compile(arg: { [id: string]: string }): string {
        return `function start(){${arg.next}}`
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
    public compile(arg: { [id: string]: string }): string {
        return ''
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
    public compile(arg: { [id: string]: string }): string {
        return ''
    }
}