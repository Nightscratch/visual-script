import { VisualBlock } from "src";
import { Block } from "../block";

import { DropDownButton } from "../interface"

export class DropDown {
  public element: HTMLElement
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('drop-down')
    this.close()
    document.addEventListener('click', (event: MouseEvent) => {
      this.close()
    });
  }
  public createButton(data: DropDownButton): HTMLElement {
    const button = document.createElement('button');
    button.innerText = data.text;
    button.addEventListener('click', data.click)
    return button
  }
  public setButton(buttons: DropDownButton[]) {
    this.element.innerHTML = ''
    buttons.forEach((button) => {
      this.element.appendChild(this.createButton(button));
    })
    this.element.style.display = 'block';
  }
  public close() {
    this.element.style.display = 'none'
  }
  public moveTo(left:number,top:number){
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

}


export const addBlockDropdown = (targetBlock: Block, dropDown: DropDown) => {
  targetBlock.element.addEventListener('contextmenu', (event: MouseEvent) => {
    if (!targetBlock.draggableBlock.includes(event.target as HTMLElement)) {
      return;
    }
    event.preventDefault();
    dropDown.moveTo(event.clientX,event.clientY)
    dropDown.setButton([
      { text: '复制积木', click:()=>{targetBlock.copy()} },
      { text: '删除积木', click:()=>{targetBlock.delete()} },
    ])
  });
};

export const addSpaceDropdown = (space: VisualBlock, dropDown: DropDown) => {
  space.element.addEventListener('contextmenu', (event: MouseEvent) => {
    if (event.target != space.scrollPlaceholder) {
      return;
    }
    event.preventDefault();
    dropDown.moveTo(event.clientX,event.clientY)
    dropDown.setButton([
      { text: '删除全部', click:()=>{space.clean()} },
      { text: '整理积木', click:()=>{space.arrange()} },
    ])
  });
};
