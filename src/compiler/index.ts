import { PlayEngine } from "..";

export class Compiler {
    engine: PlayEngine
    constructor(engine: PlayEngine) {
        this.engine = engine
    }
    async compile(): Promise<string> {
        const compilePromises = this.engine.spriteManager.sprites.map(sprite => sprite.block.compile());
        const results = await Promise.all(compilePromises);
        return results.join('');
    }
}