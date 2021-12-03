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
        this.startButton = new Button(75,50,700-150,50,20,color(200,200,10),true,3,color(250));
        let offset = this.startButton.y + this.startButton.height + buttonDivide;
        this.optionButton = new Button(75,offset,700-150,50,20,color(200,100,10),true,3,color(250));
        offset = this.optionButton.y + this.optionButton.height + buttonDivide;
        this.endButton = new Button(75,offset,700-150,50,20,color(200,30,30),true,3,color(250));
        this.infoButton = new Button(width-70,height-70,50,50,50,color(0,0,255),true,5,color(250));

        this.infoOpen = false;

        this.tempInfoText = this.readInfoFile().replace(/\r\n/g,'');
        this.infoText = [];
        this.infoLineLen = 40;
        this.count = 0;

        while(this.count < this.tempInfoText.length)
        {
            let newIndex = min(this.tempInfoText.length - this.count, this.infoLineLen);
            this.infoText.push(this.tempInfoText.substring(this.count,this.count+newIndex))
            this.count += newIndex;
        }
    }
    
    readInfoFile()
    {
        textOut = [];
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", 'Assets/Data/Text/Startinfo.txt', false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = String(rawFile.responseText);
                    textOut = allText;
                }
            }
        }
        rawFile.send(null);
        return textOut;
    }

    display()
    {
        background(220);
        this.startButton.draw();
        this.optionButton.draw();
        this.endButton.draw();
        this.infoButton.draw();

        if(this.startButton.clicked())
            gameState = gameStates.World;

        if(this.endButton.clicked())
            gameState = gameStates.Title;

        stroke(0);
        strokeWeight(5);
        fill(255);
        textSize(35);
        textStyle(BOLD);
        text('NEW',this.startButton.x + 30, this.startButton.y + this.startButton.height - 12);
        text('OPTIONS',this.optionButton.x + 30, this.optionButton.y + this.optionButton.height - 12);
        text('EXIT',this.endButton.x + 30, this.endButton.y + this.endButton.height - 12);
        //text('i',this.infoButton.x + 25, this.infoButton.y + this.infoButton.height - 12)
        image(assets.getConst('Icon-Info_1'),this.infoButton.x+10, this.infoButton.y+10, 30,30);
        
        if(this.infoOpen)
        {   
            noStroke();
            fill(0,150);
            rect(0,0,width,height);

            fill(210);
            stroke(240);
            strokeWeight(7);
            
            push();
            translate(30,30);
            rect(0,0,width-60,height-60,70);
            rect(width/2 - 130, -25, 200, 45, 100)
            fill(0,0,120);
            stroke(240);
            strokeWeight(4);
            text('Information',width/2 - 110, 10);

            fill(60)

            text('Welcome to Furnimon!',width/2 - 155, 70);
            let offset = 120;
            for(let i = 0; i < this.infoText.length; i++)
            {
                text(this.infoText[i],20, offset);
                offset += 30;
            }
            pop();

            if(this.screenClicked())
            {
                this.infoOpen = false;
            }
        }

        if(this.infoButton.clicked())
            this.infoOpen = true;
    }
}
