import { Block } from "./block";
import { blockInput,BlockConnectType } from "./interface";
import measureDistance from "./utils/measure-distance"

// 积木的不同输入口，这个写的还不是特别还待改进
// TODO:改进
export class blockInputType{
    enterInput(slef:Block,input:blockInput){
        (input.element as HTMLElement).appendChild(slef.element);
        slef.element.classList.add('input-block');
        slef.parentInput = input;
        input.value = slef as Block;
    }
    insert(self:Block,smallestChild:Block,target:BlockConnectType,insert:Block){
        debugger
        insert.enterInput(smallestChild.inputs[smallestChild.defaultInsert])
    }
}


export class blockNextInputType extends blockInputType{
    findChild(self:Block,inputId:string,input:blockInput,targetBlock:Block,smallestChild:Block,captureInput:BlockConnectType[]){
        if (!targetBlock.parentInput) {
            let dis = measureDistance(targetBlock.element, smallestChild.element!);
            if (Math.abs(dis.e1.left - dis.e2.left) < 25 && Math.abs(dis.e1.top - dis.e2.bottom) < 25) {
                captureInput.push({
                    inputId: inputId,
                    distance: dis.dis,
                    block: targetBlock,
                    down: smallestChild
                })
            }
        }
    }
}

export class blockMethodInputType extends blockInputType{
    findChild(self:Block,inputId:string,input:blockInput,targetBlock:Block,smallestChild:Block,captureInput:BlockConnectType[]){
        if (!targetBlock.parentInput) {
            let dis = measureDistance(targetBlock.element, self.inputs[inputId].element!);
            if (Math.abs(dis.e1.left - dis.e2.left) < 25 && Math.abs(dis.e1.top - dis.e2.bottom) < 25) {
                captureInput.push({
                    inputId: inputId,
                    distance: dis.dis,
                    block: targetBlock,
                    down: self
                })
            }
        }
    }
    insert(self:Block,smallestChild:Block,target:BlockConnectType,insert:Block){
        debugger
        if (self.inputs[self.defaultInsert].value instanceof Block) {
            debugger
            insert.enterInput((self.inputs[self.defaultInsert].value as Block).inputs.next)
        }else{
            insert.enterInput(self.inputs[self.defaultInsert])
        }
    }
}