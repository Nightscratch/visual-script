import { SpriteManager } from "../sprite/index";
import { blockJson } from "../block/interface";
import { Block } from "../block/block";
import { PlayEngine } from "..";

interface Sprite {
    code: blockJson[];
    spriteName: string;
}

interface ProjectJson {
    sprites: Sprite[];
}

export class Packager {
    constructor(private engine: PlayEngine) {}

    async package(): Promise<string> {
        const res: ProjectJson = {
            sprites: []
        };

        await Promise.all(this.engine.spriteManager.sprites.map(sprite =>
            this.blocksToJson(sprite.block.block)
                .then(value => res.sprites.push({ code: value, spriteName: sprite.spriteName }))
        ));

        return JSON.stringify(res);
    }

    private blocksToJson(blocks: Block[]): Promise<blockJson[]> {
        const res: blockJson[] = [];
        
        for (const [blockName, block] of Object.entries(blocks)) {
            if (!block.parentInput) {
                res.push(block.toJson());
            }
        }

        return Promise.resolve(res);
    }
}
