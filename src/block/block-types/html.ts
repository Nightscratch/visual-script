export function block(blockClass: string, content: HTMLElement[]): HTMLElement {
  const blockElement = document.createElement('div');
  blockElement.id = 'block-display';
  blockElement.setAttribute('class', blockClass)
  blockElement.setAttribute('drag', 'true');
  content.forEach(child => {
    blockElement.appendChild(child);
  });
  return blockElement;
}

export function line(method: boolean, content: HTMLElement[]): HTMLElement {
  const lineElement = document.createElement('div');

  if (method) {
    lineElement.classList.add('block-method');
  } else {
    lineElement.classList.add('block-line');
  }
  content.forEach(child => {
    lineElement.appendChild(child);
  });
  return lineElement;
}

export function text(content: string): HTMLElement {
  const textElement = document.createElement('p');
  textElement.classList.add('block-text');
  textElement.setAttribute('drag', 'true');
  textElement.textContent = content;

  return textElement;
}

export function input(value: string): HTMLElement {
  const inputElement = document.createElement('div');
  inputElement.classList.add('block-input');
  inputElement.id = `input-${value}`;
  inputElement.setAttribute('drag', 'true');

  return inputElement;
}

export function method(): HTMLElement {
  const methodElement = document.createElement('div');
  methodElement.classList.add('block-block-input');
  methodElement.id = 'input-if';
  methodElement.setAttribute('drag', 'true');

  return methodElement;
}
export function next(){
  const nextElement = document.createElement('div');
  nextElement.classList.add('next-input')
  nextElement.id = 'input-next'
  return nextElement
}