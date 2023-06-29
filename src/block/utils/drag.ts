import { VisualBlock } from "..";
import { Block } from "../block";
import offset from "./elem-offset";

export function elementSolitary(element: HTMLElement, space: HTMLElement) {
    const elementRect: DOMRect = offset(element);
    const spaceElementRect: DOMRect = offset(space);
    element.style.left = `${elementRect.left - spaceElementRect.left + space.scrollLeft}px`;
    element.style.top = `${elementRect.top - spaceElementRect.top + space.scrollTop}px`;
}

export function getBoundingClientRect(element: HTMLElement, space: HTMLElement): { top: number, left: number } {
    const elementRect: DOMRect = offset(element);
    const spaceElementRect: DOMRect = offset(space);
    return {
        top: elementRect.top - spaceElementRect.top + space.scrollTop,
        left: elementRect.left - spaceElementRect.left + space.scrollLeft,
    };
}

export function draggable(newblock: Block): void {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let newBlockRect: DOMRect | null = null;
    let spaceRect: DOMRect | null = null;
    let space: VisualBlock = newblock.space;
    function handleMouseDown(event: MouseEvent): void {
        space.dropDown.close();
        if (!newblock.draggableBlock.includes(event.target as HTMLElement)) {
            return;
        }
        if (event.button !== 0) {
            return;
        }

        isDragging = true;
        newBlockRect = offset(newblock.element);
        spaceRect = offset(space.element);
        if (newblock.parentInput) {
            elementSolitary(newblock.element, space.blockSpace);
        }

        newblock.displayElement.classList.add("drag-block");
        newblock.dragStart();

        offsetX = event.clientX/space.zoom + spaceRect.left - newBlockRect.left - space.element.scrollLeft;
        offsetY = event.clientY/space.zoom + spaceRect.top - newBlockRect.top - space.element.scrollTop;

        addEventListeners();
    }

    function handleMouseMove(event: MouseEvent): void {
        if (isDragging) {
            const left = event.clientX/space.zoom - offsetX;
            const top = event.clientY/space.zoom - offsetY;

            newblock.element.style.left = `${left}px`;
            newblock.element.style.top = `${top}px`;

            space.setPlaceholder(
                newBlockRect!.top + space.element.scrollTop + newBlockRect!.height + 2000,
                newBlockRect!.left + space.element.scrollLeft + newBlockRect!.width + 2000
            );
        }
    }

    function handleMouseUp(): void {
        isDragging = false;
        newblock.displayElement.classList.remove("drag-block");
        newblock.dragEnd();
        newblock.element.style.top = `${Math.max(0,parseInt(newblock.element.style.top))}px`
        newblock.element.style.left = `${Math.max(0,parseInt(newblock.element.style.left))}px`

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

export function backGroundDrag(space: VisualBlock) {
    var isMouseDown = false;
    var startX: number, startY: number;

    space.element.addEventListener('mousedown', handleMouseDown);
    space.element.addEventListener('mouseup', handleMouseUp);
    space.element.addEventListener('mousemove', handleMouseMove);

    function handleMouseDown(event: MouseEvent) {
        if (event.target != space.scrollPlaceholder) {
            return;
        }
        isMouseDown = true;
        startX = event.clientX;
        startY = event.clientY;
        event.preventDefault();
    }

    function handleMouseUp() {
        isMouseDown = false;
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isMouseDown) return;

        var deltaX = event.clientX - startX;
        var deltaY = event.clientY - startY;

        space.element.scrollLeft -= deltaX;
        space.element.scrollTop -= deltaY;

        startX = event.clientX;
        startY = event.clientY;
        event.preventDefault();

        space.setPlaceholder(
            space.element.scrollTop + 2000,
            space.element.scrollLeft + 2000
        );
    }
}