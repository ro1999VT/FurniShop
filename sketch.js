const gameStates = {
  Title : 0,
  Start : 1,
  World : 2,
  Cutscene : 3,
  Battle : 4,
  Lose : 5
}

function preload()
{
  assets = new AssetManager();
  initializeTracks();
}

function setup() {
  // Initialization goes here
  frameRate(60);
  oldGameState = gameStates.Title;
  gameState = gameStates.Title;
  globalSpeedMult = 1;

  showFPS = true;
  moveList = [];

  initializeAssets();
  UIVersions = [new TitleUI(), new StartUI(),0,0, new BattleUI(),0]
  
  createCanvas(700, 475);

  newFont = loadFont('Assets/Fonts/pkmndp.ttf');
  textFont(newFont);

  currentSong = assets.getConst('Track-Battle_1');
}

function mouseClicked()
{
  /*if(menu && !(mouseX < startGameButton[0] || mouseX > startGameButton[0] + startGameButton[2] || mouseY < startGameButton[1] || mouseY > startGameButton[1] + startGameButton[3]))
  {  
    menu = false;
    gameRunning = true;
  }*/

  if(gameState == gameStates.Title)
    gameState = gameStates.Start;
}

function draw() {
  //if (!currentSong.isPlaying())
    //currentSong.play();
  UIVersions[gameState].display();
  if(showFPS)
  {
    textSize(10);
    fill(255);
    textStyle(NORMAL);
    text('FPS: ' + round(frameRate(),2), 0, 10)
  }
}