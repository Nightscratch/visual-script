const measureDistance = (element1: HTMLElement, element2: HTMLElement): {dis:number,e1:DOMRect,e2:DOMRect} => {
    const rect1 = element1.getBoundingClientRect()//element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect()//element2.getBoundingClientRect();
    const distance = Math.round(Math.abs(rect2.left - rect1.left) + Math.abs(rect2.top - rect1.top));
    return {dis:distance,e1:rect1,e2:rect2};
}

export default measureDistance