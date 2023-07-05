import { VisualBlock } from "..";
import { Block } from "../block";

function getClientRects(element: HTMLElement, space: HTMLElement): DOMRect[] {
    return [element.getBoundingClientRect(), space.getBoundingClientRect()]
}

export const moveBy = (element: HTMLElement, space: HTMLElement, x: number, y: number): void => {
    const elementRect = element.getBoundingClientRect()
    move(element, space,elementRect.left+x,elementRect.top+y)
    /*const [elementRect, spaceElementRect] = getClientRects(element, space)
    element.style.left = `${elementRect.left - spaceElementRect.left + space.scrollLeft + x}px`;
    element.style.top = `${elementRect.top - spaceElementRect.top + space.scrollTop + y}px`;*/
}

export const move = (element: HTMLElement, space: HTMLElement, x: number, y: number): void => {
    const spaceElementRect = space.getBoundingClientRect()
    element.style.left = `${space.scrollLeft + x - spaceElementRect.left}px`;
    element.style.top = `${space.scrollTop + y - spaceElementRect.top}px`;
}


export const elementSolitaryPostiton = (element: HTMLElement, space: HTMLElement) => {
    moveBy(element, space, 0, 0)
}

export const getBlockPostiton = (element: HTMLElement, space: HTMLElement): { top: number, left: number } => {
    const [elementRect, spaceElementRect] = getClientRects(element, space)
    return {
        top: elementRect.top - spaceElementRect.top + space.scrollTop,
        left: elementRect.left - spaceElementRect.left + space.scrollLeft,
    };
}

export const blockDraggable = (targetblock: Block, dragging: Boolean = false): void => {
    let startX: number, startY: number;
    let dragOffsetX: number = 0, dragOffsetY: number = 0;
    let targetBlockRect: DOMRect;
    let space: VisualBlock = targetblock.space;
    let spaceRect: DOMRect = space.element.getBoundingClientRect();
    let isDragging = false;

    const handleMouseDown = (event: MouseEvent): void => {
        space.dropDown.close();
        if ((!targetblock.draggableBlock.includes(event.target as HTMLElement) || event.button !== 0) && !dragging) {
            return;
        }

        isDragging = true;
        targetBlockRect = targetblock.element.getBoundingClientRect();

        if (targetblock.parentInput) {
            elementSolitaryPostiton(targetblock.element, space.blockSpace);
        }

        targetblock.displayElement.classList.add("drag-block");
        targetblock.dragStart();

        startX = event.clientX
        startY = event.clientY
        if (targetblock.element.style.left) {
            dragOffsetX = parseInt(targetblock.element.style.left)
            dragOffsetY = parseInt(targetblock.element.style.top)
        } else {
            dragOffsetX = 0
            dragOffsetY = 0
        }
        addEventListeners();
    }

    const handleMouseMove = (event: MouseEvent): void => {
        if (!isDragging) return;
        var deltaX = event.clientX - startX;
        var deltaY = event.clientY - startY;

        dragOffsetX += deltaX / space.zoom;
        dragOffsetY += deltaY / space.zoom;
        targetblock.element.style.left = `${dragOffsetX}px`;
        targetblock.element.style.top = `${dragOffsetY}px`;

        startX = event.clientX;
        startY = event.clientY;

        event.preventDefault();
    }

    const handleMouseUp = (): void => {
        isDragging = false;
        targetblock.displayElement.classList.remove("drag-block");
        targetblock.dragEnd();
        space.setPlaceholder()
        removeEventListeners();
    }

    const addEventListeners = (): void => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    const removeEventListeners = (): void => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }
    targetblock.element.addEventListener("mousedown", handleMouseDown);
    function startDrag(e: MouseEvent) {
        document.removeEventListener("mousemove", startDrag);
        handleMouseDown(e);
        dragging = false
    }
    if (dragging) {
        document.addEventListener("mousemove", startDrag)
    }
}

export function backGroundDraggable(space: VisualBlock) {
    var isDragging = false;
    var startX: number, startY: number;
    space.element.addEventListener('mousedown', handleMouseDown);
    space.element.addEventListener('mouseup', handleMouseUp);
    space.element.addEventListener('mousemove', handleMouseMove);

    function handleMouseDown(event: MouseEvent) {
        if (event.target != space.scrollPlaceholder) {
            return;
        }
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        event.preventDefault();
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging) return;

        var deltaX = event.clientX - startX;
        var deltaY = event.clientY - startY;

        space.element.scrollLeft -= deltaX;
        space.element.scrollTop -= deltaY;

        startX = event.clientX;
        startY = event.clientY;
        event.preventDefault();
    }
    space.element.addEventListener("mouseleave", () => { isDragging = false });
}