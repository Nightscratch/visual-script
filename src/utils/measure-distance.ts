import offset from "./elem-offset";

const measureDistance = (element1: HTMLElement, element2: HTMLElement): number => {
    const rect1 = offset(element1)//element1.getBoundingClientRect();
    const rect2 = offset(element2)//element2.getBoundingClientRect();
    const distance = Math.round(Math.abs(rect2.left - rect1.left) + Math.abs(rect2.top - rect1.top));
    return distance;
}

export default measureDistance