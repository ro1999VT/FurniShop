let px = 0;
let py = 960;
let x,y;
let angle=0;
let enemyx;
let score=0;
let xc,yc;
let w=10;
let h=10;
let coindetect=false;
let offsetx=0;
let offsety=0;
let stepcount=10;


let flag=true;


let xspeed=0.5;
let yspeed = 1;
let x1direction =1;
var x2direction = 1;
let y1direction =1;
let y2direction =1;
let y3direction =1;

var  ymove= [120,100,100];
var xstatic = [280,90,220];
var ystatic = [100,250];
var xmove = [10,380];
var stopdist;


class WorldUI extends BaseUI
{ 
    constructor()
    {
        let animStarts = []
        let maxAnimTimer = []
        let startTimers = [];
        let timerTypes = []
        let operation = [];
        let tick = [];
        super(animStarts, maxAnimTimer, startTimers, timerTypes, operation, tick)

        this.w = assets.getConst('w');
        this.W = assets.getConst('W');
        this.h = assets.getConst('h');
        this.H = assets.getConst('H');
        this.d = assets.getConst('d');
        this.quad = assets.getConst('quad');
        this.v = assets.getConst('v');
        this.c = assets.getConst('c');
        //this.f = assets.getConst('f');
        this.s = assets.getConst('s');
        this.S = assets.getConst('S');
        this.t = assets.getConst('t');
        this.T = assets.getConst('T');
        this.b = assets.getConst('b');
        this.l = assets.getConst('l');

        this.mc1 = assets.getConst('mc1');
        this.mc2 = assets.getConst('mc2');
        this.mc3 = assets.getConst('mc3');
        this.mc4 = assets.getConst('mc4');


        this.stepsound = assets.getConst('Track-StepSound');
        this.theme = assets.getConst('Track-World_Theme');

        this.theme.setVolume(0.01)
        this.stepsound.playMode('restart');

        this.encounterChance = 0.15;

        this.worldMap = new WorldMap();
        this.player = new Player();
    }

    display()
    {
        background(248, 240, 227);

        this.worldMap.drawfloor(this);
        this.worldMap.drawmap(this);
    
        this.player.draw(this);
    }
}
  
class WorldMap
{

    hitbox(x,y,w,h)
    {
      fill(0)
      //noFill();
      //noStroke();
      rect(x,y,w,h);
    }
  
    drawmap(thisUI)
    { 
        for (var i = 0; i< tilemap.length; i++) 
        {
            for (var j =0; j < tilemap[i].length; j++) 
            {
                switch (tilemap[i][j]) 
                {
                    case 'w': image(thisUI.w, j*20-px, i*20-py, 20, 120);
                    break;
                    case 'W': image(thisUI.W, j*20, i*20-py, 20, 120);
                    break;
                    case 'h': image(thisUI.h, j*20-px,i*20-py,100,100);    
                    break;
                    case 'H': image(thisUI.H, j*20-px,i*20-py,80,80);  
                    break;
                    case 'q' : image(thisUI.quad, j*20-px, i*20-py, 120,120);
                    break;
                    case 'd': image(thisUI.d, j*20-px, i*20-py, 100,50)
                    break;
                    case 'v': image(thisUI.v, j*20-px, i*20-py, 40,100)
                    break;  
                    case 's': image(thisUI.s, j*20-px, i*20-py, 100,50)
                    break;
                    case 'S': image(thisUI.S,j*20-px, i*20-py, 200,200)
                    break;
                    case 't' : image(thisUI.t,j*20-px, i*20-py, 100,50)
                    break;
                    case 'T' : image(thisUI.T,j*20-px, i*20-py, 100,50)
                    break;
                    case 'b' : image(thisUI.b,j*20-px, i*20-py, 50,20)
                    break;
                    case 'l' : image(thisUI.l,j*20-px, i*20-py, 100,50)
                    break;
                }
            }
        }
    }
        
    drawfloor(thisUI)
    { 
        strokeWeight(1);
        for (var i = 0; i< floormap.length; i++) 
        {
            for (var j =0; j < floormap[i].length; j++) 
            {
                switch (floormap[i][j]) 
                {
                    
                    case 'c': image(thisUI.c, j*20-px, i*20-py, 100, 100);
                    break;
                    case 'f': 
                            stroke(100)
                            fill(200)
                            rect(j*20-px, i*20-py,20,20)
                            break;
                    case 'w': stroke(100)
                            fill(186, 140, 99)
                            rect(j*20-px, i*20-py,20,20)
                            break;
                }
            }
        }
    }   
}
  
  
const movement = 
{
  NONE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
}


class Player{

    constructor() 
    { 
        this.playStep =  false; 
        this.orientation  = movement.NONE;
        this.speed = 3;
        this.size = [32,45]
        this.halfsize = [this.size[0]/2, this.size[1]/2]
        this.maxEncounterSteps = 15;
        this.enounterSteps = this.maxEncounterSteps;
    }

    draw(thisUI)
    {
        let ox = px;
        let oy = py;

        // stroke(255)
        // fill(0)
        noStroke()
        noFill()
        rect(px,py,20,30) 
        if (keyIsDown(UP_ARROW))
        { 
            py = py - this.speed;   //Moves CHaracter
            this.orientation = movement.UP; //Draw Character Facing a particular direction
        }
        else if(keyIsDown(DOWN_ARROW))
        { 
            py = py + this.speed;
            this.orientation = movement.DOWN;
        }
        if (keyIsDown(LEFT_ARROW)){ 
            px = px - this.speed;
            this.orientation = movement.LEFT;
        }
        else if (keyIsDown(RIGHT_ARROW)){
            px = px + this.speed;
            this.orientation = movement.RIGHT;
        }

        if(floor(px/20) != floor(ox/20)  || floor(py/20)  != floor(oy/20))
        {
            if(this.enounterSteps > 0)
                this.enounterSteps--;
        }

        if(this.orientation == movement.DOWN || this.orientation == movement.NONE)
        image(thisUI.mc1,width/2-this.halfsize[0],height/2-this.halfsize[1],this.size[0],this.size[1]);
        else if(this.orientation == movement.UP)
        image(thisUI.mc2,width/2 -this.halfsize[0],height/2-this.halfsize[1],this.size[0],this.size[1]);
        else if(this.orientation == movement.LEFT)
        image(thisUI.mc3,width/2-this.halfsize[0],height/2-this.halfsize[1],this.size[0],this.size[1]);
        else if(this.orientation == movement.RIGHT)
        image(thisUI.mc4,width/2-this.halfsize[0],height/2-this.halfsize[1],this.size[0],this.size[1]);

        if(this.collision())
        {
            px = ox;
            py = oy;
            if (this.playStep)
            {
                this.playStep = false;
                thisUI.stepsound.stop();
            }
            }
            else
            {
            if ((keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || 
                keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)))
            {
                if(!this.playStep)     //Playes footstep sounds
                {
                this.playStep = true;
                thisUI.stepsound.play();
                thisUI.stepsound.loop();
                }
            }
            else if (this.playStep)
            {
                this.playStep = false;
                thisUI.stepsound.stop();
            }
        }

        // if(this.encounter){
        // //Insert Code for Battel Transision
        // noLoop()
        // }

        if(this.enounterSteps <= 0)
        {
            if(this.checkFloor() && this.randomEnounter(thisUI))
            {
                this.playStep = false;
                thisUI.stepsound.stop();
                this.enounterSteps = this.maxEncounterSteps;
                gameState = gameStates.Battle;
            }
        }   
    }

    //Function to Detect COllision with objects in Map
    collision()
    {
    for (let i = 0.1; i <= 0.9; i += 0.8)
    {
        for (let j = 0.1; j <= 0.9; j += 0.8)
        {
        let xNum = floor((px + width/2)/20 + i);
        let yNum = floor((py + height/2)/20 + j);
        if (xNum >= 0 && xNum < collisionmap[0].length && yNum >= 0 && yNum < collisionmap.length)
        {
            if (collisionmap[yNum][xNum] == '1')
            return true;
        }
        }
    }
    return false;
    }

    //Function to Detect COllision with objects in Map
    checkFloor()
    {
        for (let i = 0.1; i <= 0.9; i += 0.8)
        {
            for (let j = 0.1; j <= 0.9; j += 0.8)
            {
                let xNum = floor((px + width/2)/20 + i);
                let yNum = floor((py + height/2)/20 + j);
                if (xNum >= 0 && xNum < floormap[0].length && yNum >= 0 && yNum < floormap.length)
                {
                if (floormap[yNum][xNum] == 'c')
                    return true;
                }
            }
        }
        return false;
    }

    randomEnounter(thisUI)
    {
        return random() < thisUI.encounterChance;
    }
}
