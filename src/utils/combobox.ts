import { Block } from "../block";

export const addDropdown = (newblock: Block) => {
  let dropdown: HTMLElement | null = null;

  newblock.element.addEventListener('contextmenu', (event: MouseEvent) => {
    if (!newblock.draggableBlock.includes(event.target as HTMLElement)) {
        return;
    }
    event.preventDefault(); // 阻止默认的右键菜单

    if (dropdown) {
      document.body.removeChild(dropdown);
      dropdown = null;
      return;
    }

    dropdown = document.createElement('div');
    dropdown.style.position = 'absolute';
    dropdown.style.left = `${event.clientX}px`;
    dropdown.style.top = `${event.clientY}px`;

    const button1 = document.createElement('button');
    button1.innerText = '复制';
    button1.addEventListener('click',()=>{newblock.copy()})
    dropdown.appendChild(button1);

    const button2 = document.createElement('button');
    button2.addEventListener('click',()=>{newblock.delete()})
    button2.innerText = '删除';
    dropdown.appendChild(button2);

    document.body.appendChild(dropdown);
  });

  // 点击页面其他位置时关闭下拉框
  document.addEventListener('click', (event: MouseEvent) => {
    if (dropdown && !newblock.element.contains(event.target as Node)) {
      document.body.removeChild(dropdown);
      dropdown = null;
    }
  });
};
