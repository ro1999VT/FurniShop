
const TitleUITimers = {
    SceneIntro : 0,
    SceneOne : 1,
    SceneTwo : 2,
    SceneTwo_Pause: 3,
    SceneTwo_One : 4,
    SceneThree : 5,
    SceneThree_Pause : 6,
    SceneThree_One : 7,
    SceneThree_Pause_2 : 8,
    SceneThree_Two : 9,
    SceneThree_Pause_3 : 10,
    End : 11
}

const TitleUIStates = {
    Anim : 0,
    Card : 1
}

class TitleUI extends BaseUI
{ 
    constructor()
    {
        let animStarts   = [0,0,0,0,0,0,0,0,0,0,0]
        let maxAnimTimer = [120,100,100,40,60,300,60,100,60,300,100]
        let startTimers  = [true,false,false,false,false,false,false,false,false,false,false];
        let timerTypes   = [0,0,0,0,0,0,0,0,0,0,0]
        let operation    = [true,true,true,true,true,true,true,true,true,true,true];
        let tick         = [1,1,1,1,1,1,1,1,1,1,1];
        super(animStarts, maxAnimTimer, startTimers, timerTypes, operation, tick)

        this.currentState = TitleUIStates.Anim;
        this.scenes = Object.values(TitleUITimers);
        this.currentScene = 0;
        textFont('Sans-Serif');

        //this.buttonCurve = 30;
        //this.bagButton = new Button(555,355,140,50,20,color(200));
    }

    display()
    {
        let c1 = color(0);
        let c2 = color(85);

        if(this.animComplete(this.scenes[this.currentScene]))
            this.runAnim(this.scenes[this.currentScene])

        switch(this.scenes[this.currentScene])
        {
            case TitleUITimers.SceneIntro:
                background(0)
                fill(255);
                textSize(35);
                textStyle(BOLD);
                text('© 2021   Rohit Selvam\n\t\t\t\t\t\t\t Malhar Gate', 200, 200)
                break;
            case TitleUITimers.SceneOne:
                if (!currentSong.isPlaying())
                    currentSong.play();
                background(this.getAnimVal(TitleUITimers.SceneOne))
                break;
            case TitleUITimers.SceneTwo:
                background(0);
                for(let i = 0; i < height; i++)
                {
                    stroke(lerpColor(c1,c2,map(i,0,height,0,1)));
                    line(0,i,width, i);
                }
                
                fill(255)
                rect(200-this.getAnimVal(TitleUITimers.SceneTwo)+100,100,map(this.getAnimVal(TitleUITimers.SceneTwo),0,100,0,300),300);
                fill(255, map(this.getAnimVal(TitleUITimers.SceneTwo),0,100,0,25))
                noStroke();
                ellipse(width/2,height/2, this.getAnimVal(TitleUITimers.SceneTwo)*8,this.getAnimVal(TitleUITimers.SceneTwo)*5)
                break;
            case TitleUITimers.SceneTwo_Pause:
                /*background(0);
                for(let i = 0; i < height; i++)
                {
                    stroke(lerpColor(c1,c2,map(i,0,height,0,1)));
                    line(0,i,width, i);
                }
                
                fill(255)
                rect(200,100,300,300);
                fill(255, 25)
                noStroke();
                ellipse(width/2,height/2, 800,500)*/
                break;
            case TitleUITimers.SceneTwo_One:
                background(0);
                for(let i = 0; i < height; i++)
                {
                    stroke(lerpColor(c1,c2,map(i,0,height,0,1)));
                    line(0,i,width, i);
                }
                let mult = map(this.getAnimVal(TitleUITimers.SceneTwo_One),0,this.maxAnimTimers[this.currentScene],0,50);
                noStroke();
                for(let i = 0; i < 5; i++)
                {
                    fill(255, map(i,0,4,255,35))
                    rect(200 - i*mult, 100 - i*mult, 300 + i*mult*2, 300 + (i+0.5)*mult);
                }
                fill(255, 25)
                ellipse(width/2,height/2,1000,800)
                break;
            case TitleUITimers.SceneThree:
                background(0);
                let lightNums = floor(map(this.getAnimVal(TitleUITimers.SceneThree),0,this.maxAnimTimers[this.currentScene],0,5));
                //let lightNums = 5;
                for(let i = 0; i < lightNums; i++)
                {   
                    if(i >= 0)
                        image(assets.getConst('BattleGround-Ground_1'), width/2 - 220, 300, 440, 110);
                    if (i >= 1)
                        image(assets.getConst('BattleGround-Ground_1'), width/2 - 150, 200, 300, 70);
                    if (i >= 2)
                        image(assets.getConst('BattleGround-Ground_1'), width/2 - 90, 145, 180, 40);
                    if (i >= 3)
                        image(assets.getConst('BattleGround-Ground_1'), width/2 - 55, 110, 110, 20);
                    if (i >= 4)
                        image(assets.getConst('BattleGround-Ground_1'), width/2 - 35, 90, 70, 10);
                }
                break;
            case TitleUITimers.SceneThree_Pause:
                break;
            case TitleUITimers.SceneThree_One:
                background(0)
                let off = this.getAnimVal(TitleUITimers.SceneThree_One)/2;
                let off2 = off/2;
                let off3 = off/4;
                let off4 = off/6;
                image(assets.getConst('BattleGround-Ground_1'), width/2 - 220+off3, 300-off, 440-off2, 110-off4);
                image(assets.getConst('BattleGround-Ground_1'), width/2 - 150+off3, 200-off + off2, 300-off2,  70-off4);
                image(assets.getConst('BattleGround-Ground_1'), width/2 - 90+off3,  145-off + off2*1.5, 180-off2,  40-off4);
                image(assets.getConst('BattleGround-Ground_1'), width/2 - 55+off3,  110-off + off, 110-off2,  20-off4);
                image(assets.getConst('BattleGround-Ground_1'), width/2 - 35+off3,   90-off + off*1.1,  70-off2,  10-off4/2);

                image(assets.getConst('Character-Player_1'), this.getAnimVal(TitleUITimers.SceneThree_One)*2-180, 200, 210, 250);
                break;
            case TitleUITimers.SceneThree_Pause_2:
                break;
            case TitleUITimers.SceneThree_Two:
                background(0);
                background(0);
                let maxVal = this.maxAnimTimers[this.currentScene];
                let div = int(maxVal/5);
                let stepNums = floor(map(this.getAnimVal(TitleUITimers.SceneThree_Two),0,maxVal,5,0));

                for(let i = 0; i < stepNums; i++)
                {   
                    if(i >= 0)
                        image(assets.getConst('BattleGround-Ground_1'), width/2 - 207.5, 250, 415, 101.666);
                    if (i >= 1)
                        image(assets.getConst('BattleGround-Ground_1'), width/2 - 137.5, 175, 275,  61.666);
                    if (i >= 2)
                        image(assets.getConst('BattleGround-Ground_1'), width/2 - 77.5,  132.5, 155,  31.666);
                    if (i >= 3)
                        image(assets.getConst('BattleGround-Ground_1'), width/2 - 42.5,  110, 85,  11.666);
                    if (i >= 4)
                        image(assets.getConst('BattleGround-Ground_1'), width/2 - 22.5,  95,  45,  5.8333);
                    if (i >= 5)
                        image(assets.getConst('Character-Player_1'), this.getAnimVal(TitleUITimers.SceneThree_One)*2-180, 200, 210, 250);
                }

                fill(0, map(stepNums,5,0,0,255))
                rect(200 - map(stepNums,5,0,0,180),50, width - 400 + map(stepNums,5,0,0,360), 35*map(stepNums,5,0,0,5))

                image(assets.getConst('Anim-Gang_1'), 300 - map(stepNums,5,0,0,100) - map(stepNums,5,0,0,180),50, width - 600 + map(stepNums,5,0,0,200) + map(stepNums,5,0,0,360), 35*map(stepNums,5,0,0,5))

                fill(0,map((this.getAnimVal(TitleUITimers.SceneThree_Two)-2)%div,0,div,0,255));
                rect(0,0,width,height)
                break; 
            case TitleUITimers.SceneThree_Pause_3:
                break;
            case TitleUITimers.End:
                gameState = gameStates.Start
                if (currentSong.isPlaying())
                    currentSong.stop();
                break;
            default:
                break;
        }

        fill(0)
        rect(0,0,width,40)
        rect(0,height-50,width,50)

        if(this.animCompleted(this.scenes[this.currentScene]))
            this.currentScene++;

        this.update();
    }
}
