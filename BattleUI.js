const BattleUITimers = {
    loadMainUI : 0,
    loadChars : 1,
    pulseText : 2, 
    pulseText2 : 3,
    buttonPress : 4
}

const BattleUIStates = {
    Main : 0,
    Fight : 1
}

class BattleUI extends BaseUI
{ 
    constructor()
    {
        let animStarts = [-50, -180, 0, 0, 0]
        let maxAnimTimer = [0, 0, 65, 25, 45]
        let startTimers = [true, true, true, true, true];
        let timerTypes = [0, 0, 2, 2, 0]
        let operation = [true, true, true, true, true];
        let tick = [1,3,1,1,1];
        super(animStarts, maxAnimTimer, startTimers, timerTypes, operation, tick)

        this.currentState = BattleUIStates.Main;

        textFont('Sans-Serif');

        this.buttonCurve = 30;
        this.bagButton = new Button(555,355,140,50,20,color(200));
        this.runButton = new Button(555,415,140,50,20,color(200));
        this.fightButton = new Button(405,355,140,50,20,color(200));
        this.charButton = new Button(405,415,140,50,20,color(200));

        this.backButton = new Button(405,360,270,100,0,color(0,0,0,0));
        this.fightOneButton = new Button(15,360,180,50,0,color(220),true,1,color(170));
        this.fightTwoButton = new Button(195,360,180,50,0,color(220),true,1,color(170));
        this.fightThreeButton = new Button(15,410,180,50,0,color(220),true,1,color(170));
        this.fightFourButton = new Button(195,410,180,50,0,color(220),true,1,color(170));

        this.fightUI = false
    }

    drawButton(arr, curve)
    {
        rect(arr[0], arr[1], arr[2], arr[3], curve);
    }

    display()
    {
        if(this.currentState == BattleUIStates.Main)
        {

            this.update();
            background(0)
            background(assets.getConst('Background-Battle_1')); 

            let charSlide = this.getAnimVal(BattleUITimers.loadChars)*5;
            image(assets.getConst('BattleGround-Ground_1'), 340-charSlide, 130, 340, 90);
            image(assets.getConst('BattleGround-Ground_1'), -110+charSlide, 300, 600, 170);
            
            fill(170,170);
            stroke(220);
            strokeWeight(6);
            let slideOff = this.getAnimVal(BattleUITimers.loadMainUI)*10;
            quad(-3,44, 241+slideOff,44, 276+slideOff,136, -3,136)
            quad(width+3,244, width-241-slideOff,244, width-276-slideOff,336, width+3,336)

            /*stroke(20);
            strokeWeight(4);
            quad(0,45, 240+slideOff,45, 275+slideOff,135, 0,135)
            quad(width,245, width-240-slideOff,245, width-275-slideOff,335, width,335)

            fill(200,200,190);
            noStroke();
            quad(0,50, 235+slideOff,50, 268+slideOff,130, 0,130)
            quad(width,250, width-235-slideOff,250, width-268-slideOff,330, width,330)*/
            
            slideOff /= 5;
            strokeWeight(2);
            rect(0,345-slideOff,width,height-345);

            fill(200);
            noStroke();

            print(this.getAnimVal(BattleUITimers.buttonPress))

            if(this.fightUI)
            {
                fill(255,170)
                rect(10,355,370,110);
                rect(400,355,280,110);
                
                fill(200)
                stroke(170);
                rect(15,360,360,100);
                rect(405,360,270,100);

                this.backButton.draw();
                this.fightOneButton.draw();
                this.fightTwoButton.draw();
                this.fightThreeButton.draw();
                this.fightFourButton.draw();

                if(this.animCompleted(BattleUITimers.buttonPress))
                {
                    if(this.backButton.clicked())
                    {
                        this.reset(BattleUITimers.buttonPress, true)
                        this.fightUI = false
                    }
                }
                else
                {
                    if(this.backButton.wasClicked)
                        this.backButton.wasClicked = false
                    if(this.fightOneButton.wasClicked)
                        this.fightOneButton.wasClicked = false 
                    if(this.fightTwoButton.wasClicked)
                        this.fightTwoButton.wasClicked = false 
                    if(this.fightThreeButton.wasClicked)
                        this.fightThreeButton.wasClicked = false 
                    if(this.fightFourButton.wasClicked)
                        this.fightFourButton.wasClicked = false 
                }
            }
            else if(this.animComplete(BattleUITimers.loadMainUI))
            {
                fill(255,170)
                rect(10,355-slideOff,370,110);
                
                fill(200)
                stroke(170);
                rect(15,360,360,100);

                let fightVal = this.fightButton.mouseOver();
                let bagVal = this.bagButton.mouseOver();
                let charVal = this.charButton.mouseOver();
                let runVal = this.runButton.mouseOver();

                textSize(25);
                let flashText = this.getAnimVal(BattleUITimers.pulseText)*4 + 40;
                if(!(fightVal || bagVal || charVal || runVal))
                    fill(50, flashText);
                else
                    fill(50);
                noStroke();
                text("What will you do?",112,420)

                this.bagButton.draw();
                this.runButton.draw();
                this.fightButton.draw();
                this.charButton.draw();

                let flashText2 = this.getAnimVal(BattleUITimers.pulseText2)*6 + 40;

                //if((fightVal || bagVal || charVal || runVal))
                    //this.runAnim(BattleUITimers.pulseText2);
                //else
                   // this.reset(BattleUITimers.pulseText2);

                textSize(25);
                textStyle(BOLD);
                if(fightVal)
                    fill(100, flashText2)
                else
                    fill(100);
                text('Attack',465.5,391.5);
                if(fightVal)
                {
                    fill(180,0,0, flashText2)
                    tint(255, flashText2);
                }
                else
                {
                    fill(180,0,0);
                    tint(255);
                }
                text('Attack',464,390);
                image(assets.getConst('Icon-Attack_1'),406,356.5,50,49);


                if(fightVal)
                    fill(100, flashText2)
                else
                    fill(100);
                text('Switch',461.5,451.5);

                if(charVal)
                {
                    fill(181,111,11, flashText2)
                    tint(255, flashText2);
                }
                else
                {
                    fill(181,111,11);
                    tint(255);
                }
                text('Switch',460,450);
                image(assets.getConst('Icon-Box_1'),402,415.5, 50,50);


                if(fightVal)
                    fill(100, flashText2)
                else
                    fill(100);
                text('Cart',621.5,391.5);
                if(bagVal)
                {
                    fill(0,0,180, flashText2)
                    tint(255, flashText2);
                }
                else
                {
                    fill(0,0,180);
                    tint(255);
                }
                text('Cart',620,390);
                image(assets.getConst('Icon-Cart_1'),559,356.5, 50,50);

                if(fightVal)
                    fill(100, flashText2)
                else
                    fill(100);
                text('Escape',611.5,451.5);
                if(runVal)
                {
                    fill(180, 0,180, flashText2);
                    tint(255, flashText2);
                }
                else
                {
                    fill(180, 0,180);
                    tint(255);
                }
                text('Escape',610,450);
                image(assets.getConst('Icon-Run_1'),554,416, 43,49.5);

                tint(255);
                
                if(this.animCompleted(BattleUITimers.buttonPress))
                {
                    if(this.runButton.clicked())
                        gameState = gameStates.World;
                    if(this.fightButton.clicked())
                    {
                        this.reset(BattleUITimers.buttonPress, true)
                        this.fightUI = true
                    }
                }
                else
                {
                    if(this.bagButton.wasClicked)
                        this.bagButton.wasClicked = false
                    if(this.runButton.wasClicked)
                        this.runButton.wasClicked = false 
                    if(this.fightButton.wasClicked)
                        this.fightButton.wasClicked = false 
                    if(this.charButton.wasClicked)
                        this.charButton.wasClicked = false 
                }
            }
        }
        //rect(15,360-slideOff,180,50);
        //rect(15+180,360-slideOff,180,50);
        //rect(15,360+50-slideOff,180,50);
        //rect(15+180,360+50-slideOff,180,50);
    }
}
