const BattleUITimers = {
    loadMainUI : 0,
    loadChars : 1,
    pulseText : 2, 
    pulseText2 : 3,
    buttonPress : 4,
    fightVisual : 5,
    messageTimer : 6,
    compressTimer : 7
}

const BattleUIStates = {
    Anim : 0,
    Main : 1,
    Fight : 2,
    FightAnim : 3,
    EndBattle : 4,
    Swap : 5
}

class BattleUI extends BaseUI
{ 
    constructor(wildBattle = true, difficulty = AIDifficulties.easy, enemy = null)
    {
        let animStarts = [-50, -180, 0, 0, 0, 0, 0, 0]
        let maxAnimTimer = [0, 0, 65, 25, 12, 60, 120, 100]
        let startTimers = [true, true, true, true, true, false, false, false];
        let timerTypes = [0, 0, 2, 2, 0, 0, 0, 0]
        let operation = [true, true, true, true, true, true, true, true];
        let tick = [1,3,1,1,1,1,1,1];
        super(animStarts, maxAnimTimer, startTimers, timerTypes, operation, tick)

        this.currentState = BattleUIStates.Anim;

        this.wildBattle = wildBattle

        this.buttonCurve = 30;
        this.bagButton = new Button(555,355,140,50,20,color(200));
        this.runButton = new Button(555,415,140,50,20,color(200));
        this.fightButton = new Button(405,355,140,50,20,color(200));
        this.charButton = new Button(405,415,140,50,20,color(200));

        this.swapButton = new Button(205,400,140,50,20,color(200),true,1,color(170));
        this.noSwapButton =  new Button(355,400,140,50,20,color(200),true,1,color(170));

        this.fightUI = false
        print(encounterLegendary)
        if (enemy != null)
            this.enemyFurnimon = enemy;
        else if (encounterLegendary)
            this.enemyFurnimon = getLegendary();
        else
        {
            let level = int(currentFurnimon.level + random(-5,5) + random(-5,5))
            if (level < 1)
                level = 1
            this.enemyFurnimon = getRandomFurnimon(level);
        }
        this.frenFurnimon =  currentFurnimon
        //this.frenFurnimon.base.battleStats.energy = 2
        //this.enemyFurnimon.base.battleStats.hp = 2
        this.enemyAI = new EnemyAI(this.enemyFurnimon, difficulty)
        this.moveCoords = [[35, 390], [215,390], [35, 440], [215, 440]]
        this.currentMove = -1;

        let afftinityColors = new Map();
        afftinityColors.set("Space", color(65,74,76)).set("General", color(220)).set("Heat", color(245,214,210)) 
        afftinityColors.set("Electric", color(170,190,200)).set("Light", color(225,224,210)).set("None", color(220))
        afftinityColors.set("Air", color(200,205,200))

        this.backButton = new Button(405,360,270,100,0,color(0,0,0,0));
        this.fightOneButton = new Button(15,360,180,50,0,(afftinityColors.get(this.frenFurnimon.getMove(0).affinity) || color(220)),true,1,color(170));
        this.fightTwoButton = new Button(195,360,180,50,0,(afftinityColors.get(this.frenFurnimon.getMove(1).affinity) || color(220)),true,1,color(170));
        this.fightThreeButton = new Button(15,410,180,50,0,(afftinityColors.get(this.frenFurnimon.getMove(2).affinity) || color(220)),true,1,color(170));
        this.fightFourButton = new Button(195,410,180,50,0,(afftinityColors.get(this.frenFurnimon.getMove(3).affinity) || color(220)),true,1,color(170));

        this.fightAnimCount = 0;
        this.frenGoesFirst = false;
        this.enemyNextMove = moveList[0];
        this.fightFadeIn = true;
        this.victory = false;
        this.fightMessage = "";

        this.compressEnemy = false;
        this.compressFren = false;
        this.enemyCompress = 0;
        this.frenCompress = 0;
    }

    drawButton(arr, curve)
    {
        rect(arr[0], arr[1], arr[2], arr[3], curve);
    }

    constDisplay()
    {
        background(0)
        background(assets.getConst('Background-Battle_1')); 

        let charSlide = this.getAnimVal(BattleUITimers.loadChars)*5;
        image(assets.getConst('BattleGround-Ground_1'), 340-charSlide, 130, 340, 90);
        image(assets.getConst('BattleGround-Ground_1'), -110+charSlide, 300, 600, 170);

        // Center = 510, 175 // Center = 193, 385
        if (this.compressEnemy)
        {
            if (this.enemyCompress < 100)
            {
                image(this.enemyFurnimon.base.assets[0], 510-this.enemyFurnimon.base.size[0]/2-charSlide, 
                    map(this.enemyCompress, 0, 100, 175-this.enemyFurnimon.base.size[1], 175), this.enemyFurnimon.base.size[0], 
                    map(this.enemyCompress, 0, 100, this.enemyFurnimon.base.size[1], 0));
            }
        }
        else
        {
            image(this.enemyFurnimon.base.assets[0], 510-this.enemyFurnimon.base.size[0]/2-charSlide, 
                  175-this.enemyFurnimon.base.size[1], this.enemyFurnimon.base.size[0], this.enemyFurnimon.base.size[1]);
        }

        if(this.compressFren)
        {
            if (this.frenCompress < 100)
            {
                image(this.frenFurnimon.base.assets[1], 193-this.frenFurnimon.base.size[2]/2+charSlide, 
                    map(this.frenCompress, 0, 100, 385-this.frenFurnimon.base.size[3], 385), this.frenFurnimon.base.size[2], 
                    map(this.frenCompress, 0, 100, this.frenFurnimon.base.size[3], 0));
            }
        }
        else
        {
            image(this.frenFurnimon.base.assets[1], 193-this.frenFurnimon.base.size[2]/2+charSlide, 
                385-this.frenFurnimon.base.size[3], this.frenFurnimon.base.size[2], this.frenFurnimon.base.size[3]);
        }
        //image(assets.getConst('Character-Player_1'), -300-charSlide/3, 200, 210, 250)
    }

    constUI()
    {
        fill(170,170);
        stroke(220);
        strokeWeight(6);
        let slideOff = this.getAnimVal(BattleUITimers.loadMainUI)*10;
        quad(-3,44, 241+slideOff,44, 276+slideOff,136, -3,136)
        quad(width+3,244, width-241-slideOff,244, width-276-slideOff,336, width+3,336)

        
        slideOff /= 5;
        strokeWeight(2);
        rect(0,345-slideOff,width,height-345);

        fill(200);
        noStroke();
        return slideOff
    }

    messageUI()
    {
        fill(170,170);
        stroke(220);
        strokeWeight(6);
        strokeWeight(2);
        rect(0,345,width,height-345);

        fill(255,170)
        rect(10,355,680,110);
        
        fill(200)
        stroke(170);
        rect(15,360,670,100);
    }

    showFightInfo()
    {
        textSize(25);
        fill(255);
        stroke(0);
        strokeWeight(5);
        text(this.enemyFurnimon.getName(), 30, 75);
        text(this.frenFurnimon.getName(), 490, 277);

        textSize(20);
        strokeWeight(4);
        text(String(this.enemyFurnimon.base.battleStats.hp) + '/' + 
            String(this.enemyFurnimon.base.currentStats.hp), 170, 120) // y = 120, 83 alt
        text(String(this.frenFurnimon.base.battleStats.hp) + '/' + 
            String(this.frenFurnimon.base.currentStats.hp), 630, 322)

        text("Lv " + String(this.enemyFurnimon.level), 180, 75);
        text("Lv " + String(this.frenFurnimon.level), 640, 277);

        //textSize(18)
        //text(String(this.enemyFurnimon.base.battleStats.energy) + '/' + 
            //String(this.enemyFurnimon.base.currentStats.energy), 170, 118) // y = 120
        //text(String(this.frenFurnimon.base.battleStats.hp) + '/' + 
            //String(this.frenFurnimon.base.currentStats.hp), 630, 322)

        fill(30,0,0)
        strokeWeight(2);
        rect(30,90,190,10)
        rect(490,292,190,10)
        rect(30,105,130,8)
        rect(490,307,130,8)

        fill(0,200,0)
        let enemyDiff = this.enemyFurnimon.base.battleStats.hp/this.enemyFurnimon.base.currentStats.hp;
        let frenDiff = this.frenFurnimon.base.battleStats.hp/this.frenFurnimon.base.currentStats.hp;

        if (enemyDiff <= 0.5 && enemyDiff > 0.25)
            fill(200,200,0)
        else if (enemyDiff <= 0.25)
            fill(200,0,0)
        rect(30,90,190*enemyDiff,10)

        fill(0,200,0)
        if (frenDiff <= 0.5 && frenDiff > 0.25)
            fill(200,200,0)
        else if (frenDiff <= 0.25)
            fill(200,0,0)
        rect(490,292,190*frenDiff,10)

        enemyDiff = this.enemyFurnimon.base.battleStats.energy/this.enemyFurnimon.base.currentStats.energy;
        frenDiff = this.frenFurnimon.base.battleStats.energy/this.frenFurnimon.base.currentStats.energy;

        fill(0,220,220)
        rect(30,105,130*enemyDiff,8)
        rect(490,307,130*frenDiff,8)

        frenDiff = this.frenFurnimon.currentExp/this.frenFurnimon.currentMaxExp;

        noStroke();
        fill(230,220,0,70);
        rect(490,282,190,3);

        fill(220,210,0)
        rect(490,282,190*frenDiff,3);

        noStroke();
    }

    exitBattle()
    {
        this.reset(BattleUITimers.loadChars, true)
        this.reset(BattleUITimers.loadMainUI, true)
        if(restoreStatsAfterBattle)
            this.frenFurnimon.restoreStats()
        this.currentState = BattleUIStates.Anim
    }

    display()
    {
        this.update();
        this.constDisplay();
        let slideOff = this.getAnimVal(BattleUITimers.loadMainUI)*10;
        let flashText;
        switch(this.currentState)
        {
            case BattleUIStates.Anim:
                this.constUI()
                if(this.animComplete(BattleUITimers.loadMainUI))
                    this.currentState = BattleUIStates.Main
                break;
            case BattleUIStates.Main:
                this.constUI()
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
                flashText = this.getAnimVal(BattleUITimers.pulseText)*4 + 40;
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

                this.showFightInfo()

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
                    {
                        this.exitBattle();
                        gameState = gameStates.World;
                    }
                    if(this.fightButton.clicked())
                    {
                        this.reset(BattleUITimers.buttonPress, true)
                        this.currentState = BattleUIStates.Fight
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
                break;

            case BattleUIStates.Fight:
                this.constUI()
                fill(255,170)
                rect(10,355,370,110);
                rect(400,355,280,110);
                
                fill(200)
                stroke(170);
                rect(15,360,360,100);
                rect(405,360,270,100);

                this.showFightInfo()

                this.backButton.draw();
                this.fightOneButton.draw();
                this.fightTwoButton.draw();
                this.fightThreeButton.draw();
                this.fightFourButton.draw();

                let oneVal = this.fightOneButton.mouseOver();
                let twoVal = this.fightTwoButton.mouseOver();
                let threeVal = this.fightThreeButton.mouseOver();
                let fourVal = this.fightFourButton.mouseOver();
                let fightButtonVals = [oneVal, twoVal, threeVal, fourVal]
                
                for (let i = 0; i < 4; i++)
                {
                    let move = this.frenFurnimon.getMove(i)
                    if(move.id != 0)
                    {
                        push();
                        textSize(25);
                        fill(220);
                        strokeWeight(4);
                        stroke(45);
                        textAlign(CENTER);
                        text(move.name,this.moveCoords[i][0] + 73,this.moveCoords[i][1]);
                        pop();
                        textSize(23);
                        strokeWeight(2);
                        if(this.frenFurnimon.base.battleStats.energy >= move.cost)
                        {
                            fill(0,200,200);
                            stroke(0,130,130);
                        }
                        else
                        {
                            fill(200,0,0);
                            stroke(130,0,0);
                        }
                        text(move.cost,this.moveCoords[i][0] + 135,this.moveCoords[i][1] + 10);
                        fill(200,0,0);
                        stroke(0);
                        strokeWeight(1);
                        text(move.damage,this.moveCoords[i][0] - 10,this.moveCoords[i][1] + 10);
                    }
                }
                noStroke();

                //noStroke();
                let noButtons = true;
                for(let i = 0; i < 4; i++)
                {
                    if(fightButtonVals[i] && this.frenFurnimon.getMove(i).id != 0)
                    {
                        let move = this.frenFurnimon.getMove(i)
                        textSize(30);
                        fill(220);
                        stroke(35);
                        strokeWeight(4);
                        text(move.name,435,390)
                        textSize(17);
                        fill(0);
                        strokeWeight(0);

                        let tempText = move.description
                        let descrText = []
                        let count = 0
                        let lineLen = 33
                        while(count < tempText.length)
                        {
                            let newIndex = min(tempText.length - count, lineLen);
                            descrText.push(tempText.substring(count,count+newIndex))
                            count += newIndex;
                        }
                        //text(,435,410)
                        for(let i = 0; i < descrText.length; i++)
                        {
                            text(descrText[i], 435, 410 + i*16);
                        }   

                        let energy = this.frenFurnimon.base.battleStats.energy
                        textSize(16);
                        strokeWeight(1);
                        if(energy >= move.cost)
                        {
                            fill(0,180,220);
                            stroke(0,120,120);
                        }
                        else
                        {
                            fill(180,0,0);
                            stroke(120,0,0);
                        }
                        text("Energy Cost: " + String(move.cost) + " (" + 
                             String(energy) + " -> " + String(energy - move.cost) + ")", 435, 456);
                        noButtons = false;
                        break;
                    }
                }

                if(noButtons)
                {
                    textSize(20);
                    flashText = this.getAnimVal(BattleUITimers.pulseText)*4 + 40;
                    if(!(oneVal || twoVal || threeVal || fourVal))
                        fill(50, flashText);
                    else
                        fill(50);
                    noStroke();
                    text("Click to return to menu",455,420)
                }

                oneVal = this.fightOneButton.clicked();
                twoVal = this.fightTwoButton.clicked();
                threeVal = this.fightThreeButton.clicked();
                fourVal = this.fightFourButton.clicked();
                fightButtonVals = [oneVal, twoVal, threeVal, fourVal]

                if(this.animCompleted(BattleUITimers.buttonPress))
                {
                    if(this.backButton.clicked())
                    {
                        this.reset(BattleUITimers.buttonPress, true)
                        this.currentState = BattleUIStates.Main
                    }
                    for(let i = 0; i < 4; i++)
                    { 
                        if(fightButtonVals[i] && this.frenFurnimon.getMove(i).id != 0)
                        {
                            this.currentMove = i
                            this.runAnim(BattleUITimers.messageTimer)
                            // See who goes first based on speed, if tie, either one has a 50% chance
                            if ((this.frenFurnimon.base.battleStats.speed > this.enemyFurnimon.base.battleStats.speed) ||
                                ((this.frenFurnimon.base.battleStats.speed == this.enemyFurnimon.base.battleStats.speed) && 
                                random() < 0.5))
                                this.frenGoesFirst = true
                            else
                                this.frenGoesFirst = false
                            this.enemyNextMove = this.enemyAI.getNextMove(this.frenFurnimon);
                            mouseIsPressed = false;
                            this.fightMessage = ""
                            this.currentState = BattleUIStates.FightAnim
                            break;
                        }
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
                break;
            case BattleUIStates.FightAnim:
                this.constUI();
                this.showFightInfo();
                this.messageUI();
                push();
                textSize(25);
                fill(50)
                noStroke();
                textAlign(CENTER);
                if ((this.frenGoesFirst && this.fightAnimCount == 0) || (!this.frenGoesFirst && this.fightAnimCount == 1))
                    text(String(this.frenFurnimon.getName()) + " used " + this.frenFurnimon.moves[this.currentMove].name,350,420)
                else 
                    text("Enemy " + String(this.enemyFurnimon.getName()) + " used " + this.enemyNextMove.name,350,420)
                text(this.fightMessage, 350, 443)
                pop();

                if(this.animCompleted(BattleUITimers.messageTimer) || (!this.animCompleted(BattleUITimers.messageTimer) && mouseIsPressed))
                {
                    this.reset(BattleUITimers.messageTimer);
                    this.runAnim(BattleUITimers.fightVisual);
                } 

                let twoThirdsAnim = this.maxAnimTimers[BattleUITimers.fightVisual]*0.5;
                let temp = []
                if(this.getAnimVal(BattleUITimers.fightVisual) < twoThirdsAnim)
                    fill(255,map(this.getAnimVal(BattleUITimers.fightVisual), 0, twoThirdsAnim, 0, 255))
                else
                {
                    fill(255,map(this.getAnimVal(BattleUITimers.fightVisual), twoThirdsAnim, this.maxAnimTimers[BattleUITimers.fightVisual], 255, 0))
                    if (this.fightFadeIn)
                    {
                        this.fightFadeIn = false;
                        //print(this.frenGoesFirst, this.fightAnimCount)
                        if ((this.frenGoesFirst && this.fightAnimCount == 0) || (!this.frenGoesFirst && this.fightAnimCount == 1))
                            temp = this.enemyFurnimon.calculateDamage(this.frenFurnimon, this.frenFurnimon.moves[this.currentMove])
                        else
                            temp = this.frenFurnimon.calculateDamage(this.enemyFurnimon, this.enemyNextMove)

                        if(temp[1])
                            this.fightMessage = temp[2]
                    }                
                }
                rect(0,0,width,height);

                if(this.animCompleted(BattleUITimers.fightVisual))
                {
                    if(this.enemyFurnimon.base.battleStats.hp <= 0)
                    {
                        this.victory = true
                        this.compressEnemy = true
                        this.runAnim(BattleUITimers.messageTimer);
                        this.currentState = BattleUIStates.EndBattle;
                        break;
                    }
                    else if (this.frenFurnimon.base.battleStats.hp <= 0)
                    {
                        this.victory = false
                        this.compressFren = true
                        this.runAnim(BattleUITimers.messageTimer);
                        this.currentState = BattleUIStates.EndBattle;
                        break;
                    }
                    this.reset(BattleUITimers.fightVisual);
                    if(this.fightAnimCount < 1)
                    {
                        this.fightAnimCount += 1
                        this.runAnim(BattleUITimers.messageTimer)
                    }
                    else
                    {
                        this.fightFadeIn = true;
                        this.fightAnimCount = 0;
                        this.currentState = BattleUIStates.Main;
                        break;
                    }
                    this.fightMessage = ""
                    this.fightFadeIn = true;
                }
                break;
            case BattleUIStates.EndBattle:
                this.constUI();
                this.showFightInfo();
                this.messageUI();

                if(!this.animCompleted(BattleUITimers.messageTimer))
                {
                    push();
                    textSize(25);
                    fill(50)
                    noStroke();
                    textAlign(CENTER);
                    if (!this.victory)
                        text(String(this.frenFurnimon.getName()) + " was disassembled!",350,420)
                    else 
                        text("Enemy " + String(this.enemyFurnimon.getName()) + " was disassembled!",350,420)
                    pop();
                }

                if(this.animCompleted(BattleUITimers.messageTimer) || mouseIsPressed)
                {
                    this.reset(BattleUITimers.messageTimer);
                    this.runAnim(BattleUITimers.compressTimer);
                } 

                if(this.victory)
                    this.enemyCompress = this.getAnimVal(BattleUITimers.compressTimer)
                else
                    this.frenCompress = this.getAnimVal(BattleUITimers.compressTimer)

                    
                if(this.animCompleted(BattleUITimers.compressTimer))
                {
                    this.reset(BattleUITimers.compressTimer);
                    this.frenFurnimon.calculateExpGain(this.enemyFurnimon, !this.victory)
                    if(this.victory && this.wildBattle)
                        this.currentState = BattleUIStates.Swap;
                    else
                    {
                        this.exitBattle();
                        gameState = gameStates.World;
                    }
                } 
                break;
            case BattleUIStates.Swap:
                this.messageUI();
                
                this.swapButton.draw()
                this.noSwapButton.draw()

                push();
                textSize(25);
                fill(50)
                noStroke();
                textAlign(CENTER);
                text(String("Swap current furnimon?"),350,390)
                stroke(0,100,0)
                strokeWeight(1)
                fill(0,150,0)
                text(String("Swap"),277,432)
                stroke(150,0,0)
                fill(200,0,0)
                text(String("Don't Swap"),430,432)
                pop();

                if(this.swapButton.clicked())
                {
                    this.frenFurnimon = this.enemyFurnimon
                    this.compressEnemy = false;
                    this.compressFren = false;
                    this.enemyCompress = 0;
                    this.frenCompress = 0;
                    this.exitBattle();
                    gameState = gameStates.World;
                }

                if(this.noSwapButton.clicked())
                {
                    this.exitBattle();
                    this.compressEnemy = false;
                    this.compressFren = false;
                    this.enemyCompress = 0;
                    this.frenCompress = 0;
                    gameState = gameStates.World;
                }
                break;
            
        }
        //rect(15,360-slideOff,180,50);
        //rect(15+180,360-slideOff,180,50);
        //rect(15,360+50-slideOff,180,50);
        //rect(15+180,360+50-slideOff,180,50);
    }
}
