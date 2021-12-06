/*
Affinities:

Space (Contain)
Hold (Suspend)
Soft
Flexible
Force
Reflect
Heat
Fire
Cool
Light
Absorb
Liquid
Time
Air
Metal
Wood
Plastic
Electric

*/

function readTextFile(file, type)
{
  textOut = [];
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4)
    {
      if(rawFile.status === 200 || rawFile.status == 0)
      {
        var allText = rawFile.responseText;
        tempArr = allText.split('\r\n');
        if(type == 'moves')
        {
          for (let i = 1; i < tempArr.length; i++)
          {
            temp = tempArr[i].split(';');
            temp[0] = int(temp[0]);
            temp[2] = int(temp[2]);
            temp[3] = int(temp[3]);
            textOut.push(new Move(temp));
          }
        }
        else if(type == 'furnimon')
        {
          // id, name, hp, attack, special attack, defense, special defense, speed, accuracy, max energy, weight (lbs), base experience, img width, img height, back width, back height
          for (let i = 1; i < tempArr.length; i++)
          {
            temp = tempArr[i].split(';');
            temp[12] = temp[12].split(',');
            for(let j = 2; j <= 11; j++)
              temp[j] = float(temp[j]);
            for(let j = 13; j <= 16; j++)
              temp[j] = int(temp[j]);
            let x;
            let y;
            x = loadImage('Assets/Images/Furnimon/' + temp[0] + '.png', x => {}, (event) => { x = loadImage('Assets/Images/Furnimon/0.png') } );
            y = loadImage('Assets/Images/Furnimon/' + temp[0] + '_1.png', y => {}, (event) => { y = loadImage('Assets/Images/Furnimon/0.png') } );
            temp[0] = int(temp[0]);

            //print(temp, temp[2] + temp[3] + temp[4] + temp[5] + temp[6] + temp[7], temp[9], temp[10])
            textOut.push(new BaseFurnimon(temp[0], temp[1], new Stats(temp[2], temp[3], 
                         temp[4], temp[5], temp[6], temp[7], temp[8], temp[9], temp[10]), [x,y], temp[11], temp[12], [temp[13],temp[14],temp[15],temp[16]]));
          }
        }
      }
    }
  }
  rawFile.send(null);
  return textOut;
}

function getRandomFurnimon(level, index = null)
{
  let base = 0;
  if (index == null)
  {
    base = random(furnimonList).copy()
    // Check if legendary - implement and add to when adding legendaries
    while(base.id >= 1000)
      base = random(furnimonList).copy()
  }
  else
    base = furnimonList[index].copy()
  let tempMoves = base.getValidMoveList()
  let numMoves = min(2 + random([0,1,2]), tempMoves.length)
  let moves = []
  shuffle(tempMoves, true)
  for (let i = 0; i < numMoves; i++)
    moves.push(moveList[tempMoves[i]])
  return new Furnimon(base, level, moves)
}

function getLegendary(level=100, id=1000)
{
  base = furnimonList[furnimonList.length-1].copy()
  let moves = [moveList[moveList.length-2], moveList[moveList.length-1]]
  let tempMoves = base.getValidMoveList()
  let numMoves = 2
  shuffle(tempMoves, true)
  for (let i = 0; i < numMoves; i++)
    moves.push(moveList[tempMoves[i]])
  return new Furnimon(base, level, moves)
}

function initializeAssets()
{ 
  assets.insert('Background-Battle_1', loadImage('Assets/Images/Backgrounds/background6.png'));
  assets.insert('BattleGround-Ground_1', loadImage('Assets/Images/Ground/groundOne.png'));

  assets.insert('Icon-Info_1', loadImage('Assets/Images/Icons/infoIcon.png'));

  assets.insert('Icon-Box_1', loadImage('Assets/Images/Icons/boxIcon.png'));
  assets.insert('Icon-Attack_1', loadImage('Assets/Images/Icons/attackIcon.png'));
  assets.insert('Icon-Cart_1', loadImage('Assets/Images/Icons/cartIcon.png'));
  assets.insert('Icon-Run_1', loadImage('Assets/Images/Icons/runIcon.png'));
  
  assets.insert('Anim-Gang_1', loadImage('Assets/Images/Animations/gang.png'));
  assets.insert('Character-Player_1', loadImage('Assets/Images/Players/Character/trainer.png'));


  // id, name, damage, cost, isSpecial, affinity, description
  moveList = readTextFile('Assets/Data/Moves/moves.txt', 'moves')
  furnimonList = readTextFile('Assets/Data/Furnimon/furnimon.txt', 'furnimon')
  print(furnimonList)
}
