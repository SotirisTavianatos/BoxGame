import { Globals } from "./Globals";
import * as PIXI from "pixi.js-legacy";
export class OpenBox{
    constructor(x,y,rng,rng2,color){
        if(rng2===-1){
            this.sprite = new PIXI.Sprite(Globals.resources.winningnumber.texture);
            this.winningText(rng,this.sprite,color);
        }
        else{
            this.sprite = new PIXI.Sprite(Globals.resources.mynumber.texture);
            if(rng<101)
                this.numbersText(rng,rng2,this.sprite,color);
            else
                this.iconFound(rng,rng2,this.sprite);
        }
        this.sprite.position.y=y;
        this.sprite.position.x=x;
        this.sprite.zIndex=4;
        
    }

    winningText(x,textbox,white){//add text to sprite textbox where text is the number x and position it accordingly 
        if(white)//this flag is used so we know if we found a match or just opened the box
            var text = new PIXI.Text(x,{fill : 0xffffff });
        else{
            var text = new PIXI.Text(x,{fill : 0xffff00 });
            textbox._texture = Globals.resources.winningnumberwon.texture;
        }
        text.scale.set(2);
        if (x<10){
            text.x=85;
            text.y=62;
        }
        else if (x<100){ 
            text.x=70;
            text.y=62;
        }
        else if(x===100){
            text.x=54;
            text.y=62;
        }
        textbox.addChild(text);
    }

    numbersText(rng,rng2,textbox,yellow){//adding text to a "your number" box according to the rng and rngs numbers 
        if(yellow){//this flag is used so we know if we found a match or just opened the box 
            var text = new PIXI.Text(rng,{fill : 0xffff00 });
            var text3 = new PIXI.Text("10$",{fill : 0xffff00 }); 
            textbox._texture = Globals.resources.mynumberwon.texture;
            rng2=rng2._text.replace('.','');
        }
        else{
            var text = new PIXI.Text(rng,{fill : 0xffffff });
            var text3 = new PIXI.Text("10$",{fill : 0x00ffff }); 
            rng2=rng2.replace('.','');
        }
        text.scale.set(2);
        if (rng<10){
            text.x=135;
            text.y=100;
        }
        else if (rng<100){
            text.x=122;
            text.y=100;
        }
        else if (rng===100){
            text.x=105;
            text.y=100;
        }
        textbox.addChild(text);
        if (rng2==="10$"){
            text3._text="10$";  
            text3.x=130;
            text3.y=160;
        } 
        else if (rng2==="100$"){
            text3._text="100$";  
            text3.x=120;
            text3.y=160;
        }
        else if (rng2==="1000$"){
            text3._text="1.000$";  
            text3.x=110;
            text3.y=160;
        }
        else if (rng2==="10000$"){
            text3._text="10.000$";  
            text3.x=100;
            text3.y=160;
        }
        else if (rng2==="100000$"){
            text3._text="100.000$";  
            text3.x=100;
            text3.y=160;
        }
        textbox.addChild(text3);
    }
    iconFound(rng,rng2,textbox){//we found icon on "your number" box so we replace the old sprite and add the money and the icon 
        textbox._texture = Globals.resources.mynumberwon.texture;
        
        var text = new PIXI.Text(rng2,{fill : 0xffff00 });
        if (rng2==="10$"){
            text.x=130;
            text.y=160;
        } 
        else if (rng2==="100$"){
            text._text="100$";  
            text.x=120;
            text.y=160;
        }
        else if (rng2==="1000$"){
            text._text="1.000$";  
            text.x=110;
            text.y=160;
        }
        else if (rng2==="10000$"){
            text._text="10.000$";  
            text.x=100;
            text.y=160;
        }
        else if (rng2==="100000$"){
            text._text="100.000$";  
            text.x=100;
            text.y=160;
        }
        const prize = new PIXI.Sprite(Globals.resources.symbol3.texture);
        if (rng===101){
           prize._texture=Globals.resources.symbol1.texture;
           text._text="50$"; 
           text.x=130;
           text.y=160;
        }
        else if (rng===102)
           prize._texture = Globals.resources.symbol2.texture;
        prize.scale.set(0.8);
        prize.position.x=prize.position.x+prize.width-20;
        prize.position.y=prize.position.y+prize.height/1.5;
        textbox.addChild(prize);
        textbox.addChild(text);   
    }
}