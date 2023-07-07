import { Block } from "../block/block";
import toolBoxHtml from "./tool-box.html?raw"
import strToElem from '../utils/str-to-elem';
import { VisualBlock } from "../block";
import { move } from "../block/utils/drag"


interface IToolBox{
    categorizes?:Categorize[]
    element:HTMLElement
    modelElement:HTMLElement
    space:VisualBlock
}

export class ToolBox{
    categorizes:Categorize[] = []
    element:HTMLElement
    modelElement:HTMLElement
    selectedCategorize:Categorize
    space:VisualBlock

    constructor(opt:IToolBox){
        this.element = opt.element
        this.modelElement = opt.modelElement
        this.space = opt.space
        if (opt.categorizes) {
            opt.categorizes.forEach((c)=>{
                this.addCategorize(c)
            })
            this.selectedCategorize = opt.categorizes[0]
            this.setModel()
        }
    }
    setModel(){
        if (this.selectedCategorize) {
            this.modelElement.innerHTML = ''
            for (const block of this.selectedCategorize.blocks) {
                // block是抽象类的派生类
                let b = new (block as any)({create: true})
                b.element.classList.add('model-block')
                this.modelElement.appendChild(b.element)
                console.log("b.element",b.element)
                b.element.addEventListener('mousedown',(e)=>{
                    let newb = new (block as any)({create: true})
                    let react = b.element.getBoundingClientRect()
                    move(newb.element,this.space.element,react.left,react.top)
                    this.space.addBlock(newb,true)
                })
            }
        }
    }
    addCategorize(newCategorize:Categorize){
        this.categorizes.push(newCategorize)
        newCategorize.element.addEventListener('click',()=>{
            this.selectedCategorize = newCategorize
            this.setModel()
        })
        this.element.appendChild(newCategorize.element)
    }
}

interface Icategorize{
    categorizeName:string;
    blocks:typeof Block[]
}

export class Categorize{
    categorizeName:string;
    blocks:typeof Block[];
    element:HTMLElement
    constructor(opt:Icategorize){
        this.blocks = opt.blocks
        this.element = strToElem(toolBoxHtml)
        this.setName(opt.categorizeName)
    }
    setName(newName: string) {
        this.categorizeName = newName;
        (this.element.querySelector('#btn') as HTMLElement).innerText = this.categorizeName;
    }
}

/*

interface Icategorize{
    categorizeName:string;
    blocks:Block[]
}

export class categorize implements Icategorize{
    categorizeName:string;
    blocks:Block[]
    constructor(opt:Icategorize){

    }
}
 */