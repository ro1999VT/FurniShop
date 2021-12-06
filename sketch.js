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
  initializeWorldTracks()
}

function setup() {
  // Initialization goes here
  frameRate(60);
  oldGameState = gameStates.Title;
  gameState = gameStates.Title;
  globalSpeedMult = 1;

  restoreStatsAfterBattle = true;

  showFPS = true;
  moveList = [];

  encounterLegendary  = false;

  initializeAssets();
  initializeWorldAssets();

  enemyFurnimon = null //new Furnimon(furnimonList[0].copy(), 3, [moveList[1], moveList[2]]);
  currentFurnimon = getRandomFurnimon(random([3,4,5])) //new Furnimon(furnimonList[0].copy(), 5, [moveList[1], moveList[2]]);

  createCanvas(700, 475);
  UIVersions = [new TitleUI(), new StartUI(), new WorldUI(),0, new BattleUI(),0]

  currentSong = assets.getConst('Track-Start_1');
  currentSong.setVolume(0.1)
  SongVersions = [currentSong, null, assets.getConst('Track-World_Theme'), null, assets.getConst('Track-Battle_1')]

  newFont = loadFont('Assets/Fonts/pkmndp.ttf');
  textFont(newFont);
}

function mouseClicked()
{
  if(gameState == gameStates.Title)
    gameState = gameStates.Start;
  
  //if (currentSong.isPlaying())
    //currentSong.stop();
}

function draw() {
  oldGameState = gameState;
  UIVersions[gameState].display();

  if (oldGameState != gameState)
  {
    if(SongVersions[oldGameState] != null)
      SongVersions[oldGameState].stop()
    if(SongVersions[gameState] != null)
    {
      SongVersions[gameState].setVolume(0.1)
      SongVersions[gameState].play()
    }
    if(oldGameState == gameStates.Battle)
    {
      currentFurnimon = UIVersions[gameStates.Battle].frenFurnimon
      UIVersions[gameStates.Battle] = new BattleUI()
      textFont(newFont);
    }
    if(gameState == gameStates.Battle)
    {
      UIVersions[gameStates.Battle] = new BattleUI()
    }
  }

  if(showFPS)
  {
    push();
    textSize(10);
    fill(255);
    textStyle(NORMAL);
    text('FPS: ' + round(frameRate(),2), 0, 10)
    pop();
  }
}