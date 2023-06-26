export interface initOption {
    element: HTMLElement;
    width?: number;
    height?: number;
}

export interface newBlock {
    element?: HTMLElement;
    create?: boolean;
    inputs?: blockInput[];
}

export interface blockInput {
    type: string;
    value: Block | string | null;
    element: HTMLElement | null;
}

export interface BlockInputData {
    down: Block | null;
    distance: number;
    inputId: string;
    block: Block;
}

export declare class VisualBlock {
    public element: HTMLElement;
    public blocks: Block[];
    public blockClasses: { [key: string]: any };

    constructor(option: initOption);

    public addBlock(newBlock: Block): void;
    public removeBlock(delBlock: Block): void;
    public registerBlock(blockClass: any): void;
}

export declare class Block {
    public element: HTMLElement;
    public inputs: { [id: string]: blockInput };
    public space: VisualBlock;
    public parentInput: blockInput | null;
    public draggableBlock: HTMLElement[];
    public displayElement: HTMLElement;
    public blockName: string;

    constructor(block: newBlock);

    public getInput(): void;
    public dragEnd(): void;
    public dragStart(): void;
    private solitary(): void;
    private enterInput(input: blockInput): void;
    private getSmallestChild(): this;
    private handleConnect(input: blockInput, target: BlockInputData): void;
    public clone(): Block;
    public copy(first?: boolean): Block;
    public delete(first?: boolean): void;
}

export declare class MoveBlock extends Block {
    constructor(block: newBlock);
    private create(): void;
}