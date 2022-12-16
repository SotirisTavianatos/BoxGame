import * as PIXI from "pixi.js-legacy";
import { gsap, random } from "gsap";
import { Globals } from "./Globals";
import { FinishButton } from "./FinishButton";
export class EndGame{
    constructor(reward){
        this.x=0;
        this.reward=reward;
        this.sprite  = new PIXI.Sprite(Globals.resources.bg.texture);
        this.createbg();
    }

    createbg(){
        const side =new PIXI.Sprite(Globals.resources.side.texture);
        side.height=this.sprite.height;
        this.sprite.addChild(side);

        const otherside=new PIXI.Sprite(Globals.resources.side.texture);
        otherside.position.x=this.sprite.width;
        otherside.height=this.sprite.height;
        otherside.scale.x=-1;
        this.sprite.addChild(otherside);

        const logo=new PIXI.Sprite(Globals.resources.logo.texture);
        logo.anchor.set(0.5);
        logo.position.y=logo.position.y+55;
        logo.position.x=this.sprite.width/2;
        this.sprite.addChild(logo);
        
        console.log(this.reward);
        
       if(this.reward>0){
            this.rewardtext=new PIXI.Text(0,{fill : 0xffff00 });
            this.rewardtext.anchor.set(0.5);
            this.rewardtext.scale.set(3);
            this.rewardtext.position.y=this.rewardtext.position.y+500;
            this.rewardtext.position.x=this.rewardtext.position.x+650;
            this.sprite.addChild(this.rewardtext);
            setInterval(function(){this.coins()}.bind(this),150);  
            this.myInterval=setInterval(function(){this.money(this.myInterval)}.bind(this),1);  
        }
        else{
            const text=new PIXI.Sprite(Globals.resources.lose.texture);
            text.anchor.set(0.5);
            text.scale.set(0.2);
            text.position.y=text.position.y+300;
            text.position.x=text.position.x+650;
            this.sprite.addChild(text);
            const finish=new FinishButton(text.position.y+300,text.position.x);
            this.sprite.addChild(finish.sprite);
            gsap.to(text, {duration:0.5,pixi: {scale: 1},ease:"back"});
        }     
    }
    coins(){
        const coin = new PIXI.AnimatedSprite([
            Globals.resources.coin1.texture,
            Globals.resources.coin2.texture,
            Globals.resources.coin3.texture,
            Globals.resources.coin4.texture,
            Globals.resources.coin5.texture,
            Globals.resources.coin6.texture,
            Globals.resources.coin7.texture,
            Globals.resources.coin8.texture,
        ]);
        gsap.to(coin,{onUpdate:function(){},y:this.sprite.height,duration:2.3,ease:"bounce"});
        this.sprite.addChild(coin);
        coin.loop=true;
        coin.animationSpeed=0.4;
        coin.position.y=-80;
        coin.position.x=(Math.random() * 1350)-100;
        coin.play();
    }
    money(myInterval){
            if(Math.floor(this.x)<20 && this.x+0.05<this.reward){
                this.x=this.x+0.05;
                this.moneytext=(Math.round(this.x * 100) / 100).toFixed(2);
            }
            else if(Math.floor(this.x)<250 && this.x+0.55<this.reward){
                this.x=this.x+0.55;
                this.moneytext=(Math.round(this.x * 100) / 100).toFixed(2);
            }
            else if(Math.floor(this.x)<5000 && this.x+5.55<this.reward){
                this.x=this.x+5.55;
                this.moneytext=(Math.round(this.x * 100) / 100).toFixed(2);
            }
            else if(Math.floor(this.x)<200000 && this.x+55.55<this.reward){
                this.x=this.x+55.55;  
                this.moneytext=(Math.round(this.x * 100) / 100).toFixed(2);
            }
            else{
                this.moneytext=this.reward;
                clearInterval(myInterval);
            }
            this.rewardtext.text=(this.moneytext.toLocaleString()+"$");
            if(Math.floor(this.x)===1){
                this.x++;
                const text=new PIXI.Sprite(Globals.resources.win.texture);
                text.anchor.set(0.5);
                text.scale.set(0.2);
                text.position.y=text.position.y+300;
                text.position.x=text.position.x+650;
                this.sprite.addChildAt(text,0);
                gsap.to(text, {duration:0.5,pixi: {scale: 1},ease:"back"});
            }
            else if(Math.floor(this.x)===20){
                this.x++;
                this.sprite.removeChildAt(0);
                const text=new PIXI.Sprite(Globals.resources.nicewin.texture);
                text.anchor.set(0.5);
                text.scale.set(0.2);
                text.position.y=text.position.y+300;
                text.position.x=text.position.x+650;
                this.sprite.addChildAt(text,0);
                gsap.to(text, {duration:0.5,pixi: {scale: 1},ease:"back"});
            }
            else if(Math.floor(this.x)===250){
                this.x++;
                this.sprite.removeChildAt(0);
                const text=new PIXI.Sprite(Globals.resources.bigwin.texture);
                text.anchor.set(0.5);
                text.scale.set(0.2);
                text.position.y=text.position.y+300;
                text.position.x=text.position.x+650;
                this.sprite.addChildAt(text,0);
                gsap.to(text, {duration:0.5,pixi: {scale: 1},ease:"back"});
            }
            else if(Math.floor(this.x)===5000){
                this.x++;
                this.sprite.removeChildAt(0);
                const text=new PIXI.Sprite(Globals.resources.megawin.texture);
                text.anchor.set(0.5);
                text.scale.set(0.2);
                text.position.y=text.position.y+300;
                text.position.x=text.position.x+650;
                this.sprite.addChildAt(text,0);
                gsap.to(text, {duration:0.5,pixi: {scale: 1},ease:"back"});
            }
            else if(Math.floor(this.x)===200000){
                this.x++;
                this.sprite.removeChildAt(0);
                const text=new PIXI.Sprite(Globals.resources.jackpotwin.texture);
                text.anchor.set(0.5);
                text.scale.set(0.2);
                text.position.y=text.position.y+300;
                text.position.x=text.position.x+650;
                this.sprite.addChildAt(text,0);
                gsap.to(text, {duration:0.5,pixi: {scale: 1},ease:"back"});
            }
    }
}