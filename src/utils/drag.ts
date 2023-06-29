import { Block } from "../block";
import offset from "./elem-offset";


export function elementSolitary(element: HTMLElement, space: HTMLElement) {
    let elementRect: DOMRect = offset(element)
    let spaceElementRect: DOMRect = offset(space)
    element.style.left = `${elementRect.left - spaceElementRect.left + space.scrollLeft}px`
    element.style.top = `${elementRect.top - spaceElementRect.top + space.scrollTop}px`
}

export function getBoundingClientRect(element: HTMLElement, space: HTMLElement): { top: number, left: number } {
    let elementRect: DOMRect = offset(element)
    let spaceElementRect: DOMRect = offset(space)
    //cloneElement.style.left = `${elementRect.left - spaceElementRect.left + 20}px`
    //cloneElement.style.top = `${elementRect.top - spaceElementRect.top + 20}px`
    return {
        top: elementRect.top - spaceElementRect.top + space.scrollTop,
        left: elementRect.left - spaceElementRect.left + space.scrollLeft,
    }
}


export function draggable(
    newblock: Block,
): void {
    let isDragging: boolean = false;
    let offsetX: number = 0;
    let offsetY: number = 0;

    let newBlockRect: DOMRect | null = null;
    let spaceRect: DOMRect | null = null;


    function handleMouseDown(event: MouseEvent): void {
        newblock.space.dropDown.close()
        if (!newblock.draggableBlock.includes(event.target as HTMLElement)) {
            return;
        }
        if (event.button !== 0) {
            return;
        }

        isDragging = true;

        newBlockRect = offset(newblock.element)
        spaceRect = offset(newblock.space.element)
        if (newblock.parentInput) {
            elementSolitary(newblock.element, newblock.space.element)
        }

        newblock.displayElement.classList.add("drag-block");
        newblock.dragStart()

        offsetX = event.clientX + spaceRect.left - newBlockRect.left - newblock.space.element.scrollLeft;
        offsetY = event.clientY + spaceRect.top - newBlockRect.top - newblock.space.element.scrollTop;

        addEventListeners();
    }

    function handleMouseMove(event: MouseEvent): void {
        if (isDragging) {
            const left = event.clientX - offsetX;
            const top = event.clientY - offsetY;

            newblock.element.style.left = `${left}px`;
            newblock.element.style.top = `${top}px`;

            newblock.space.setPlaceholder(
                newBlockRect!.top + newblock.space.element.scrollTop + newBlockRect!.height + spaceRect!.height,
                newBlockRect!.left + newblock.space.element.scrollLeft + newBlockRect!.width + spaceRect!.width
            )
        }
    }

    function handleMouseUp(): void {
        isDragging = false;
        newblock.displayElement.classList.remove("drag-block");
        newblock.dragEnd()
        removeEventListeners();
    }

    function addEventListeners(): void {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    function removeEventListeners(): void {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }

    newblock.element.addEventListener("mousedown", handleMouseDown);
}

