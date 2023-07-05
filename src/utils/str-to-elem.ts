export default (str:string):HTMLElement => {
    let element = document.createElement('div')
    element.innerHTML = str
    return element.firstChild as HTMLElement
}