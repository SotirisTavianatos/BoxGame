import * as PIXI from "pixi.js-legacy";
import { Globals } from "./Globals";

export class BoxAnimation {
    constructor(bool){
        if(bool){
            this.sprite= new PIXI.AnimatedSprite([
                Globals.resources.shimmer1_1.texture,
                Globals.resources.shimmer1_2.texture,
                Globals.resources.shimmer1_3.texture,
                Globals.resources.shimmer1_4.texture,
                Globals.resources.shimmer1_5.texture,
                Globals.resources.shimmer1_6.texture,
                Globals.resources.shimmer1_7.texture,
                Globals.resources.shimmer1_8.texture,
                Globals.resources.shimmer1_9.texture,
                Globals.resources.shimmer1_10.texture,
                Globals.resources.shimmer1_11.texture,
                Globals.resources.shimmer1_12.texture,
            ]);
        }
        else{
            this.sprite= new PIXI.AnimatedSprite([
                Globals.resources.shimmer2_1.texture,
                Globals.resources.shimmer2_2.texture,
                Globals.resources.shimmer2_3.texture,
                Globals.resources.shimmer2_4.texture,
                Globals.resources.shimmer2_5.texture,
                Globals.resources.shimmer2_6.texture,
                Globals.resources.shimmer2_7.texture,
                Globals.resources.shimmer2_8.texture,
                Globals.resources.shimmer2_9.texture,
                Globals.resources.shimmer2_10.texture,
                Globals.resources.shimmer2_11.texture,
                Globals.resources.shimmer2_12.texture,
            ]);
        }
        this.sprite.loop=true;
        this.sprite.animationSpeed=0.2;
        this.sprite.play();
    }
}