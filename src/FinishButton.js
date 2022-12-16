import * as PIXI from "pixi.js-legacy";
import { gsap, random } from "gsap";
import { Globals } from "./Globals";
export class FinishButton{
    constructor(y,x){
            this.sprite= new PIXI.Sprite(Globals.resources.finish.texture);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(0.2);
            this.sprite.position.y=y;
            this.sprite.position.x=x;
            this.sprite.interactive = true;
            this.sprite.hitArea = new PIXI.Rectangle(-171,-55,344,110);
            this.sprite.mouseover = function(mouseData) {
            this._texture=Globals.resources.finishhit.texture;
            }
            this.sprite.mouseout = function(mouseData) {
                this._texture=Globals.resources.finish.texture;
            }
            gsap.to(this.sprite, {duration:0.5,pixi: {scale: 1},ease:"back"});
    }
}