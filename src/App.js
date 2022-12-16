import * as PIXI from "pixi.js-legacy";
import { gsap, random } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import Loader from "./Loader";
import ResizeHandler from "./ResizeHandler";
import { store } from "./store";
import app from "./reducer/app";
import { Rectangle } from "pixi.js-legacy";
import { Graphics, Sprite } from 'pixi.js';
import { Box } from "./Box";
import { OpenBox } from "./OpenBox";
import { Globals } from "./Globals";
import { BoxAnimation } from "./BoxAnimation";
import { EndGame } from "./EndGame";

export default class App {

    constructor(props) {
        this._createPixiApplication(props);
        this._loadAssets(props);

        this._subscribe();
    }

    _createPixiApplication(props) {
        const { width, height, antialias, canvas, forceCanvas = false, onResize } = props;

        // register the plugin
        gsap.registerPlugin(PixiPlugin);

        // give the plugin a reference to the PIXI object
        PixiPlugin.registerPIXI(PIXI);

        PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.POW2;

        this._app = new PIXI.Application({ width, height, antialias, forceCanvas, view: canvas, powerPreference: "high-performance" });

        ResizeHandler({ width, height, canvas, app: this._app, onResize });
    }

    _loadAssets(props) {
        const loader = new Loader({ ...props, loader: this._app.loader });
        loader.load();
    }

    _createGame() {
        this.stillPlaying=true;//true while in game false when in credits
        this.bool=false;//this boolean is true when the game was paused and now we want to go back to normal
        this.reward=0;
        this.timer=0;//use this to sav the interval index
        this.currseconds=0;//we use this counter to count for how many seconds the players is afk in order to start the animation
        this.counter=0;//counter to help with the animation for inactivity
        const resources = this._app.loader.resources;
        Globals.resources = resources;
        //load sprites and position them 
        const bg = new PIXI.Sprite(resources.bg.texture);
        
        const side =new PIXI.Sprite(resources.side.texture);
        side.height=bg.height;

        const otherside=new PIXI.Sprite(resources.side.texture);
        otherside.position.x=bg.width;
        otherside.height=bg.height;
        otherside.scale.x=-1;
        
        const info=new PIXI.Sprite(resources.info.texture);
        info.anchor.set(0.5);
        info.position.y=bg.height-info.height/4;
        info.position.x=bg.width/2;

        const gameholder=new PIXI.Sprite(resources.gameholder.texture);
        gameholder.position.x=bg.width/2-gameholder.width/2;
        gameholder.position.y=bg.height-gameholder.height-info.height/4;

        const settings=new PIXI.Sprite(resources.settings.texture);
        settings.position.y=bg.height-info.height-settings.height/5;

        const logo=new PIXI.Sprite(resources.logo.texture);
        logo.anchor.set(0.5);
        logo.position.y=bg.height-info.height/3-gameholder.height;
        logo.position.x=bg.width/2;

        const title=new PIXI.Sprite(resources.title.texture);
        title.position.x=bg.width/2-title.width/2;
        title.position.y=bg.height-info.height/3.5-gameholder.height+title.height;
        //use zindex to get the sprites in order of depth
        this._app.stage.addChild(bg);
        bg.zIndex=0;
        this._app.stage.addChild(side);
        side.zIndex=1;
        this._app.stage.addChild(otherside);
        otherside.zIndex=1;
        this._app.stage.addChild(logo);
        logo.zIndex=1;
        this._app.stage.addChild(info);
        info.zIndex=1;
        this._app.stage.addChild(settings);
        settings.zIndex=2;
        this._app.stage.addChild(gameholder);
        gameholder.zIndex=2;
        this._app.stage.addChild(title);
        title.zIndex=4;
        this._app.stage.sortableChildren = true;

        this.resetTimer();
        window.setInterval(function checkFocus(){//we check if the player is in the game window
            if(document.hasFocus()==false){
                //if he isnt we add the resume button and take away the interactivity from all other sprites and also pause animations
                this.lostFocus();
                this.topsrparkleanimation.pause();
                this.botsparkleanimation.pause();
                this.resume.visible=true;
                this.resume.interactive=true;
            }
            if(this.resume.visible){
                this.resetTimer();//we reset the afk timer while we have the resume button on screen so the afk animations wont play
            }
        }.bind(this), 100)
        //arrays to help find matches
        this.winningnumbersarray=[];
        this.mynumbersarray=[];
        //arrays for animations of sparkles and boxes
        this.sparklearray=[];
        this.sparkle2array=[];
        this.animateboxesarray1=[];
        this.animateboxesarray2=[];
        this.animateboxesarray3=[];
        //add the winning boxes on screen with their sparkles
        for (let i = 0; i < 5; i++) {
            const box = new Box(resources.box.texture,i,-1);
            this._app.stage.addChild(box.sprite);
            box.setInteractive();
            box.on('removebox', () => this.removeWinningBox(box));
            this.animateboxesarray1.push(box.sprite);

            const sparkle = new PIXI.Sprite(Globals.resources.sparkle.texture);
            sparkle.scale.set(0.6);
            sparkle.anchor.set(0.5);
            sparkle.zIndex=5;
            this.sparklearray.push(sparkle);
            sparkle.position.y=box.sprite.position.y+box.sprite.height/4-sparkle.height;
            sparkle.position.x=sparkle.position.x+box.sprite.width/3;
            box.sprite.addChild(sparkle);

            const sparkle2 = new PIXI.Sprite(Globals.resources.sparkle.texture);
            sparkle2.scale.set(0.6);
            sparkle2.anchor.set(0.5);
            sparkle2.zIndex=5;
            this.sparkle2array.push(sparkle2);
            sparkle2.position.y=box.sprite.position.y+box.sprite.height/4+sparkle.height;
            sparkle2.position.x=sparkle.position.x+box.sprite.width/3;
            box.sprite.addChild(sparkle2);
            
        }
        //add the mynumber boxes with their sparkles
        for(let j = 0; j < 3; j++) {
            for (let i = 0; i < 8; i++)
             {
                const box = new Box(resources.pbox.texture,i,j);
                this._app.stage.addChild(box.sprite);
                box.setInteractive();
                box.on('removebox', () => this.removeNumberBox(box));
                if(j!=1)
                    this.animateboxesarray2.push(box.sprite);
                else
                    this.animateboxesarray3.push(box.sprite);

                const sparkle = new PIXI.Sprite(Globals.resources.sparkle.texture);
                sparkle.scale.set(0.4);
                sparkle.anchor.set(0.5);
                sparkle.zIndex=5;
                this.sparklearray.push(sparkle);
                sparkle.position.y=sparkle.position.y+box.sprite.height/2;
                sparkle.position.x=sparkle.position.x+box.sprite.width/3.1;
                box.sprite.addChild(sparkle);

                const sparkle2 = new PIXI.Sprite(Globals.resources.sparkle.texture);
                sparkle2.scale.set(0.4);
                sparkle2.anchor.set(0.5);
                sparkle2.zIndex=5;
                this.sparkle2array.push(sparkle2);
                sparkle2.position.y=sparkle.position.y+box.sprite.height/12;
                sparkle2.position.x=sparkle.position.x+box.sprite.width/2.85;
                box.sprite.addChild(sparkle2);
         }
        }
        //add particles to random places
        for (let i = 0; i < 40; i++) {
            const particle =new PIXI.Sprite(resources.particle.texture);
            this._app.stage.addChild(particle);
            particle.position.x=Math.floor(Math.random() * bg.width-10)+10;
            particle.position.y=Math.floor(Math.random() * bg.height);
            particle.scale.set(Math.random());
            particle.zIndex=5;
        }
        //set the animations for sparkles
        this.topsrparkleanimation=gsap.to(this.sparklearray,{duration:240,rotation:-360,repeat:-1,ease:"none"});
        this.botsparkleanimation=gsap.to(this.sparkle2array,{duration:240,rotation:360, repeat:-1, ease:"none"});
        //set animations for boxes and pause them so they dont start on their own but we start them when the player is afk
        this.winningboxanimation=gsap.to(this.animateboxesarray1,{duration:1,y:30,repeat:-1,yoyo:true,ease:"Power2.InOut"});
        this.mynumbersanimation1=gsap.to(this.animateboxesarray2,{duration:1,x:10,repeat:-1,yoyo:true,ease:"Power2.InOut"});
        this.mynumbersanimation2=gsap.to(this.animateboxesarray3,{duration:1,x:1000,repeat:-1,yoyo:true,ease:"Power2.InOut"});
        this.mynumbersanimation3=gsap.to(this.animateboxesarray3,{duration:1,x:10,repeat:-1,yoyo:true,ease:"Power2.InOut"});
        this.mynumbersanimation4=gsap.to(this.animateboxesarray2,{duration:1,x:1000,repeat:-1,yoyo:true,ease:"Power2.InOut"});
        this.winningboxanimation.pause();
        this.mynumbersanimation1.pause();
        this.mynumbersanimation2.pause();
        this.mynumbersanimation3.pause();
        this.mynumbersanimation4.pause();
        //add resume button but dont put it on screen yet
        this.resume = new PIXI.Graphics();
        this.resume.beginFill(0xd9d900);
        this.resume.drawRoundedRect(bg.width/2-100,bg.height/2-20, 200, 100,20);
        var text = new PIXI.Text("resume",{fill : 0xffffff });
        this.resume.addChild(text);
        this.resume.zIndex=6;
        this.resume.hitArea = new PIXI.Rectangle(bg.width/2-100,bg.height/2-20, 200, 100);
        text.zIndex=7;
        text.position.x=bg.width/2-87;
        text.position.y=bg.height/2-10;
        text.scale.set(2);
        this._app.stage.addChild(this.resume);
        this.resume.visible=false;
        this.resume.on('mousedown', this.resumePressed,this);
        bg.interactive=true;
        bg.on('mousemove',this.activityDetected,this);
        bg.hitArea=new PIXI.Rectangle(0, 0, bg.width, bg.height);
    }
    removeWinningBox(x){//we opened a winning box and now we replace it 
        let rng=Math.floor(Math.random() * 100)+1;
        const openbox = new OpenBox(x.sprite.x+x.sprite.width/5.5,x.sprite.y+x.sprite.height/6,rng,-1,true);
        this._app.stage.addChild(openbox.sprite);
        this._app.stage.removeChild(x.sprite);
        this.checkNumbers(openbox.sprite,true);
    }
    removeNumberBox(x){//we opened a number box so now we replace it 
        
        let rng=Math.floor(Math.random() * 103)+1;
        let rng2=10**(Math.floor(Math.random() * (5 - 1 + 1) + 1));
        if(rng===101){
            this.reward=this.reward+50;
        }
        else if(rng===102){
            this.reward=this.reward+rng2;
        }
        else if(rng===103){
            this.reward=this.reward+(rng2*2);
        }
        rng2=rng2+"$";
        const openbox = new OpenBox(x.sprite.x,x.sprite.y+10,rng,rng2,false);
        this._app.stage.addChild(openbox.sprite);
        this._app.stage.removeChild(x.sprite);
        this.checkNumbers(openbox.sprite,false);
    }

    checkNumbers(x,bool)//we opened box so we check for matches 
    {
        let searcharray=[];
        if(bool){
            this.winningnumbersarray.push(x);
            searcharray=this.mynumbersarray;
        }
        else{
            this.mynumbersarray.push(x);
            searcharray= this.winningnumbersarray;
        }
        searcharray.forEach(number => {
            if(number.getChildAt(0)._text===x.getChildAt(0)._text)
               {
                let animsprite1;
                let animsprite2;
                let newx;
                let newnumber;
                if(bool){
                    newx = new OpenBox(x.x,x.y,x.getChildAt(0)._text,-1,false);
                    animsprite2= new BoxAnimation(false);
                    newx.sprite.addChild(animsprite2.sprite);
                    newnumber = new OpenBox(number.x,number.y,number.getChildAt(0)._text,number.getChildAt(1),true);
                    animsprite1= new BoxAnimation(true);
                    newnumber.sprite.addChild(animsprite1.sprite);
                    let price=number.getChildAt(1)._text.substring(0,number.getChildAt(1)._text.length-1).replace('.','');
                    this.reward=Number(this.reward)+Number(price);
                }
                else{
                    newx = new OpenBox(x.x,x.y,x.getChildAt(0)._text,x.getChildAt(1),true);
                    animsprite1= new BoxAnimation(true);
                    newx.sprite.addChild(animsprite1.sprite);
                    newnumber = new OpenBox(number.x,number.y,number.getChildAt(0)._text,-1,false);
                    animsprite2= new BoxAnimation(false);
                    newnumber.sprite.addChild(animsprite2.sprite);
                    let price=x.getChildAt(1)._text.substring(0,x.getChildAt(1)._text.length-1).replace('.','');
                    this.reward=Number(this.reward)+Number(price);
                }
                this._app.stage.addChild(newx.sprite);
                this._app.stage.addChild(newnumber.sprite);
              }
        });
        if(this.winningnumbersarray.length+this.mynumbersarray.length===29){
            window.setTimeout(function() {this.gameOver();}.bind(this), 1300)
        }
    }

    gameOver(){//helps creates the game over state
        this.stillPlaying=false;
        while(this._app.stage.children[0]) { 
            this._app.stage.removeChild(this._app.stage.children[0]);
        }
        const bg = new EndGame(this.reward);
        this._app.stage.addChild(bg.sprite);
    }

    lostFocus(){//we stop the interactivity of boxes and make everything darker
        if(this.stillPlaying){
            this._app.stage.children.forEach(child => {
                child.tint=0x999999;
                child.children.tint=0x999999;
                child.children.forEach(grandchild => {
                    grandchild.tint=0x999999;
                    child.interactive=false;
                });
            });
            this._app.stage.getChildAt(77).tint=0xFFFFFF;
            this._app.stage.getChildAt(77).getChildAt(0).tint=0xFFFFFF;
        }
    }

    resumePressed(){//resume was pressed so we have animations again and interactivity
        this.resume.visible=false;
        this.resume.interactive=false;
        if(this.topsrparkleanimation.paused()){
            this.topsrparkleanimation.play();
            this.botsparkleanimation.play();
            this.sparklearray.forEach(sparklechild => {
                sparklechild.parent.interactive=true;
            });
        }
            this._app.stage.children.forEach(child => {
                child.tint=0xFFFFFF;
                child.children.forEach(grandchild => {
                    grandchild.tint=0xFFFFFF;
                });
            });
    }

    activityDetected(){//we detected mouse activity so we stop the afk animation  
        this.winningboxanimation.pause(0);
        this.mynumbersanimation1.pause(0);
        this.mynumbersanimation2.pause(0);
        this.mynumbersanimation3.pause(0);
        this.mynumbersanimation4.pause(0);
        this.resetTimer();
    }

    resetTimer(){//timer to know how long the player is afk
        this.currseconds=0;
        clearInterval(this.timer);
        let x=this.startIdleTimer.bind(this);
        this.timer=window.setInterval(x, 1000);
    }
    startIdleTimer() {//since we count how long the player has being afk we use it for the animations 
        this.currseconds=this.currseconds+1;
        if(this.currseconds>15){
            this.winningboxanimation.play();
            if(this.counter<2){
                this.mynumbersanimation1.play();
                this.mynumbersanimation2.play();
                this.mynumbersanimation3.pause();
                this.mynumbersanimation4.pause();
                this.counter++;
            }
            else if(this.counter>=2){
                this.mynumbersanimation3.play();
                this.mynumbersanimation4.play();
                this.mynumbersanimation1.pause();
                this.mynumbersanimation2.pause();
                this.counter++;
                if(this.counter===4)
                    this.counter=0;
            }
        }
    }
    _state() {
        return store.getState().app;
    }

    _subscribe() {
        const unsubscribeCanRenderGameplay = store.subscribe(() => {
            const assetsAreLoaded = this._state().assetsAreLoaded;
            if (assetsAreLoaded) {
                unsubscribeCanRenderGameplay();
                this._createGame();
            }
        });
    }
}