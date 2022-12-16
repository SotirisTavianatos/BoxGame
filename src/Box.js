import * as PIXI from "pixi.js-legacy";
import { gsap, random } from "gsap";
import { Globals } from "./Globals";
import { Graphics, Sprite } from 'pixi.js';
import { Rectangle } from "pixi.js-legacy";
export class Box extends PIXI.utils.EventEmitter {
    constructor(texture,i,j){
        super();
        this.sprite = new PIXI.Sprite(texture);

        const boxrefle = new PIXI.Sprite(Globals.resources.boxreflection.texture);
        boxrefle.alpha=0.3;
        this.sprite.addChild(boxrefle);
        
        const olbox = new PIXI.Sprite(Globals.resources.boxhlt.texture);
        olbox.visible=false;
        this.sprite.addChild(olbox);

        if(j===-1){//if its a winning box
            this.sprite.position.y=this.sprite.position.y+this.sprite.height/4;
            this.sprite.position.x=this.sprite.position.x+this.sprite.width/1.3+(this.sprite.width/2)*i-this.sprite.width/18;           

            this.sprite.hitArea = new PIXI.Rectangle(100, 124, 100, 74);
        }
        else{//its a number box so we use j to know the position we should put it 
            this.sprite.position.y=this.sprite.position.y+this.sprite.height/1.5+this.sprite.height/2.5*j;
            this.sprite.position.x=this.sprite.position.x+(this.sprite.width/2.1)*i+this.sprite.width/18;

            olbox.scale.set(1.05);
            olbox.position.x=olbox.position.x-8;
            olbox.position.y=olbox.position.y-9.5;

            this.sprite.hitArea = new PIXI.Rectangle(97, 120, 105, 78);
        }
        this.j=j;
        olbox.zIndex=3;
        boxrefle.zIndex=4;
        this.sprite.zIndex=4;
    }
    setInteractive() {
        this.sprite.interactive = true;
        this.sprite.on("mouseover", this.mouseover, this);
        this.sprite.on("mouseout", this.mouseout, this);
        this.sprite.on("mousedown", this.mousedown, this);
    }
    mouseover(e){//we scale everything up,child 0 is the box reflection and the 2 and 3 are the sparkles the 1 is the shiny box
        this.sprite.scale.set(1.05);
        this.sprite.getChildAt(0).scale.set(1.05);
        if(this.j===-1){
        this.sprite.getChildAt(2).scale.set(0.65);
        this.sprite.getChildAt(3).scale.set(0.65);
        }
        else{
            this.sprite.getChildAt(2).scale.set(0.45);
            this.sprite.getChildAt(3).scale.set(0.45);
        }
        this.sprite.getChildAt(1).visible=true;
        this.questionmarkInterval = setInterval(this.addQuestionmark.bind(this),400); 
        this.particleInterval = setInterval(this.addParticle.bind(this),200); 
    }

    mouseout(){//we scale every child back to normal
        this.sprite.scale.set(1);
        this.sprite.getChildAt(0).scale.set(1);
        if(this.j===-1){
            this.sprite.getChildAt(2).scale.set(0.6);
            this.sprite.getChildAt(3).scale.set(0.6);
        }
        else{
            this.sprite.getChildAt(2).scale.set(0.4);
            this.sprite.getChildAt(3).scale.set(0.4);
        }
        this.sprite.getChildAt(1).visible=false;
        this.zegrafise();
     }
     
    mousedown(){
         this.emit("removebox",this.j);
     }  
     
     addQuestionmark(){

        const questionmark = new PIXI.Sprite(Globals.resources.particle2.texture);
        questionmark.scale.set(0.5);
        let min2=questionmark.position.x+this.sprite.width/4+10; 
        let max2= questionmark.position.x+this.sprite.width/1.8; 
        questionmark.position.x=Math.floor(Math.random() * (max2 - min2) ) + min2;
        questionmark.position.y=140;
        gsap.to(questionmark,{onUpdate:function(){questionmark.alpha-=0.02;},y:80,duration:2,ease:"expo"});
        questionmark.zIndex=6;
        this.sprite.addChild(questionmark);
    };

    addParticle(){
        const particle = new PIXI.Sprite(Globals.resources.particle.texture);
        particle.scale.set(0.5);
        let min=particle.position.x+this.sprite.width/4+10; 
        let max= particle.position.x+this.sprite.width/1.6; 
        particle.position.x=Math.floor(Math.random() * (max - min) ) + min;
        particle.position.y=140;
        gsap.to(particle,{onUpdate:function(){particle.alpha-=0.02;},y:80,duration:2,ease:"expo"});
        particle.zIndex=6;
        this.sprite.addChild(particle);

    }

    zegrafise(){
        clearInterval(this.particleInterval);
        clearInterval(this.questionmarkInterval);
    }

}