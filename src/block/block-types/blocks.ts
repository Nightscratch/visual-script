import { Block, blockType, ConnectType } from "../block";
import { BlockConnectType, newBlock } from "../interface";
import * as html from "./html"

abstract class Reporter extends Block {
    hat = false
    constructor(block: newBlock) {
        super(block)
    }
    public enterInputCheack(targetBlock: Block, inputId: string): ConnectType {
        if (!blockType.input == targetBlock.inputs[inputId].type) {
            return ConnectType.prevent
        }
        return ConnectType.kick
    }
    abstract compile(arg: { [id: string]: string }): string
}


export class AddBlock extends Reporter {
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
    public compile(arg: { [id: string]: string }): string {
        return `(${arg.number1} + ${arg.number2})`
    }
}
export class NumberBlock extends Reporter {
    constructor(block: newBlock) {
        block.inputs = {}
        block.blockType = "NumberBlock"
        super(block)
    }

    static baseHtml = html.block('green', [
        html.line(false, [
            html.text('int('),
            html.textInput(),
            html.text(')'),
        ])
    ])
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
    /*public create() {
        this.element.innerHTML =
            `
            <div id="block-display" drag="true" class="block-line blue">
                <p class="block-text" drag="true">移动到</p>
                <div class="block-input" id="input-x" drag="true"></div>
                <div class="block-input" id="input-y" drag="true"></div>
            </div>
            <div class="next-input" id="input-next"></div>
            `.replace(' ', '')
    }*/
    static baseHtml = html.block('blue', [
        html.line(false, [
            html.text('移动'),
            html.br(),
            html.input('x'),
            html.br(),
            html.input('y'),
        ])
    ])

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
    /*public create() {
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
    }*/
    static baseHtml = html.block('yellow', [
        html.line(true, [
            html.text('如果'),
            html.input('condition'),
            html.text('那么'),
        ]),
        html.method('if'),
        html.line(true, [html.text('否则'),]),
        html.method('else'),
        html.line(true, [html.text('end'),]),
    ])

    public compile(arg: { [id: string]: string }): string {
        return ''
    }
}