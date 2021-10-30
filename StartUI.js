const StartUITimers = {
    loadMainUI : 0,
    loadChars : 1,
    pulseText : 2, 
    pulseText2 : 3
}

const StartUIStates = {
    Main : 0,
    Options : 1
}

class StartUI extends BaseUI
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

        this.currentState = StartUIStates.Main;

        textFont('Sans-Serif');

        let buttonDivide = 20;
        this.buttonCurve = 30;
        //this.bagButton = new Button(555,355,140,50,20,color(200));
        this.startButton = new Button(75,50,700-150,50,20,color(200,200,10),true,3,color(220));
        let offset = this.startButton.y + this.startButton.height + buttonDivide;
        this.optionButton = new Button(75,offset,700-150,50,20,color(200,100,10),true,3,color(220));
        offset = this.optionButton.y + this.optionButton.height + buttonDivide;
        this.endButton = new Button(75,offset,700-150,50,20,color(200,30,30),true,3,color(220));
    }

    display()
    {
        background(200);
        this.startButton.draw();
        this.optionButton.draw();
        this.endButton.draw();

        stroke(0);
        strokeWeight(5);
        fill(255);
        textSize(35);
        textStyle(BOLD);
        text('NEW',this.startButton.x + 30, this.startButton.y + this.startButton.height - 12)
        text('OPTIONS',this.optionButton.x + 30, this.optionButton.y + this.optionButton.height - 12)
        text('EXIT',this.endButton.x + 30, this.endButton.y + this.endButton.height - 12)
    }
}
