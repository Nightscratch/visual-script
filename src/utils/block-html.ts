export const input = (id:string):string =>{
    return `<div class="block-input" id="${id}"></div>`
}

export const text = (text:string):string =>{
    return `<p class="block-text" drag="true">${text}</p>`
}